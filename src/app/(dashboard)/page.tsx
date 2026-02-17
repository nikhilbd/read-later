import { Suspense } from 'react'
import { AddLinkForm } from '@/components/add-link-form'
import LinkList from '@/components/link-list'
import { Sidebar } from '@/components/sidebar' // Import Sidebar for mobile drawer potentially, handled in Layout though.

export default function DashboardPage() {
    return (
        <main className="flex-1 overflow-y-auto bg-slate-50/30 p-4 md:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">To Read</h1>
                        <p className="text-sm text-slate-500">Your curated reading list</p>
                    </div>
                    <div className="w-full sm:w-auto sm:min-w-[400px]">
                        <AddLinkForm />
                    </div>
                </div>

                <Suspense fallback={<div className="text-sm text-slate-500">Loading your list...</div>}>
                    <LinkList status="unread" />
                </Suspense>
            </div>
        </main>
    )
}
