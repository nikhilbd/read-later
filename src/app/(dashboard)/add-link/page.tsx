'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

function AddLinkContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const url = searchParams.get('url')
        const title = searchParams.get('title')

        if (!url) {
            setStatus('error')
            setErrorMessage('No URL provided')
            return
        }

        async function saveLink() {
            try {
                const response = await fetch('/api/links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url, title })
                })

                if (response.ok) {
                    setStatus('success')
                    // Close the window after a short delay
                    setTimeout(() => {
                        window.close()
                    }, 1500)
                } else {
                    const errorData = await response.json()
                    setStatus('error')
                    setErrorMessage(errorData.error || 'Failed to save link')
                }
            } catch (error) {
                console.error('Error saving link:', error)
                setStatus('error')
                setErrorMessage('Network error while saving link')
            }
        }

        saveLink()
    }, [searchParams])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-slate-950 p-6 text-center transition-colors">
            {status === 'loading' && (
                <>
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400 mb-4" />
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Saving to Read Later...</h1>
                </>
            )}

            {status === 'success' && (
                <>
                    <CheckCircle2 className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Link Added!</h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This window will close automatically.</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <XCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Oops!</h1>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                    <button
                        onClick={() => window.close()}
                        className="mt-6 rounded-md bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Close Window
                    </button>
                </>
            )}
        </div>
    )
}

export default function AddLinkPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <AddLinkContent />
        </Suspense>
    )
}
