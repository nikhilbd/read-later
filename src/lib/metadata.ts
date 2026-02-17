import * as cheerio from 'cheerio'

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
        const timeoutId = setTimeout(() => Controller.abort(), 5000) // 5s timeout

        const response = await fetch(url, {
            signal: Controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; ReadLaterBot/1.0)',
            },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`)
        }

        const html = await response.text()
        const $ = cheerio.load(html)

        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
        const image_url = $('meta[property="og:image"]').attr('content') || ''
        const site_name = $('meta[property="og:site_name"]').attr('content') || ''
        const type = ($('meta[property="og:type"]').attr('content') as any) || 'website'

        // Simple text extraction for summarization
        // Remove scripts, styles, and comments
        $('script').remove()
        $('style').remove()
        $('nav').remove()
        $('header').remove()
        $('footer').remove()

        const content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000) // Limit to 10k chars for now

        // Determine type more accurately if possible
        let determinedType: 'article' | 'video' | 'website' = 'website'
        if (type.includes('video') || url.includes('youtube.com') || url.includes('youtu.be')) {
            determinedType = 'video'
        } else if (type.includes('article') || content.length > 500) {
            determinedType = 'article'
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
