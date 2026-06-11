import { supabase } from './supabase/client'

// Blood Donor interface matching the database schema
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
    // Extended fields for student donors
    rollNumber?: string
    department?: string
    year?: string
    section?: string
    district?: string
    hometown?: string
    alternatePhone?: string
    bloodDonationWillingness?: string
    residentialStatus?: string
    // Geolocation fields
    latitude?: number | null
    longitude?: number | null
}

// Add a new blood donor to Supabase
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
}): Promise<BloodDonor | null> {
    try {
        const { data, error } = await supabase
            .from('blood_donors')
            .insert({
                name: donorData.name,
                blood_group: donorData.bloodGroup,
                phone: donorData.phone,
                email: donorData.email,
                age: donorData.age,
                gender: donorData.gender,
                address: donorData.address,
                is_available: true,
                // Extended student fields
                roll_number: donorData.rollNumber,
                department: donorData.department,
                year: donorData.year,
                section: donorData.section,
                district: donorData.district,
                hometown: donorData.hometown,
                alternate_phone: donorData.alternatePhone,
                blood_donation_willingness: donorData.bloodDonationWillingness,
                residential_status: donorData.residentialStatus,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            name: data.name,
            bloodGroup: data.blood_group,
            phone: data.phone,
            email: data.email,
            age: data.age,
            gender: data.gender,
            address: data.address,
            lastDonationDate: data.last_donation_date ? new Date(data.last_donation_date) : undefined,
            isAvailable: data.is_available,
            createdAt: new Date(data.created_at),
            rollNumber: data.roll_number,
            department: data.department,
            year: data.year,
            section: data.section,
            district: data.district,
            hometown: data.hometown,
            alternatePhone: data.alternate_phone,
            bloodDonationWillingness: data.blood_donation_willingness,
            residentialStatus: data.residential_status,
            latitude: data.latitude,
            longitude: data.longitude,
        }
    } catch (error) {
        console.error('Error adding blood donor:', error)
        return null
    }
}

// Get all blood donors
export async function getBloodDonors(): Promise<BloodDonor[]> {
    try {
        const { data, error } = await supabase
            .from('blood_donors')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((donor) => ({
            id: donor.id,
            name: donor.name,
            bloodGroup: donor.blood_group,
            phone: donor.phone,
            email: donor.email,
            age: donor.age,
            gender: donor.gender,
            address: donor.address,
            lastDonationDate: donor.last_donation_date ? new Date(donor.last_donation_date) : undefined,
            isAvailable: donor.is_available,
            createdAt: new Date(donor.created_at),
            // Extended student fields
            rollNumber: donor.roll_number,
            department: donor.department,
            year: donor.year,
            section: donor.section,
            district: donor.district,
            hometown: donor.hometown,
            alternatePhone: donor.alternate_phone,
            bloodDonationWillingness: donor.blood_donation_willingness,
            residentialStatus: donor.residential_status,
            latitude: donor.latitude,
            longitude: donor.longitude,
        }))
    } catch (error) {
        console.error('Error loading blood donors:', error)
        return []
    }
}

// Get blood donors by blood group
export async function getBloodDonorsByGroup(bloodGroup: string): Promise<BloodDonor[]> {
    try {
        const { data, error } = await supabase
            .from('blood_donors')
            .select('*')
            .eq('blood_group', bloodGroup)
            .eq('is_available', true)
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((donor) => ({
            id: donor.id,
            name: donor.name,
            bloodGroup: donor.blood_group,
            phone: donor.phone,
            email: donor.email,
            age: donor.age,
            gender: donor.gender,
            address: donor.address,
            lastDonationDate: donor.last_donation_date ? new Date(donor.last_donation_date) : undefined,
            isAvailable: donor.is_available,
            createdAt: new Date(donor.created_at),
            // Extended student fields
            rollNumber: donor.roll_number,
            department: donor.department,
            year: donor.year,
            section: donor.section,
            district: donor.district,
            hometown: donor.hometown,
            alternatePhone: donor.alternate_phone,
            bloodDonationWillingness: donor.blood_donation_willingness,
            residentialStatus: donor.residential_status,
            latitude: donor.latitude,
            longitude: donor.longitude,
        }))
    } catch (error) {
        console.error('Error loading blood donors by group:', error)
        return []
    }
}

// Update donor availability
export async function updateDonorAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donors')
            .update({ is_available: isAvailable })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating donor availability:', error)
        return false
    }
}

// Update last donation date
export async function updateLastDonationDate(id: string, date: Date): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donors')
            .update({ last_donation_date: date.toISOString() })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating last donation date:', error)
        return false
    }
}

// Delete a blood donor
export async function deleteBloodDonor(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donors')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting blood donor:', error)
        return false
    }
}

// Subscribe to real-time blood donors changes
export function subscribeToBloodDonors(callback: () => void): () => void {
    const channel = supabase
        .channel('blood-donors-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'blood_donors' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
