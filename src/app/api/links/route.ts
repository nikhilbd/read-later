import { createClient } from '@/lib/supabase/server'
import { extractMetadata } from '@/lib/metadata'
import { calculateReadingTime } from '@/lib/reading-time'
import { env } from '@/lib/env'
import { handleApiError, successResponse, ApiError } from '@/lib/api-utils'

import { createLinkSchema } from '@/types/schemas'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new ApiError('Unauthorized', 401)
        }

        const body = await request.json()
        const { url } = createLinkSchema.parse(body)

        // 1. Extract Metadata
        const metadata = await extractMetadata(url)

        // 2. Calculate Reading Time
        const readingTime = calculateReadingTime(metadata.content || '')

        // 3. Save to Database
        const { data, error } = await supabase
            .from('links')
            .insert({
                user_id: user.id,
                url,
                title: metadata.title,
                description: metadata.description,
                image_url: metadata.image_url,
                site_name: metadata.site_name,
                type: metadata.type,
                summary: null,
                reading_time: readingTime,
                status: 'unread',
            })
            .select()
            .single()

        if (error) {
            throw error
        }

        return successResponse(data)
    } catch (error) {
        return handleApiError(error)
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new ApiError('Unauthorized', 401)
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'unread'

        const { data, error } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', status)
            .order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        return successResponse(data)
    } catch (error) {
        return handleApiError(error)
    }
}
