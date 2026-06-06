import { supabase } from './supabase/client'

// Statistics interface
export interface ImpactStats {
    volunteersEnrolled: number
    hoursOfService: number
    bloodUnitsDonated: number
    villagesAdopted: number
    lastUpdated: Date
    lastUpdatedBy: string
}

// Get statistics from Supabase
export async function getStats(): Promise<ImpactStats> {
    try {
        const { data, error } = await supabase
            .from('statistics')
            .select('*')
            .order('last_updated', { ascending: false })
            .limit(1)
            .single()

        if (error) throw error

        if (!data) {
            // Return default stats if none exist
            return {
                volunteersEnrolled: 250,
                hoursOfService: 12500,
                bloodUnitsDonated: 450,
                villagesAdopted: 8,
                lastUpdated: new Date(),
                lastUpdatedBy: 'System',
            }
        }

        return {
            volunteersEnrolled: data.volunteers_enrolled,
            hoursOfService: data.hours_of_service,
            bloodUnitsDonated: data.blood_units_donated,
            villagesAdopted: data.villages_adopted,
            lastUpdated: new Date(data.last_updated),
            lastUpdatedBy: data.last_updated_by || 'System',
        }
    } catch (error) {
        console.error('Error loading statistics:', error)
        return {
            volunteersEnrolled: 250,
            hoursOfService: 12500,
            bloodUnitsDonated: 450,
            villagesAdopted: 8,
            lastUpdated: new Date(),
            lastUpdatedBy: 'System',
        }
    }
}

// Update statistics in Supabase
export async function updateStats(
    volunteersEnrolled: number,
    hoursOfService: number,
    bloodUnitsDonated: number,
    villagesAdopted: number,
    updatedBy: string
): Promise<boolean> {
    try {
        // Get the current stats ID (there should only be one row)
        const { data: currentStats } = await supabase
            .from('statistics')
            .select('id')
            .order('last_updated', { ascending: false })
            .limit(1)
            .single()

        if (currentStats) {
            // Update existing stats
            const { error } = await supabase
                .from('statistics')
                .update({
                    volunteers_enrolled: volunteersEnrolled,
                    hours_of_service: hoursOfService,
                    blood_units_donated: bloodUnitsDonated,
                    villages_adopted: villagesAdopted,
                    last_updated_by: updatedBy,
                })
                .eq('id', currentStats.id)

            if (error) throw error
        } else {
            // Insert new stats if none exist
            const { error } = await supabase.from('statistics').insert({
                volunteers_enrolled: volunteersEnrolled,
                hours_of_service: hoursOfService,
                blood_units_donated: bloodUnitsDonated,
                villages_adopted: villagesAdopted,
                last_updated_by: updatedBy,
            })

            if (error) throw error
        }

        return true
    } catch (error) {
        console.error('Error updating statistics:', error)
        return false
    }
}

// Subscribe to real-time statistics changes
export function subscribeToStats(callback: () => void): () => void {
    const channel = supabase
        .channel('statistics-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'statistics' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
