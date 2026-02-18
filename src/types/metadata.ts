export interface LinkMetadata {
    title: string
    description: string
    image_url: string
    site_name: string
    type: 'article' | 'video' | 'website'
    content?: string
}

export interface Extractor {
    canHandle(url: string): boolean
    extract(url: string, html: string): Promise<LinkMetadata>
}
