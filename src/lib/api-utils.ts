import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
    constructor(public message: string, public status: number = 400) {
        super(message)
    }
}

export function handleApiError(error: unknown) {
    console.error('API Error:', error)

    if (error instanceof ApiError) {
        return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof ZodError) {
        return NextResponse.json(
            { error: 'Validation failed', details: error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
    )
}

export function successResponse(data: any, status: number = 200) {
    return NextResponse.json(data, { status })
}
