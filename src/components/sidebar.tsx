'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Archive, LogOut, Menu } from 'lucide-react'
import { cn } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    const items = [
        { name: 'To Read', href: '/', icon: BookOpen },
        { name: 'Archive', href: '/archive', icon: Archive },
    ]

    return (
        <div className={cn("flex h-full flex-col border-r border-slate-200 bg-slate-50/50", className)}>
            <div className="flex h-14 items-center border-b border-slate-200 px-6">
                <span className="text-lg font-bold text-slate-900">ReadLater</span>
            </div>

            <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-4">
                    {items.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-slate-200 text-slate-900"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t border-slate-200 p-4">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-red-600"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
