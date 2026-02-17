import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractMetadata } from '@/lib/metadata'
import { calculateReadingTime } from '@/lib/reading-time'
import { generateSummary } from '@/lib/gemini'
import fs from 'fs'

export async function POST(request: Request) {
    try {
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] POST /api/links called\n`);

        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] User check: ${user ? user.id : 'No user'} Error: ${userError ? JSON.stringify(userError) : 'None'}\n`);

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
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Attempting to save: ${JSON.stringify({ user_id: user.id, url, title: metadata.title })}\n`);

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
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Supabase error: ${JSON.stringify(error)}\n`);
            console.error('Supabase error:', JSON.stringify(error, null, 2))
            return NextResponse.json({ error: 'Failed to save link', details: error }, { status: 500 })
        }

        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Successfully saved link: ${data.id}\n`);
        console.log('Successfully saved link:', data.id)
        return NextResponse.json(data)
    } catch (error) {
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Error in API route: ${error}\n`);
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
