// Activity interface
export interface Activity {
    id: string
    title: string
    description: string
    category: 'Sustainable Initiatives' | 'Special Camps'
    date: Date
    location: string
    participants: number
    imageUrl?: string
    documentUrl?: string
    createdAt: Date
    createdBy: string
}

// Get all activities
export async function getActivities(): Promise<Activity[]> {
    try {
        const response = await fetch('/api/activities')
        if (!response.ok) throw new Error('Failed to fetch activities')
        
        const data = await response.json()
        return data.map((activity: any) => ({
            ...activity,
            date: new Date(activity.date),
            createdAt: new Date(activity.createdAt)
        }))
    } catch (error) {
        console.error('Error loading activities:', error)
        return []
    }
}

// Add activity
export async function addActivity(
    title: string,
    description: string,
    category: 'Sustainable Initiatives' | 'Special Camps',
    date: Date,
    location: string,
    participants: number,
    imageUrl: string | undefined,
    documentUrl: string | undefined,
    createdBy: string
): Promise<Activity | null> {
    try {
        const response = await fetch('/api/activities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                category,
                date: date.toISOString(),
                location,
                participants,
                imageUrl,
                documentUrl,
                createdBy
            })
        })
        
        if (!response.ok) throw new Error('Failed to add activity')
        
        const data = await response.json()
        return {
            ...data,
            date: new Date(data.date),
            createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('Error adding activity:', error)
        return null
    }
}

// Update activity
export async function updateActivity(
    id: string,
    title: string,
    description: string,
    category: 'Sustainable Initiatives' | 'Special Camps',
    date: Date,
    location: string,
    participants: number,
    imageUrl: string | undefined,
    documentUrl: string | undefined
): Promise<boolean> {
    try {
        const response = await fetch(`/api/activities/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                category,
                date: date.toISOString(),
                location,
                participants,
                imageUrl,
                documentUrl
            })
        })
        
        return response.ok
    } catch (error) {
        console.error('Error updating activity:', error)
        return false
    }
}

// Delete activity
export async function deleteActivity(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/activities/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting activity:', error)
        return false
    }
}

// Subscriptions are no longer supported directly via the API
// Components should use SWR or React Query for polling, or refresh manually
export function subscribeToActivities(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend. Polling may be required.')
    // Return a dummy unsubscribe function
    return () => {}
}
