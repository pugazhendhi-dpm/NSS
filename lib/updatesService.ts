export interface Update {
    id: string
    content: string
    createdAt: Date
    createdBy: string
}

export async function getUpdates(): Promise<Update[]> {
    try {
        const response = await fetch('/api/updates')
        if (!response.ok) throw new Error('Failed to fetch updates')
        
        const data = await response.json()
        return data.map((update: any) => ({
            ...update,
            createdAt: new Date(update.createdAt)
        }))
    } catch (error) {
        console.error('Error loading updates:', error)
        return []
    }
}

export async function addUpdate(content: string, createdBy: string): Promise<Update | null> {
    try {
        const response = await fetch('/api/updates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content, createdBy })
        })
        
        if (!response.ok) throw new Error('Failed to add update')
        
        const data = await response.json()
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('Error adding update:', error)
        return null
    }
}

export async function updateUpdate(id: string, content: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/updates/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating update:', error)
        return false
    }
}

export async function deleteUpdate(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/updates/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting update:', error)
        return false
    }
}

export function subscribeToUpdates(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend.')
    return () => {}
}
