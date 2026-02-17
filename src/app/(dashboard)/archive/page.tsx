import { Suspense } from 'react'
import LinkList from '@/components/link-list'

export default function ArchivePage() {
    return (
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Archive</h1>
                    <p className="text-sm text-slate-500">Already read links</p>
                </div>

                <Suspense fallback={<div className="text-sm text-slate-500">Loading archive...</div>}>
                    <LinkList status="archived" />
                </Suspense>
            </div>
        </main>
    )
}
