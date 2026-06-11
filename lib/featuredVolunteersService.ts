import { supabase } from './supabase/client'

export interface FeaturedVolunteer {
    id: string
    name: string
    department: string
    phone: string
    createdAt: string
}

export async function getFeaturedVolunteers(): Promise<FeaturedVolunteer[]> {
    try {
        const { data, error } = await supabase
            .from('featured_volunteers')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) throw error

        return (data || []).map(v => ({
            id: v.id,
            name: v.name,
            department: v.department,
            phone: v.phone,
            createdAt: v.created_at,
        }))
    } catch (error) {
        console.error('Error fetching featured volunteers:', error)
        return []
    }
}

export async function addFeaturedVolunteer(volunteer: Omit<FeaturedVolunteer, 'id' | 'createdAt'>): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('featured_volunteers')
            .insert({
                name: volunteer.name,
                department: volunteer.department,
                phone: volunteer.phone,
            })

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error adding featured volunteer:', error)
        return false
    }
}

export async function deleteFeaturedVolunteer(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('featured_volunteers')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting featured volunteer:', error)
        return false
    }
}
