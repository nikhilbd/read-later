import { z } from 'zod'

export const createLinkSchema = z.object({
    url: z.string().url('Invalid URL format'),
})

export const updateLinkSchema = z.object({
    status: z.enum(['unread', 'archived']),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>
