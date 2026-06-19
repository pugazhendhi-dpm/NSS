import { supabase } from './supabase/client'
import { Volunteer } from './types'
import { Department, Year } from './constants'

// Helper function to convert numeric year to Year type
const convertYear = (year: number): Year => {
    const yearMap: Record<number, Year> = {
        1: '1st',
        2: '2nd',
        3: '3rd',
        4: '4th',
        5: '5th',
    }
    return yearMap[year] || '1st'
}

// Database row type (what comes from Supabase)
interface VolunteerRow {
    id: string
    name: string
    email: string
    roll_number: string
    department: string
    year: number
    phone: string
    blood_group?: string
    role: 'volunteer' | 'supersenior' | 'admin'
    status: 'pending' | 'approved' | 'rejected'
    created_at: string
}

// Add a new volunteer enrollment
export async function addVolunteer(volunteerData: {
    name: string
    email: string
    rollNumber: string
    department: string
    year: string
    bloodGroup?: string
    phone: string
    skills?: string
}): Promise<Volunteer | null> {
    try {
        const { data, error } = await supabase
            .from('volunteers')
            .insert({
                name: volunteerData.name,
                email: volunteerData.email,
                roll_number: volunteerData.rollNumber,
                department: volunteerData.department,
                year: parseInt(volunteerData.year),
                phone: volunteerData.phone,
                role: 'volunteer',
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            // Parse specific error messages
            if (error.code === '23505') { // Unique constraint violation
                if (error.message.includes('volunteers_email_key')) {
                    throw new Error('This email address is already registered. Please use a different email or contact NSS if you need help.')
                } else if (error.message.includes('volunteers_roll_number_key')) {
                    throw new Error('This roll number is already registered. Please check your roll number or contact NSS if you need help.')
                }
            }

            throw error
        }

        return {
            id: data.id,
            name: data.name,
            email: data.email,
            rollNumber: data.roll_number,
            department: data.department as Department,
            year: convertYear(data.year),
            bloodGroup: data.blood_group || '',
            phone: data.phone,
            role: data.role,
            createdAt: new Date(data.created_at),
        }
    } catch (error) {
        console.error('Error adding volunteer:', error)

        // Re-throw if it's our custom error message
        if (error instanceof Error && error.message.includes('already registered')) {
            throw error
        }

        return null
    }
}

// Get all volunteers
export async function getVolunteers(): Promise<Volunteer[]> {
    try {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((volunteer) => ({
            id: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            rollNumber: volunteer.roll_number,
            department: volunteer.department as Department,
            year: convertYear(volunteer.year),
            bloodGroup: volunteer.blood_group || '',
            phone: volunteer.phone,
            role: volunteer.role,
            createdAt: new Date(volunteer.created_at),
        }))
    } catch (error) {
        console.error('Error loading volunteers:', error)
        return []
    }
}

// Update volunteer status
export async function updateVolunteerStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('volunteers')
            .update({ status })
            .eq('id', id)

        if (error) throw error

        return true
    } catch (error) {
        console.error('Error updating volunteer status:', error)
        return false
    }
}

// Get pending volunteers (awaiting approval)
export async function getPendingVolunteers(): Promise<Volunteer[]> {
    try {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) throw error

        return (data || []).map((volunteer) => ({
            id: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            rollNumber: volunteer.roll_number,
            department: volunteer.department as Department,
            year: convertYear(volunteer.year),
            bloodGroup: volunteer.blood_group || '',
            phone: volunteer.phone,
            role: volunteer.role,
            createdAt: new Date(volunteer.created_at),
        }))
    } catch (error) {
        console.error('Error loading pending volunteers:', error)
        return []
    }
}

// Get approved volunteers only
export async function getApprovedVolunteers(): Promise<Volunteer[]> {
    try {
        const { data, error } = await supabase
            .from('volunteers')
            .select('*')
            .eq('status', 'approved')
            .order('name', { ascending: true })

        if (error) throw error

        return (data || []).map((volunteer) => ({
            id: volunteer.id,
            name: volunteer.name,
            email: volunteer.email,
            rollNumber: volunteer.roll_number,
            department: volunteer.department as Department,
            year: convertYear(volunteer.year),
            bloodGroup: volunteer.blood_group || '',
            phone: volunteer.phone,
            role: volunteer.role,
            createdAt: new Date(volunteer.created_at),
        }))
    } catch (error) {
        console.error('Error loading approved volunteers:', error)
        return []
    }
}

// Approve a volunteer
export async function approveVolunteer(id: string): Promise<boolean> {
    return updateVolunteerStatus(id, 'approved')
}

// Reject a volunteer
export async function rejectVolunteer(id: string): Promise<boolean> {
    return updateVolunteerStatus(id, 'rejected')
}

// Subscribe to real-time volunteer changes
export function subscribeToVolunteers(callback: () => void): () => void {
    const channel = supabase
        .channel('volunteers-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteers' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
