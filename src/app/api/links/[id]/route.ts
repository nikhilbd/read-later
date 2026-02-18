import { createClient } from '@/lib/supabase/server'
import { handleApiError, successResponse, ApiError } from '@/lib/api-utils'

import { updateLinkSchema } from '@/types/schemas'

export async function PATCH(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new ApiError('Unauthorized', 401)
        }

        const body = await request.json()
        const { status } = updateLinkSchema.parse(body)

        const { error } = await supabase
            .from('links')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            throw error
        }

        return successResponse({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}

export async function DELETE(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new ApiError('Unauthorized', 401)
        }

        const { error } = await supabase
            .from('links')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id)

        if (error) {
            throw error
        }

        return successResponse({ success: true })
    } catch (error) {
        return handleApiError(error)
    }
}
