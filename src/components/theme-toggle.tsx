'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-8 w-8 rounded-md bg-slate-100 dark:bg-slate-800 animate-pulse" />
    }

    const themes = [
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
    ]

    return (
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
            {themes.map((t) => (
                <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${theme === t.name
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                        } ${t.name === resolvedTheme && theme === 'system' ? 'ring-2 ring-blue-400/50' : ''}`}
                    title={`Set theme to ${t.name}`}
                    aria-label={`Switch to ${t.name} theme`}
                >
                    <t.icon className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Switch to {t.name} theme</span>
                </button>
            ))}
        </div>
    )
}
