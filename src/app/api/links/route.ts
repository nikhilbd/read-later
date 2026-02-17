import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractMetadata } from '@/lib/metadata'
import { calculateReadingTime } from '@/lib/reading-time'
import { generateSummary } from '@/lib/gemini'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { url } = await request.json()

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 })
        }

        // 1. Extract Metadata
        const metadata = await extractMetadata(url)

        // 2. Calculate Reading Time
        const readingTime = calculateReadingTime(metadata.content || '')

        // 3. Generate Summary - MOVED TO LAZY LOADING
        // const summary = await generateSummary(metadata.content || metadata.description, metadata.type)
        const summary = null;

        // 4. Save to Database

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
                summary,
                reading_time: readingTime,
                status: 'unread',
            })
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', JSON.stringify(error, null, 2))
            return NextResponse.json({ error: 'Failed to save link', details: error }, { status: 500 })
        }

        console.log('Successfully saved link:', data.id)
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error adding link:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching links:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
