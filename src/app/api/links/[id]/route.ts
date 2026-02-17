import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
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

        const { status } = await request.json()

        // Validate status
        if (!['unread', 'archived'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const { error } = await supabase
            .from('links')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(
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

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
