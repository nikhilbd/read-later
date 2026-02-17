import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractMetadata } from '../metadata'

describe('extractMetadata', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('extracts metadata from a simple HTML page', async () => {
        const mockHtml = `
      <html>
        <head>
          <title>Test Title</title>
          <meta name="description" content="Test Description">
          <meta property="og:image" content="https://example.com/image.jpg">
        </head>
        <body>
          <p>This is the content of the page. It has some text that we want to extract.</p>
        </body>
      </html>
    `

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(mockHtml),
        })

        const metadata = await extractMetadata('https://example.com')

        expect(metadata.title).toBe('Test Title')
        expect(metadata.description).toBe('Test Description')
        expect(metadata.image_url).toBe('https://example.com/image.jpg')
        expect(metadata.type).toBe('website')
        expect(metadata.content).toContain('This is the content of the page')
    })

    it('identifies a video type for YouTube URLs', async () => {
        const mockHtml = `<html><head><title>YouTube Video</title></head><body></body></html>`

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(mockHtml),
        })

        const metadata = await extractMetadata('https://www.youtube.com/watch?v=123')
        expect(metadata.type).toBe('video')
    })

    it('handles fetch errors gracefully', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

        const url = 'https://broken.link'
        const metadata = await extractMetadata(url)

        expect(metadata.title).toBe(url)
        expect(metadata.type).toBe('website')
    })
})
