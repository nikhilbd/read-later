import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractMetadata } from '@/lib/metadata'
import { generateSummary } from '@/lib/gemini'

export async function POST(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 1. Fetch the link from DB to get the URL
        const { data: link, error: fetchError } = await supabase
            .from('links')
            .select('url, type')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single()

        if (fetchError || !link) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 })
        }

        // 2. Re-fetch content (since we don't store full content in DB)
        const metadata = await extractMetadata(link.url)

        // 3. Generate Summary
        const summary = await generateSummary(metadata.content || metadata.description, link.type as any)

        // 4. Update the link with the summary
        const { error: updateError } = await supabase
            .from('links')
            .update({ summary })
            .eq('id', params.id)

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update summary' }, { status: 500 })
        }

        return NextResponse.json({ summary })
    } catch (error) {
        console.error('Error generating summary:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
