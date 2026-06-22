export interface AttendanceRecord {
    id: string
    volunteerId: string
    volunteerName: string
    volunteerRollNumber: string
    activityName: string
    activityDate: Date
    status: 'present' | 'absent' | 'late'
    markedBy: string
    markedById?: string
    markedAt: Date
    notes?: string
    createdAt: Date
}

export interface VolunteerAttendanceStats {
    volunteerId: string
    volunteerName: string
    rollNumber: string
    department: string
    year: string
    totalActivities: number
    daysPresent: number
    daysLate: number
    daysAbsent: number
    attendancePercentage: number
    firstActivityDate: Date | null
    lastActivityDate: Date | null
}

export interface ActivityAttendanceSummary {
    activityName: string
    activityDate: Date
    totalVolunteers: number
    presentCount: number
    lateCount: number
    absentCount: number
    attendancePercentage: number
    markedBy: string
    markedAt: Date
}

export async function saveAttendanceRecords(
    activityName: string,
    activityDate: string,
    attendance: Record<string, 'present' | 'absent' | 'late'>,
    volunteers: Array<{ id: string; name: string; rollNumber: string }>,
    markedBy: string,
    markedById?: string
): Promise<boolean> {
    try {
        const response = await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                activityName,
                activityDate,
                attendance,
                volunteers,
                markedBy,
                markedById
            })
        })
        return response.ok
    } catch (error) {
        console.error('Error saving attendance records:', error)
        return false
    }
}

export async function getAttendanceByVolunteer(
    volunteerId: string,
    limit?: number
): Promise<AttendanceRecord[]> {
    try {
        let url = `/api/attendance?volunteerId=${volunteerId}`
        if (limit) url += `&limit=${limit}`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            activityDate: new Date(record.activityDate),
            markedAt: new Date(record.markedAt),
            createdAt: new Date(record.createdAt)
        }))
    } catch (error) {
        console.error('Error fetching attendance by volunteer:', error)
        return []
    }
}

export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    try {
        const response = await fetch(`/api/attendance?date=${date}`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            activityDate: new Date(record.activityDate),
            markedAt: new Date(record.markedAt),
            createdAt: new Date(record.createdAt)
        }))
    } catch (error) {
        console.error('Error fetching attendance by date:', error)
        return []
    }
}

export async function getAttendanceByActivity(activityName: string): Promise<AttendanceRecord[]> {
    try {
        const response = await fetch(`/api/attendance?activityName=${encodeURIComponent(activityName)}`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            activityDate: new Date(record.activityDate),
            markedAt: new Date(record.markedAt),
            createdAt: new Date(record.createdAt)
        }))
    } catch (error) {
        console.error('Error fetching attendance by activity:', error)
        return []
    }
}

export async function getVolunteerStats(volunteerId: string): Promise<VolunteerAttendanceStats | null> {
    try {
        const response = await fetch(`/api/attendance/stats?type=volunteer&volunteerId=${volunteerId}`)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        if (!data) return null
        
        return {
            ...data,
            firstActivityDate: data.firstActivityDate ? new Date(data.firstActivityDate) : null,
            lastActivityDate: data.lastActivityDate ? new Date(data.lastActivityDate) : null
        }
    } catch (error) {
        console.error('Error fetching volunteer stats:', error)
        return null
    }
}

export async function getAllVolunteerStats(): Promise<VolunteerAttendanceStats[]> {
    try {
        const response = await fetch('/api/attendance/stats?type=volunteer')
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            firstActivityDate: record.firstActivityDate ? new Date(record.firstActivityDate) : null,
            lastActivityDate: record.lastActivityDate ? new Date(record.lastActivityDate) : null
        }))
    } catch (error) {
        console.error('Error fetching all volunteer stats:', error)
        return []
    }
}

export async function getActivitySummary(): Promise<ActivityAttendanceSummary[]> {
    try {
        const response = await fetch('/api/attendance/stats?type=activity')
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return data.map((record: any) => ({
            ...record,
            activityDate: new Date(record.activityDate),
            markedAt: new Date(record.markedAt)
        }))
    } catch (error) {
        console.error('Error fetching activity summary:', error)
        return []
    }
}

export async function getAttendanceHistory(
    filters?: {
        volunteerId?: string
        startDate?: string
        endDate?: string
        status?: 'present' | 'absent' | 'late'
    },
    page: number = 1,
    pageSize: number = 50
): Promise<{ records: AttendanceRecord[]; total: number }> {
    try {
        let url = `/api/attendance?page=${page}&pageSize=${pageSize}`
        
        if (filters?.volunteerId) url += `&volunteerId=${filters.volunteerId}`
        if (filters?.startDate) url += `&startDate=${filters.startDate}`
        if (filters?.endDate) url += `&endDate=${filters.endDate}`
        if (filters?.status) url += `&status=${filters.status}`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        return {
            records: data.records.map((record: any) => ({
                ...record,
                activityDate: new Date(record.activityDate),
                markedAt: new Date(record.markedAt),
                createdAt: new Date(record.createdAt)
            })),
            total: data.total
        }
    } catch (error) {
        console.error('Error fetching attendance history:', error)
        return { records: [], total: 0 }
    }
}
