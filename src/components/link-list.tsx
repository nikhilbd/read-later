import { createClient } from '@/lib/supabase/server'
import { LinkCard } from '@/components/link-card'
import { LinkListClient } from '@/components/link-list-client'

export default async function LinkList({ status }: { status: 'unread' | 'archived' }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: links } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', status)
        .order('created_at', { ascending: false })

    return <LinkListClient initialLinks={links || []} />
}
