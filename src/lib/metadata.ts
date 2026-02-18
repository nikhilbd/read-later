import { LinkMetadata } from '@/types/metadata'
import { YouTubeExtractor } from './metadata/extractors/youtube'
import { ArticleExtractor } from './metadata/extractors/article'

export type { LinkMetadata }

export async function extractMetadata(url: string): Promise<LinkMetadata> {
    try {
        const Controller = new AbortController()
        const timeoutId = setTimeout(() => Controller.abort(), 8000)

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

        if (YouTubeExtractor.canHandle(url)) {
            return await YouTubeExtractor.extract(url, html)
        }

        return await ArticleExtractor.extract(url, html)
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
