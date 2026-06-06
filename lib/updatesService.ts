import { supabase } from './supabase/client'

// Update interface
export interface Update {
    id: string
    content: string
    createdAt: Date
    createdBy: string
}

// Get all updates from Supabase
export async function getUpdates(): Promise<Update[]> {
    try {
        const { data, error } = await supabase
            .from('updates')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((update) => ({
            id: update.id,
            content: update.content,
            createdAt: new Date(update.created_at),
            createdBy: update.created_by || 'Unknown',
        }))
    } catch (error) {
        console.error('Error loading updates:', error)
        return []
    }
}

// Add update to Supabase
export async function addUpdate(content: string, createdBy: string): Promise<Update | null> {
    try {
        const { data, error } = await supabase
            .from('updates')
            .insert({
                content,
                created_by: createdBy,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            content: data.content,
            createdAt: new Date(data.created_at),
            createdBy: data.created_by || 'Unknown',
        }
    } catch (error) {
        console.error('Error adding update:', error)
        return null
    }
}

// Update an existing update in Supabase
export async function updateUpdate(id: string, content: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('updates').update({ content }).eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating update:', error)
        return false
    }
}

// Delete update from Supabase
export async function deleteUpdate(id: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('updates').delete().eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting update:', error)
        return false
    }
}

// Subscribe to real-time updates changes
export function subscribeToUpdates(callback: () => void): () => void {
    const channel = supabase
        .channel('updates-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'updates' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
