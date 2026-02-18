'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Chrome, Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function LoginContent() {
    const searchParams = useSearchParams()
    const next = searchParams.get('next') || '/'

    const handleLogin = async () => {
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 p-4 transition-colors">
            <div className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="p-6 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
                    <p className="mb-6 text-sm text-gray-500 dark:text-slate-400">Sign in to access your reading list</p>

                    <button
                        onClick={handleLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-offset-2 transition-all shadow-sm"
                    >
                        <Chrome className="h-4 w-4" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
