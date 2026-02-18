'use client'

import { useState, useEffect } from 'react'
import { Settings, Bookmark, Copy, Check, MousePointer2 } from 'lucide-react'

export default function SettingsPage() {
    const [baseUrl, setBaseUrl] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])

    const bookmarkletCode = `javascript:(function(){
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const w = 450;
  const h = 400;
  const left = (window.screen.width / 2) - (w / 2);
  const top = (window.screen.height / 2) - (h / 2);
  window.open('${baseUrl}/add-link?url=' + url + '&title=' + title, 'ReadLater', 'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',location=no,menubar=no,status=no,toolbar=no');
})();`.replace(/\n/g, '').replace(/\s\s+/g, ' ')

    const handleCopy = () => {
        navigator.clipboard.writeText(bookmarkletCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50/30">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                        <Settings className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <Bookmark className="h-5 w-5 text-blue-500" />
                        <h2>Browser Bookmarklet</h2>
                    </div>

                    <p className="mb-6 text-slate-600 leading-relaxed">
                        The Bookmarklet is the fastest way to save links while browsing.
                        Simply click it while on any page, and it will be sent straight to your queue.
                    </p>

                    <div className="space-y-6">
                        <section>
                            <h3 className="mb-3 text-sm font-medium text-slate-900 flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">1</span>
                                Setup Instructions
                            </h3>
                            <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-sm text-slate-600">
                                <ol className="list-decimal space-y-2 pl-4">
                                    <li>Make sure your browser's <strong>Bookmarks Bar</strong> is visible (Cmd+Shift+B)</li>
                                    <li>Drag the blue button below directly into your bookmarks bar</li>
                                    <li>Give it a name like <strong>"Read Later"</strong></li>
                                </ol>
                            </div>
                        </section>

                        <section className="flex flex-col items-center justify-center py-6 border-y border-slate-50">
                            <a
                                href={bookmarkletCode}
                                className="group relative flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
                                onClick={(e) => e.preventDefault()}
                            >
                                <MousePointer2 className="h-5 w-5 animate-bounce" />
                                Save to Read Later
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
                                    ← Drag this button to your bookmarks bar
                                </div>
                            </a>
                        </section>

                        <section>
                            <h3 className="mb-3 text-sm font-medium text-slate-900 flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">2</span>
                                Troubleshooting
                            </h3>
                            <p className="text-sm text-slate-500">
                                If drag and drop doesn't work, you can create a new bookmark manually and paste this code as the URL:
                            </p>
                            <div className="mt-3 relative">
                                <div className="max-h-24 overflow-hidden rounded-lg bg-slate-900 p-3 pr-12 text-[10px] font-mono text-slate-300 break-all leading-normal">
                                    {bookmarkletCode}
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="absolute right-2 top-2 rounded-md bg-slate-800 p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-6 rounded-lg bg-amber-50 p-4 border border-amber-100">
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Note:</strong> Some websites with strict security policies (CSP) may block the bookmarklet from sending data.
                        If it doesn't work on a specific site, you may need to add it manually within the app.
                    </p>
                </div>
            </div>
        </main>
    )
}
