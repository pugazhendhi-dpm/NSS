export interface Statistics {
    id: string
    volunteersEnrolled: number
    hoursOfService: number
    bloodUnitsDonated: number
    villagesAdopted: number
    lastUpdated: Date
    lastUpdatedBy: string
}

export async function getStatistics(): Promise<Statistics | null> {
    try {
        const response = await fetch('/api/statistics')
        if (!response.ok) throw new Error('Failed to fetch statistics')
        
        const data = await response.json()
        return {
            ...data,
            lastUpdated: new Date(data.lastUpdated)
        }
    } catch (error) {
        console.error('Error loading statistics:', error)
        return null
    }
}

export async function updateStatistics(
    volunteersEnrolled: number,
    hoursOfService: number,
    bloodUnitsDonated: number,
    villagesAdopted: number,
    updatedBy: string
): Promise<boolean> {
    try {
        const response = await fetch('/api/statistics', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                volunteersEnrolled,
                hoursOfService,
                bloodUnitsDonated,
                villagesAdopted,
                updatedBy
            })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating statistics:', error)
        return false
    }
}

export function subscribeToStatistics(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend.')
    return () => {}
}

export const getStats = getStatistics
export const updateStats = updateStatistics
export const subscribeToStats = subscribeToStatistics
export type ImpactStats = Statistics
