import { supabase } from '@/lib/supabase/client'

export interface AuthorizedUser {
    id: string
    email: string
    name: string
    role: 'admin' | 'supersenior'
    is_active: boolean
    created_at: string
    updated_at: string
}

// Get all authorized users
export async function getAuthorizedUsers(): Promise<AuthorizedUser[]> {
    try {
        const { data, error } = await supabase
            .from('authorized_users')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error fetching authorized users:', error)
        return []
    }
}

// Add a new authorized user
export async function addAuthorizedUser(
    email: string,
    name: string,
    role: 'admin' | 'supersenior'
): Promise<AuthorizedUser | null> {
    try {
        const { data, error } = await supabase
            .from('authorized_users')
            .insert({
                email: email.toLowerCase().trim(),
                name: name.trim(),
                role,
            })
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error adding authorized user:', error)
        return null
    }
}

// Update an authorized user
export async function updateAuthorizedUser(
    id: string,
    updates: Partial<Pick<AuthorizedUser, 'name' | 'role' | 'is_active'>>
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('authorized_users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating authorized user:', error)
        return false
    }
}

// Delete an authorized user
export async function deleteAuthorizedUser(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('authorized_users')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting authorized user:', error)
        return false
    }
}
