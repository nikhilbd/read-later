import { Suspense } from 'react'
import LinkList from '@/components/link-list'

export default function ArchivePage() {
    return (
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/50 dark:bg-slate-950/50 transition-colors">
            <div className="mx-auto max-w-4xl">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Archive</h1>
                    <p className="text-slate-500 dark:text-slate-400">Already read links</p>
                </header>

                <Suspense fallback={<div className="text-sm text-slate-500">Loading archive...</div>}>
                    <LinkList status="archived" />
                </Suspense>
            </div>
        </main>
    )
}
