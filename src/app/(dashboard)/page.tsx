import { Suspense } from 'react'
import { AddLinkForm } from '@/components/add-link-form'
import LinkList from '@/components/link-list'
import { Sidebar } from '@/components/sidebar' // Import Sidebar for mobile drawer potentially, handled in Layout though.

export default function DashboardPage() {
    return (
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
            <div className="mx-auto max-w-4xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">To Read</h1>
                    <p className="text-slate-500 dark:text-slate-400">Save articles and videos to summarize and read later.</p>
                </header>

                <div className="mb-10">
                    <AddLinkForm />
                </div>
            </div>

            <Suspense fallback={<div className="text-sm text-slate-500">Loading your list...</div>}>
                <LinkList status="unread" />
            </Suspense>
        </main>
    )
}
