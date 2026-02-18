import { Sidebar } from '@/components/sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Archive, LogOut, Settings } from 'lucide-react'
import { SignOutButton } from '@/components/sign-out-button'
import { headers } from 'next/headers'

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
        <div className="flex h-screen bg-white">
            <Sidebar className="hidden w-64 md:flex flex-shrink-0" />
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                    <span className="text-lg font-bold text-slate-900">ReadLater</span>
                    <nav className="flex items-center gap-2">
                        <Link href="/" className="p-2 text-slate-600 hover:text-slate-900">
                            <BookOpen className="h-5 w-5" />
                        </Link>
                        <Link href="/archive" className="p-2 text-slate-600 hover:text-slate-900">
                            <Archive className="h-5 w-5" />
                        </Link>
                        <Link href="/settings" className="p-2 text-slate-600 hover:text-slate-900">
                            <Settings className="h-5 w-5" />
                        </Link>
                        <SignOutButton />
                    </nav>
                </header>
                {children}
            </div>
        </div>
    )
}
