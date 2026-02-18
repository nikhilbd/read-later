'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
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
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-sm overflow-hidden rounded-lg border bg-white shadow-sm">
                <div className="p-6 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mb-6 text-sm text-gray-500">Sign in to access your reading list</p>

                    <button
                        onClick={handleLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all"
                    >
                        <Chrome className="h-4 w-4" />
                        Continue with Google
                    </button>
                </div>
            </div>
        </div>
    )
}
