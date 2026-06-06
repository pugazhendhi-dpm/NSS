import { supabase } from './supabase/client'

export interface BloodDonationYearRecord {
    id: string
    academicYear: string       // e.g. "2023-24"
    eventName: string          // e.g. "Annual Blood Donation Camp"
    donationDate: string       // ISO date string
    unitsDonated: number
    donorsCount: number
    createdBy: string
    createdAt: string
}

export interface YearSummary {
    academicYear: string
    totalUnits: number
    totalDonors: number
    totalEvents: number
    records: BloodDonationYearRecord[]
}

// Fetch all records
export async function getBloodDonationYearRecords(): Promise<BloodDonationYearRecord[]> {
    try {
        const { data, error } = await supabase
            .from('blood_donation_years')
            .select('*')
            .order('donation_date', { ascending: false })

        if (error) throw error

        return (data || []).map(r => ({
            id: r.id,
            academicYear: r.academic_year,
            eventName: r.event_name,
            donationDate: r.donation_date,
            unitsDonated: r.units_donated,
            donorsCount: r.donors_count,
            createdBy: r.created_by,
            createdAt: r.created_at,
        }))
    } catch (error) {
        console.error('Error fetching blood donation year records:', error)
        return []
    }
}

// Add a new record
export async function addBloodDonationYearRecord(record: {
    academicYear: string
    eventName: string
    donationDate: string
    unitsDonated: number
    donorsCount: number
    createdBy: string
}): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donation_years')
            .insert({
                academic_year: record.academicYear,
                event_name: record.eventName,
                donation_date: record.donationDate,
                units_donated: record.unitsDonated,
                donors_count: record.donorsCount,
                created_by: record.createdBy,
            })

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error adding blood donation year record:', error)
        return false
    }
}

// Update an existing record
export async function updateBloodDonationYearRecord(id: string, record: {
    academicYear: string
    eventName: string
    donationDate: string
    unitsDonated: number
    donorsCount: number
}): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donation_years')
            .update({
                academic_year: record.academicYear,
                event_name: record.eventName,
                donation_date: record.donationDate,
                units_donated: record.unitsDonated,
                donors_count: record.donorsCount,
            })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating blood donation year record:', error)
        return false
    }
}

// Delete a record
export async function deleteBloodDonationYearRecord(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('blood_donation_years')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting blood donation year record:', error)
        return false
    }
}

// Group records by academic year for summary view
export function groupByYear(records: BloodDonationYearRecord[]): YearSummary[] {
    const grouped: Record<string, BloodDonationYearRecord[]> = {}

    records.forEach(r => {
        if (!grouped[r.academicYear]) grouped[r.academicYear] = []
        grouped[r.academicYear].push(r)
    })

    return Object.entries(grouped)
        .map(([year, recs]) => ({
            academicYear: year,
            totalUnits: recs.reduce((sum, r) => sum + r.unitsDonated, 0),
            totalDonors: recs.reduce((sum, r) => sum + r.donorsCount, 0),
            totalEvents: recs.length,
            records: recs,
        }))
        .sort((a, b) => b.academicYear.localeCompare(a.academicYear))
}
