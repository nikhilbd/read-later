import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractMetadata } from '../metadata'

// Mock the new dependencies
vi.mock('@mozilla/readability', () => ({
  Readability: class {
    parse() {
      return { textContent: 'Extracted article content '.repeat(20) }
    }
  }
}))

vi.mock('youtube-caption-extractor', () => ({
  getSubtitles: vi.fn().mockResolvedValue([{ text: 'Hello' }, { text: 'world' }])
}))

describe('extractMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('extracts metadata and uses Readability for articles', async () => {
    const mockHtml = `
      <html>
        <head>
          <title>Article Title</title>
        </head>
        <body>
          <article>
            <p>Main article content that should be extracted by readability.</p>
          </article>
        </body>
      </html>
    `

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    })

    const metadata = await extractMetadata('https://example.com/article')

    expect(metadata.title).toBe('Article Title')
    expect(metadata.type).toBe('article')
    expect(metadata.content).toBe('Extracted article content '.repeat(20).trim())
  })

  it('extracts YouTube transcripts for video type', async () => {
    const mockHtml = `<html><head><title>YouTube Video</title></head><body></body></html>`

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockHtml),
    })

    const metadata = await extractMetadata('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

    expect(metadata.type).toBe('video')
    expect(metadata.content).toContain('Transcript:')
    expect(metadata.content).toContain('Hello world')
  })

  it('handles fetch errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const url = 'https://broken.link'
    const metadata = await extractMetadata(url)

    expect(metadata.title).toBe(url)
    expect(metadata.type).toBe('website')
  })
})
