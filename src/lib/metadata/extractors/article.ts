import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import * as cheerio from 'cheerio'
import { LinkMetadata } from '@/types/metadata'

export const ArticleExtractor = {
    async extract(url: string, html: string): Promise<LinkMetadata> {
        const $ = cheerio.load(html)
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || ''
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || ''
        const image_url = $('meta[property="og:image"]').attr('content') || ''
        const site_name = $('meta[property="og:site_name"]').attr('content') || ''

        const doc = new DOMParser().parseFromString(html, 'text/html')
        const reader = new Readability(doc as any)
        const article = reader.parse()

        if (article && article.textContent && article.textContent.length > 200) {
            return {
                title: article.title || title,
                description: article.excerpt || description,
                image_url,
                site_name: article.siteName || site_name,
                type: 'article',
                content: article.textContent.replace(/\s+/g, ' ').trim().slice(0, 15000)
            }
        }

        // Fallback for cases where readability fails
        $('script, style, nav, header, footer').remove()
        const content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 10000)

        return {
            title,
            description,
            image_url,
            site_name,
            type: content.length > 500 ? 'article' : 'website',
            content
        }
    }
}
