'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { ExternalLink, Trash2, Archive, Clock, Video, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './ui/button'

interface LinkCardProps {
    link: any
    onStatusChange: (id: string, status: 'unread' | 'archived') => Promise<void>
    onDelete: (id: string) => Promise<void>
}

export function LinkCard({ link, onStatusChange, onDelete }: LinkCardProps) {
    const [loading, setLoading] = useState(false)
    const [summaryLoading, setSummaryLoading] = useState(false)
    const [summary, setSummary] = useState(link.summary)
    const [expanded, setExpanded] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(false)

    useEffect(() => {
        const currentId = link?.id;
        if (summary || summaryLoading) return;
        if (!currentId || currentId === 'undefined' || currentId === 'null') return;

        setSummaryLoading(true)
        fetch(`/api/links/${currentId}/summarize`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data.summary) setSummary(data.summary)
                else setSummary('Could not generate summary.')
            })
            .catch(() => setSummary('Failed to load summary.'))
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

    let domain = ''
    try {
        domain = new URL(link.url).hostname.replace('www.', '')
    } catch {
        domain = link.url
    }

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-blue-200">
            {/* Content Area */}
            <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-col mb-3">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {link.title || link.url}
                            </a>
                        </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
                        <span className="uppercase tracking-wider">{link.site_name || domain}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-normal lowercase italic">{domain}</span>
                        {link.type === 'video' && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                                    <Video className="h-3 w-3" />
                                    VIDEO
                                </span>
                            </>
                        )}
                        <span className="ml-auto flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3 w-3" />
                            {link.reading_time} min
                        </span>
                    </div>
                </div>

                <div className="flex-1 text-sm text-slate-600 relative">
                    {summaryLoading ? (
                        <div className="flex items-center gap-2 text-slate-400 italic py-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Generating summary...
                        </div>
                    ) : (
                        <div className={`prose prose-slate prose-sm max-w-none ${!expanded ? 'line-clamp-2' : ''}`}>
                            {summary || link.description ? (
                                <ReactMarkdown>{summary || link.description}</ReactMarkdown>
                            ) : (
                                <span className="italic text-slate-400">No summary available.</span>
                            )}
                        </div>
                    )}

                    {(summary || link.description) && !summaryLoading && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-2 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            {expanded ? (
                                <>Show Less <ChevronUp className="h-3 w-3" /></>
                            ) : (
                                <>Read More <ChevronDown className="h-3 w-3" /></>
                            )}
                        </button>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-50 pt-3">
                    {link.status === 'unread' ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(() => onStatusChange(link.id, 'archived'))}
                            disabled={loading || confirmDelete}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Archive"
                        >
                            <Archive className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(() => onStatusChange(link.id, 'unread'))}
                            disabled={loading || confirmDelete}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                            title="Restore"
                        >
                            <Archive className="h-4 w-4 rotate-180" />
                        </Button>
                    )}

                    {confirmDelete ? (
                        <div className="flex items-center gap-1 ml-2 animate-in fade-in slide-in-from-right-1">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeleteClick}
                                disabled={loading}
                                className="h-7 px-2 text-[10px] font-bold"
                            >
                                DELETE
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setConfirmDelete(false)}
                                disabled={loading}
                                className="h-7 px-2 text-[10px] font-bold"
                            >
                                NO
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(true)}
                            disabled={loading}
                            className="h-8 w-8 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50"
                            title="Delete"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
