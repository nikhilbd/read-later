'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Trash2, Archive, Clock, Video, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './ui/button'

interface LinkCardProps {
    link: any
    onStatusChange: (id: string, status: 'unread' | 'archived') => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function LinkCard({ link, onStatusChange, onDelete }: LinkCardProps) {
    console.log('LinkCard link:', link);
    const [loading, setLoading] = useState(false)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [summary, setSummary] = useState(link.summary)
    const [expanded, setExpanded] = useState(false)

    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const currentId = link?.id;

        if (summary || summaryLoading) return;

        if (!currentId || currentId === 'undefined' || currentId === 'null') {
            console.warn('Skipping summary fetch: Invalid ID', currentId);
            return;
        }

        console.log(`Starting summary fetch for: ${currentId}`);
        setSummaryLoading(true)

        fetch(`/api/links/${currentId}/summarize`, { method: 'POST' })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.summary) {
                    setSummary(data.summary)
                } else {
                    setSummary('Could not generate summary.')
                }
            })
            .catch(err => {
                console.error('Summary fetch failed:', err)
                setSummary('Failed to load summary.')
            })
            .finally(() => setSummaryLoading(false))

    }, [link.id, summary, summaryLoading])

    const handleAction = async (action: () => Promise<void>) => {
        setLoading(true)
        await action()
        setLoading(false)
    }

    const handleDeleteClick = () => {
        if (confirmDelete) {
            handleAction(() => onDelete(link.id))
            setConfirmDelete(false)
        } else {
            setConfirmDelete(true)
        }
    }

    return (
        <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
            {/* Visual Indicator / Thumbnail Area */}
            <div className="flex w-full sm:w-48 shrink-0 flex-col bg-slate-100 sm:border-r border-slate-200">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
                    {link.image_url ? (
                        <img src={link.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full items-center justify-center text-slate-400">
                            <ExternalLink className="h-8 w-8" />
                        </div>
                    )}
                    {link.type === 'video' && (
                        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-red-600/90 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                            <Video className="h-3 w-3" />
                            VIDEO
                        </span>
                    )}
                </div>
                <div className="flex flex-1 flex-col justify-center p-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Clock className="h-3 w-3" />
                        {link.reading_time} min read
                    </div>
                    <div className="font-medium truncate">{link.site_name}</div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-2">
                    <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {link.title || link.url}
                        </a>
                    </h3>
                </div>

                <div className="flex-1 text-sm text-slate-600 relative">
                    {summaryLoading ? (
                        <div className="flex items-center gap-2 text-slate-400 italic py-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Generating AI summary...
                        </div>
                    ) : (
                        <div className={`prose-sm ${!expanded ? 'line-clamp-2' : ''}`}>
                            {summary || link.description || "No summary available."}
                        </div>
                    )}

                    {summary && !summaryLoading && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-1 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                            {expanded ? (
                                <>Show Less <ChevronUp className="h-3 w-3" /></>
                            ) : (
                                <>Read More <ChevronDown className="h-3 w-3" /></>
                            )}
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    {link.status === 'unread' ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(() => onStatusChange(link.id, 'archived'))}
                            disabled={loading || confirmDelete}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(() => onStatusChange(link.id, 'unread'))}
                            disabled={loading || confirmDelete}
                            className="text-slate-500 hover:text-slate-900"
                        >
                            <Archive className="mr-2 h-4 w-4 rotate-180" />
                            To Read
                        </Button>
                    )}

                    {confirmDelete ? (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <span className="text-xs font-medium text-slate-500">Sure?</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteClick}
                                disabled={loading}
                                className="h-8 px-3"
                            >
                                Yes
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDelete(false)}
                                disabled={loading}
                                className="h-8 px-3"
                            >
                                No
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(true)}
                            disabled={loading}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
