export interface BloodDonor {
    id: string
    name: string
    bloodGroup: string
    phone: string
    email?: string
    age?: number
    gender?: string
    address?: string
    lastDonationDate?: Date
    isAvailable: boolean
    createdAt: Date
    rollNumber?: string
    department?: string
    year?: string
    section?: string
    district?: string
    hometown?: string
    alternatePhone?: string
    bloodDonationWillingness?: string
    residentialStatus?: string
    batch?: string
    latitude?: number | null
    longitude?: number | null
}

export async function addBloodDonor(donorData: {
    name: string
    bloodGroup: string
    phone: string
    email?: string
    age?: number
    gender?: string
    address?: string
    rollNumber?: string
    department?: string
    year?: string
    section?: string
    district?: string
    hometown?: string
    alternatePhone?: string
    bloodDonationWillingness?: string
    residentialStatus?: string
    batch?: string
    lastDonationDate?: string
}): Promise<BloodDonor | null> {
    try {
        const response = await fetch('/api/blood-donors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorData)
        })
        
        if (!response.ok) throw new Error('Failed to add donor')
        
        const data = await response.json()
        return {
            ...data,
            lastDonationDate: data.lastDonationDate ? new Date(data.lastDonationDate) : undefined,
            createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('Error adding blood donor:', error)
        return null
    }
}

export async function getBloodDonors(batch?: string): Promise<BloodDonor[]> {
    try {
        const url = batch ? `/api/blood-donors?batch=${encodeURIComponent(batch)}` : '/api/blood-donors'
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch donors')
        
        const data = await response.json()
        return data.map((donor: any) => ({
            ...donor,
            lastDonationDate: donor.lastDonationDate ? new Date(donor.lastDonationDate) : undefined,
            createdAt: new Date(donor.createdAt)
        }))
    } catch (error) {
        console.error('Error loading blood donors:', error)
        return []
    }
}

export async function getBloodDonorsByGroup(bloodGroup: string): Promise<BloodDonor[]> {
    try {
        const response = await fetch(`/api/blood-donors?bloodGroup=${encodeURIComponent(bloodGroup)}`)
        if (!response.ok) throw new Error('Failed to fetch donors')
        
        const data = await response.json()
        return data.map((donor: any) => ({
            ...donor,
            lastDonationDate: donor.lastDonationDate ? new Date(donor.lastDonationDate) : undefined,
            createdAt: new Date(donor.createdAt)
        }))
    } catch (error) {
        console.error('Error loading blood donors by group:', error)
        return []
    }
}

export async function updateDonorAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    try {
        const response = await fetch(`/api/blood-donors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isAvailable })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating donor availability:', error)
        return false
    }
}

export async function updateLastDonationDate(id: string, date: Date): Promise<boolean> {
    try {
        const response = await fetch(`/api/blood-donors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lastDonationDate: date.toISOString() })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating last donation date:', error)
        return false
    }
}

export async function deleteBloodDonor(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/blood-donors/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting blood donor:', error)
        return false
    }
}

export function subscribeToBloodDonors(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend. Polling may be required.')
    return () => {}
}
