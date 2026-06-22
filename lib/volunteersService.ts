import { Department, Year } from './constants'

export interface Volunteer {
    id: string
    name: string
    email: string
    rollNumber: string
    department: Department
    year: Year
    phone?: string
    bloodGroup: string
    skills?: string[]
    role: 'volunteer' | 'supersenior' | 'admin'
    status: 'pending' | 'approved' | 'rejected'
    createdAt: Date
}

export async function addVolunteer(volunteerData: {
    name: string
    email: string
    rollNumber: string
    department: string
    year: string
    phone: string
    bloodGroup: string
    skills?: string[]
}): Promise<{ success: boolean; data?: Volunteer; error?: string }> {
    try {
        const response = await fetch('/api/volunteers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(volunteerData)
        })
        
        const result = await response.json()
        
        if (!response.ok) {
            return { success: false, error: result.error || 'Failed to submit application' }
        }
        
        return { 
            success: true, 
            data: {
                ...result,
                createdAt: new Date(result.createdAt)
            }
        }
    } catch (error: any) {
        console.error('Error adding volunteer:', error)
        return { success: false, error: error.message || 'An unexpected error occurred' }
    }
}

export async function getVolunteersByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Volunteer[]> {
    try {
        const response = await fetch(`/api/volunteers?status=${status}`)
        if (!response.ok) throw new Error('Failed to fetch volunteers')
        
        const data = await response.json()
        return data.map((v: any) => ({
            ...v,
            department: v.department as Department,
            year: v.year as Year,
            createdAt: new Date(v.createdAt)
        })) as Volunteer[]
    } catch (error) {
        console.error('Error loading volunteers:', error)
        return []
    }
}

export async function updateVolunteerStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    try {
        const response = await fetch(`/api/volunteers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating volunteer status:', error)
        return false
    }
}

export function subscribeToVolunteers(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend.')
    return () => {}
}

export const getApprovedVolunteers = () => getVolunteersByStatus('approved')
export const getPendingVolunteers = () => getVolunteersByStatus('pending')
export const approveVolunteer = (id: string) => updateVolunteerStatus(id, 'approved')
export const rejectVolunteer = (id: string) => updateVolunteerStatus(id, 'rejected')
