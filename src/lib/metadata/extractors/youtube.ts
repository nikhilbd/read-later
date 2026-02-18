import * as cheerio from 'cheerio'
import { LinkMetadata } from '@/types/metadata'

export const YouTubeExtractor = {
    canHandle(url: string): boolean {
        return url.includes('youtube.com/') || url.includes('youtu.be/')
    },

    async extract(url: string, html: string): Promise<LinkMetadata> {
        const $ = cheerio.load(html)
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
        const image_url = $('meta[property="og:image"]').attr('content') || ''
        const site_name = 'YouTube'

        return {
            title,
            description,
            image_url,
            site_name,
            type: 'video',
            content: `YouTube Video: ${title}\n\n${description}`
        }
    }
}
