import { Sidebar } from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Archive, LogOut, Settings } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'
import { headers } from 'next/headers'

import { MobileHeader } from '@/components/mobile-header'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        const headerList = await headers()
        const fullUrl = headerList.get('x-url') || ''
        let nextParam = ''
        try {
            const url = new URL(fullUrl)
            nextParam = `?next=${encodeURIComponent(url.pathname + url.search)}`
        } catch (e) {
            // Fallback if URL is invalid
        }
        redirect(`/login${nextParam}`)
    }

    return (
        <div className="flex h-screen bg-white dark:bg-slate-950">
            <Sidebar className="hidden w-64 md:flex flex-shrink-0" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <MobileHeader />
                {children}
            </div>
        </div>
    )
}
