'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Archive, LogOut, Menu, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'

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
        { name: 'Settings', href: '/settings', icon: Settings },
    ]

    return (
        <div className={cn("flex h-full flex-col border-r border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50", className)}>
            <div className="flex h-14 items-center border-b border-slate-200 px-6 dark:border-slate-800">
                <span className="text-lg font-bold text-slate-900 dark:text-white">ReadLater</span>
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
                                    ? "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 p-4 space-y-4">
                <div className="px-3">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Theme</p>
                    <ThemeToggle />
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
