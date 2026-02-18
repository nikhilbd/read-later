export type LinkStatus = 'unread' | 'archived'
export type LinkType = 'article' | 'video' | 'website'

export interface Link {
    id: string
    user_id: string
    url: string
    title: string
    description: string
    image_url: string
    site_name: string
    type: LinkType
    summary?: string | null
    reading_time?: number
    status: LinkStatus
    created_at: string
    updated_at: string
}
