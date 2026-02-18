import Link from 'next/link'
import { BookOpen, Archive, Settings } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { SignOutButton } from '@/components/sign-out-button'

export function MobileHeader() {
    return (
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:hidden">
            <span className="text-lg font-bold text-slate-900 dark:text-white">ReadLater</span>
            <nav className="flex items-center gap-2">
                <ThemeToggle />
                <Link href="/" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <BookOpen className="h-5 w-5" />
                </Link>
                <Link href="/archive" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <Archive className="h-5 w-5" />
                </Link>
                <Link href="/settings" className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    <Settings className="h-5 w-5" />
                </Link>
                <SignOutButton />
            </nav>
        </header>
    )
}
