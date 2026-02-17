import * as cheerio from 'cheerio'
import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import { getSubtitles } from 'youtube-caption-extractor'

export interface LinkMetadata {
    title: string
    description: string
    image_url: string
    site_name: string
    type: 'article' | 'video' | 'website'
    content?: string // Extracted text content for summarization
}

export async function extractMetadata(url: string): Promise<LinkMetadata> {
    try {
        const Controller = new AbortController()
        const timeoutId = setTimeout(() => Controller.abort(), 8000) // Increase to 8s for transcripts

        const response = await fetch(url, {
            signal: Controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        // 1. Basic Metadata Extraction (Cheerio is best for meta tags)
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
        const image_url = $('meta[property="og:image"]').attr('content') || ''
        const site_name = $('meta[property="og:site_name"]').attr('content') || ''
        const ogType = ($('meta[property="og:type"]').attr('content') as any) || ''

        let content = ''
        let determinedType: 'article' | 'video' | 'website' = 'website'

        // 2. Handle YouTube Specially
        const isYouTube = url.includes('youtube.com/') || url.includes('youtu.be/')
        if (isYouTube) {
            determinedType = 'video'
            try {
                const videoIdMatch = url.match(/(?:v=|\/|be\/)([\w-]{11})(?:[&?]|$)/)
                const videoId = videoIdMatch ? videoIdMatch[1] : null

                if (videoId) {
                    const subtitles = await getSubtitles({ videoID: videoId, lang: 'en' })
                    const transcript = subtitles.map((s: any) => s.text).join(' ')

                    // Also try to get channel name from metadata if possible
                    const channelName = $('link[itemprop="name"]').attr('content') || site_name || 'YouTube'

                    content = `Type: YouTube Video
Channel: ${channelName}
Title: ${title}
Description: ${description}

Transcript:
${transcript.slice(0, 15000)}` // Gemini handles 15k chars easily
                }
            } catch (err) {
                console.warn('Could not fetch YouTube transcript:', err)
                content = `Type: YouTube Video\nTitle: ${title}\nDescription: ${description}`
            }
        } else {
            // 3. Handle Articles / General Web with Readability
            try {
                const doc = new DOMParser().parseFromString(html, 'text/html')
                const reader = new Readability(doc as any)
                const article = reader.parse()

                if (article && article.textContent && article.textContent.length > 200) {
                    content = article.textContent.replace(/\s+/g, ' ').trim().slice(0, 15000)
                    determinedType = 'article'
                } else {
                    // Fallback to Cheerio extraction if readability fails
                    $('script, style, nav, header, footer').remove()
                    content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000)
                    determinedType = (ogType.includes('article') || content.length > 500) ? 'article' : 'website'
                }
            } catch (err) {
                console.error('Readability extraction failed:', err)
                determinedType = 'website'
            }
        }

        return {
            title,
            description,
            image_url,
            site_name,
            type: determinedType,
            content,
        }
    } catch (error) {
        console.error('Error extracting metadata:', error)
        return {
            title: url,
            description: '',
            image_url: '',
            site_name: '',
            type: 'website',
            content: '',
        }
    }
}
