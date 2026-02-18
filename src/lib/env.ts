import { z } from 'zod'

const publicSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const serverSchema = z.object({
    GOOGLE_AI_API_KEY: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

const isServer = typeof window === 'undefined'

function validateEnv() {
    if (isServer) {
        const fullSchema = publicSchema.merge(serverSchema)
        const _env = fullSchema.safeParse(process.env)
        if (!_env.success) {
            console.error('❌ Server-side environment validation failed:', JSON.stringify(_env.error.format(), null, 2))
            throw new Error('Invalid server environment variables')
        }
        return _env.data
    }

    // Client-side: Only validate public variables
    // We must explicitly map them because Next.js build-time replacement 
    // only works with literal process.env.VAR syntax.
    const _publicEnv = publicSchema.safeParse({
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    if (!_publicEnv.success) {
        console.error('❌ Client-side environment validation failed:', JSON.stringify(_publicEnv.error.format(), null, 2))
        throw new Error('Invalid client environment variables')
    }

    return {
        ..._publicEnv.data,
        GOOGLE_AI_API_KEY: '', // Not available on client
        NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    }
}

export const env = validateEnv() as z.infer<typeof publicSchema> & z.infer<typeof serverSchema>
