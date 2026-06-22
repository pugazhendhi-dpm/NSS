export interface AuthorizedUser {
    id: string
    email: string
    name: string
    role: 'admin' | 'supersenior'
    is_active: boolean
    created_at: string
}

export async function getAuthorizedUsers(): Promise<AuthorizedUser[]> {
    try {
        const response = await fetch('/api/authorized-users')
        if (!response.ok) throw new Error('Failed to fetch authorized users')
        
        const data = await response.json()
        // Map from Prisma camelCase to expected snake_case for UI components
        return data.map((user: any) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            is_active: user.isActive,
            created_at: user.createdAt
        }))
    } catch (error) {
        console.error('Error fetching authorized users:', error)
        return []
    }
}

export async function addAuthorizedUser(email: string, name: string, role: 'admin' | 'supersenior'): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/authorized-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, role })
        })
        
        if (!response.ok) {
            const data = await response.json()
            return { success: false, error: data.error || 'Failed to add user' }
        }
        
        return { success: true }
    } catch (error) {
        console.error('Error adding authorized user:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
}

export async function updateAuthorizedUser(id: string, updates: Partial<AuthorizedUser>): Promise<boolean> {
    try {
        const response = await fetch(`/api/authorized-users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        })
        return response.ok
    } catch (error) {
        console.error('Error updating authorized user:', error)
        return false
    }
}

export async function deleteAuthorizedUser(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/authorized-users/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting authorized user:', error)
        return false
    }
}
