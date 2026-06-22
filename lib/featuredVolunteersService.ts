export interface FeaturedVolunteer {
    id: string
    name: string
    department: string
    phone: string
    createdAt: string
}

export async function getFeaturedVolunteers(): Promise<FeaturedVolunteer[]> {
    try {
        const response = await fetch('/api/featured-volunteers')
        if (!response.ok) throw new Error('Failed to fetch featured volunteers')
        
        return await response.json()
    } catch (error) {
        console.error('Error fetching featured volunteers:', error)
        return []
    }
}

export async function addFeaturedVolunteer(volunteer: Omit<FeaturedVolunteer, 'id' | 'createdAt'>): Promise<boolean> {
    try {
        const response = await fetch('/api/featured-volunteers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(volunteer)
        })
        return response.ok
    } catch (error) {
        console.error('Error adding featured volunteer:', error)
        return false
    }
}

export async function deleteFeaturedVolunteer(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/featured-volunteers/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting featured volunteer:', error)
        return false
    }
}
