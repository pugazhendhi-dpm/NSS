export interface BloodDonationYearRecord {
    id: string
    academicYear: string
    eventName: string
    donationDate: string
    unitsDonated: number
    donorsCount: number
    createdAt: Date
    createdBy: string
}

export interface YearSummary {
    academicYear: string
    totalEvents: number
    totalUnits: number
    totalDonors: number
    records: BloodDonationYearRecord[]
}

export async function getBloodDonationYearRecords(): Promise<BloodDonationYearRecord[]> {
    try {
        const response = await fetch('/api/blood-donation-years')
        if (!response.ok) throw new Error('Failed to fetch records')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            createdAt: new Date(record.createdAt)
        }))
    } catch (error) {
        console.error('Error loading blood donation year records:', error)
        return []
    }
}

export async function addBloodDonationYearRecord(data: {
    academicYear: string,
    eventName: string,
    donationDate: string,
    unitsDonated: number,
    donorsCount: number,
    createdBy: string
}): Promise<BloodDonationYearRecord | null> {
    try {
        const response = await fetch('/api/blood-donation-years', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        
        if (!response.ok) throw new Error('Failed to add record')
        
        const resData = await response.json()
        return {
            ...resData,
            createdAt: new Date(resData.createdAt)
        }
    } catch (error) {
        console.error('Error adding blood donation year record:', error)
        return null
    }
}

export async function updateBloodDonationYearRecord(
    id: string,
    data: {
        academicYear: string,
        eventName: string,
        donationDate: string,
        unitsDonated: number,
        donorsCount: number
    }
): Promise<boolean> {
    try {
        const response = await fetch(`/api/blood-donation-years/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        return response.ok
    } catch (error) {
        console.error('Error updating blood donation year record:', error)
        return false
    }
}

export async function deleteBloodDonationYearRecord(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/blood-donation-years/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting blood donation year record:', error)
        return false
    }
}

export function groupByYear(records: BloodDonationYearRecord[]): YearSummary[] {
    const grouped: Record<string, YearSummary> = {}
    
    records.forEach(record => {
        if (!grouped[record.academicYear]) {
            grouped[record.academicYear] = {
                academicYear: record.academicYear,
                totalEvents: 0,
                totalUnits: 0,
                totalDonors: 0,
                records: []
            }
        }
        grouped[record.academicYear].records.push(record)
        grouped[record.academicYear].totalEvents++
        grouped[record.academicYear].totalUnits += record.unitsDonated
        grouped[record.academicYear].totalDonors += record.donorsCount
    })
    
    // Sort years descending
    return Object.values(grouped).sort((a, b) => b.academicYear.localeCompare(a.academicYear))
}
