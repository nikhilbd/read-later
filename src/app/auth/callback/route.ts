import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const fs = require('fs');
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Callback received code: ${code.substring(0, 5)}...\n`);

        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Session exchanged successfully\n`);
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'
            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`)
            } else {
                return NextResponse.redirect(`${origin}${next}`)
            }
        } else {
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Session exchange error: ${JSON.stringify(error)}\n`);
        }
    } else {
        const fs = require('fs');
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Callback missing code param\n`);
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
