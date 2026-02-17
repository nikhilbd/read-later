'use client'

import { useState, useEffect } from 'react'
import { LinkCard } from '@/components/link-card'
import { useRouter } from 'next/navigation'

interface LinkListClientProps {
    initialLinks: any[]
}

export function LinkListClient({ initialLinks }: LinkListClientProps) {
    const [links, setLinks] = useState(initialLinks)
    const router = useRouter()

    useEffect(() => {
        setLinks(initialLinks)
    }, [initialLinks])

    const handleStatusChange = async (id: string, status: 'unread' | 'archived') => {
        // Optimistic update
        setLinks((prev) => prev.filter((link) => link.id !== id))

        try {
            const response = await fetch(`/api/links/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }
            router.refresh()
        } catch (error) {
            console.error('Error updating status:', error)
            // Revert on error (could fetch fresh data)
            router.refresh()
        }
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        setLinks((prev) => prev.filter((link) => link.id !== id))

        try {
            const response = await fetch(`/api/links/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete')
            }
            router.refresh()
        } catch (error) {
            console.error('Error deleting link:', error)
            router.refresh()
        }
    }

    if (links.length === 0) {
        return (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                <p className="text-sm text-slate-500">No links found.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4">
            {links.map((link) => (
                <LinkCard
                    key={link.id}
                    link={link}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                />
            ))}
        </div>
    )
}
