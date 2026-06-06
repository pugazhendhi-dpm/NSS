import { supabase } from './supabase/client'

// Activity interface
export interface Activity {
    id: string
    title: string
    description: string
    category: 'Regular Activities' | 'Special Camps'
    date: Date
    location: string
    participants: number
    imageUrl?: string
    createdAt: Date
    createdBy: string
}

// Get all activities from Supabase
export async function getActivities(): Promise<Activity[]> {
    try {
        const { data, error } = await supabase
            .from('activities')
            .select('*')
            .order('date', { ascending: false })

        if (error) throw error

        // Transform database format to app format
        return (data || []).map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: activity.description || '',
            category: activity.category,
            date: new Date(activity.date),
            location: activity.location || '',
            participants: activity.participants,
            imageUrl: activity.image_url || undefined,
            createdAt: new Date(activity.created_at),
            createdBy: activity.created_by || 'Unknown',
        }))
    } catch (error) {
        console.error('Error loading activities:', error)
        return []
    }
}

// Add activity to Supabase
export async function addActivity(
    title: string,
    description: string,
    category: 'Regular Activities' | 'Special Camps',
    date: Date,
    location: string,
    participants: number,
    imageUrl: string | undefined,
    createdBy: string
): Promise<Activity | null> {
    try {
        const { data, error } = await supabase
            .from('activities')
            .insert({
                title,
                description,
                category,
                date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
                location,
                participants,
                image_url: imageUrl,
                created_by: createdBy,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            title: data.title,
            description: data.description || '',
            category: data.category,
            date: new Date(data.date),
            location: data.location || '',
            participants: data.participants,
            imageUrl: data.image_url || undefined,
            createdAt: new Date(data.created_at),
            createdBy: data.created_by || 'Unknown',
        }
    } catch (error) {
        console.error('Error adding activity:', error)
        return null
    }
}

// Update activity in Supabase
export async function updateActivity(
    id: string,
    title: string,
    description: string,
    category: 'Regular Activities' | 'Special Camps',
    date: Date,
    location: string,
    participants: number,
    imageUrl: string | undefined
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('activities')
            .update({
                title,
                description,
                category,
                date: date.toISOString().split('T')[0],
                location,
                participants,
                image_url: imageUrl,
            })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating activity:', error)
        return false
    }
}

// Delete activity from Supabase
export async function deleteActivity(id: string): Promise<boolean> {
    try {
        const { error } = await supabase.from('activities').delete().eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting activity:', error)
        return false
    }
}

// Subscribe to real-time activities changes
export function subscribeToActivities(callback: () => void): () => void {
    const channel = supabase
        .channel('activities-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
