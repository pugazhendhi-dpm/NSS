import { supabase } from './supabase/client'

export interface Campaign {
    id: string
    name: string
    description: string | null
    goalUnits: number
    startDate: Date
    endDate: Date
    location: string | null
    status: 'upcoming' | 'active' | 'completed' | 'cancelled'
    createdBy: string
    createdAt: Date
}

export interface DonationRecord {
    id: string
    donorId: string
    donorName: string
    donorRollNumber: string
    bloodGroup: string
    campaignId: string | null
    donationDate: Date
    unitsDonated: number
    notes: string | null
    recordedBy: string
}

export interface DonorEligibility {
    id: string
    name: string
    rollNumber: string
    bloodGroup: string
    department: string
    year: string
    phone: string
    lastDonationDate: Date | null
    isEligible: boolean
    daysUntilEligible: number
    totalDonations: number
}

export interface CampaignStats {
    campaignId: string
    campaignName: string
    goalUnits: number
    startDate: Date
    endDate: Date
    status: string
    totalDonations: number
    unitsCollected: number
    progressPercentage: number
    uniqueDonors: number
}

// Get all campaigns
export async function getCampaigns(): Promise<Campaign[]> {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .select('*')
            .order('start_date', { ascending: false })

        if (error) throw error

        return (data || []).map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            goalUnits: c.goal_units,
            startDate: new Date(c.start_date),
            endDate: new Date(c.end_date),
            location: c.location,
            status: c.status,
            createdBy: c.created_by,
            createdAt: new Date(c.created_at),
        }))
    } catch (error) {
        console.error('Error fetching campaigns:', error)
        return []
    }
}

// Create campaign
export async function createCampaign(campaign: {
    name: string
    description?: string
    goalUnits: number
    startDate: string
    endDate: string
    location?: string
    createdBy: string
}): Promise<Campaign | null> {
    try {
        const { data, error } = await supabase
            .from('campaigns')
            .insert({
                name: campaign.name,
                description: campaign.description || null,
                goal_units: campaign.goalUnits,
                start_date: campaign.startDate,
                end_date: campaign.endDate,
                location: campaign.location || null,
                created_by: campaign.createdBy,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            goalUnits: data.goal_units,
            startDate: new Date(data.start_date),
            endDate: new Date(data.end_date),
            location: data.location,
            status: data.status,
            createdBy: data.created_by,
            createdAt: new Date(data.created_at),
        }
    } catch (error) {
        console.error('Error creating campaign:', error)
        return null
    }
}

// Get eligible donors
export async function getEligibleDonors(bloodGroup?: string): Promise<DonorEligibility[]> {
    try {
        let query = supabase
            .from('donor_eligibility')
            .select('*')
            .eq('is_eligible', true)

        if (bloodGroup) {
            query = query.eq('blood_group', bloodGroup)
        }

        const { data, error } = await query.order('name')

        if (error) throw error

        return (data || []).map(d => ({
            id: d.id,
            name: d.name,
            rollNumber: d.roll_number,
            bloodGroup: d.blood_group,
            department: d.department,
            year: d.year,
            phone: d.phone,
            lastDonationDate: d.last_donation_date ? new Date(d.last_donation_date) : null,
            isEligible: d.is_eligible,
            daysUntilEligible: d.days_until_eligible,
            totalDonations: d.total_donations,
        }))
    } catch (error) {
        console.error('Error fetching eligible donors:', error)
        return []
    }
}

// Record donation
export async function recordDonation(donation: {
    donorId: string
    donorName: string
    donorRollNumber: string
    bloodGroup: string
    campaignId?: string
    donationDate: string
    unitsDonated?: number
    notes?: string
    recordedBy: string
}): Promise<boolean> {
    try {
        const { error: donationError } = await supabase
            .from('donation_records')
            .insert({
                donor_id: donation.donorId,
                donor_name: donation.donorName,
                donor_roll_number: donation.donorRollNumber,
                blood_group: donation.bloodGroup,
                campaign_id: donation.campaignId || null,
                donation_date: donation.donationDate,
                units_donated: donation.unitsDonated || 1.0,
                notes: donation.notes || null,
                recorded_by: donation.recordedBy,
            })

        if (donationError) throw donationError

        // Update last_donation_date in blood_donors
        const { error: updateError } = await supabase
            .from('blood_donors')
            .update({ last_donation_date: donation.donationDate })
            .eq('id', donation.donorId)

        if (updateError) throw updateError

        return true
    } catch (error) {
        console.error('Error recording donation:', error)
        return false
    }
}

// Get campaign statistics
export async function getCampaignStats(): Promise<CampaignStats[]> {
    try {
        const { data, error } = await supabase
            .from('campaign_stats')
            .select('*')
            .order('start_date', { ascending: false })

        if (error) throw error

        return (data || []).map(s => ({
            campaignId: s.campaign_id,
            campaignName: s.campaign_name,
            goalUnits: s.goal_units,
            startDate: new Date(s.start_date),
            endDate: new Date(s.end_date),
            status: s.status,
            totalDonations: s.total_donations || 0,
            unitsCollected: s.units_collected || 0,
            progressPercentage: s.progress_percentage || 0,
            uniqueDonors: s.unique_donors || 0,
        }))
    } catch (error) {
        console.error('Error fetching campaign stats:', error)
        return []
    }
}

// Get total impact statistics
export async function getImpactStats() {
    try {
        const { data, error } = await supabase
            .from('donation_records')
            .select('units_donated, blood_group')

        if (error) throw error

        const totalUnits = data?.reduce((sum, d) => sum + (d.units_donated || 0), 0) || 0
        const livesSaved = Math.floor(totalUnits * 3) // 1 unit can save up to 3 lives

        const bloodGroupBreakdown = data?.reduce((acc: any, d) => {
            acc[d.blood_group] = (acc[d.blood_group] || 0) + (d.units_donated || 0)
            return acc
        }, {})

        return {
            totalUnits,
            livesSaved,
            totalDonations: data?.length || 0,
            bloodGroupBreakdown,
        }
    } catch (error) {
        console.error('Error fetching impact stats:', error)
        return { totalUnits: 0, livesSaved: 0, totalDonations: 0, bloodGroupBreakdown: {} }
    }
}
