import { supabase } from './supabase/client'

// Attendance record interface
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

// Attendance statistics interface
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

// Activity attendance summary interface
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

// Save bulk attendance records for an activity
export async function saveAttendanceRecords(
    activityName: string,
    activityDate: string,
    attendance: Record<string, 'present' | 'absent' | 'late'>,
    volunteers: Array<{ id: string; name: string; rollNumber: string }>,
    markedBy: string,
    markedById?: string
): Promise<boolean> {
    try {
        // Prepare attendance records
        const records = volunteers.map(volunteer => ({
            volunteer_id: volunteer.id,
            volunteer_name: volunteer.name,
            volunteer_roll_number: volunteer.rollNumber,
            activity_name: activityName,
            activity_date: activityDate,
            status: attendance[volunteer.id],
            marked_by: markedBy,
            marked_by_id: markedById || null,
        }))

        // Insert records into database
        const { data, error } = await supabase
            .from('attendance_records')
            .insert(records)
            .select()

        if (error) {
            console.error('Supabase error saving attendance:', error)
            throw error
        }

        return true
    } catch (error) {
        console.error('Error saving attendance records:', error)
        return false
    }
}

// Get attendance records by volunteer ID
export async function getAttendanceByVolunteer(
    volunteerId: string,
    limit?: number
): Promise<AttendanceRecord[]> {
    try {
        let query = supabase
            .from('attendance_records')
            .select('*')
            .eq('volunteer_id', volunteerId)
            .order('activity_date', { ascending: false })

        if (limit) {
            query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) throw error

        return (data || []).map(record => ({
            id: record.id,
            volunteerId: record.volunteer_id,
            volunteerName: record.volunteer_name,
            volunteerRollNumber: record.volunteer_roll_number,
            activityName: record.activity_name,
            activityDate: new Date(record.activity_date),
            status: record.status,
            markedBy: record.marked_by,
            markedById: record.marked_by_id,
            markedAt: new Date(record.marked_at),
            notes: record.notes,
            createdAt: new Date(record.created_at),
        }))
    } catch (error) {
        console.error('Error fetching attendance by volunteer:', error)
        return []
    }
}

// Get attendance records by date
export async function getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    try {
        const { data, error } = await supabase
            .from('attendance_records')
            .select('*')
            .eq('activity_date', date)
            .order('volunteer_name', { ascending: true })

        if (error) throw error

        return (data || []).map(record => ({
            id: record.id,
            volunteerId: record.volunteer_id,
            volunteerName: record.volunteer_name,
            volunteerRollNumber: record.volunteer_roll_number,
            activityName: record.activity_name,
            activityDate: new Date(record.activity_date),
            status: record.status,
            markedBy: record.marked_by,
            markedById: record.marked_by_id,
            markedAt: new Date(record.marked_at),
            notes: record.notes,
            createdAt: new Date(record.created_at),
        }))
    } catch (error) {
        console.error('Error fetching attendance by date:', error)
        return []
    }
}

// Get attendance records by activity name
export async function getAttendanceByActivity(activityName: string): Promise<AttendanceRecord[]> {
    try {
        const { data, error } = await supabase
            .from('attendance_records')
            .select('*')
            .eq('activity_name', activityName)
            .order('volunteer_name', { ascending: true })

        if (error) throw error

        return (data || []).map(record => ({
            id: record.id,
            volunteerId: record.volunteer_id,
            volunteerName: record.volunteer_name,
            volunteerRollNumber: record.volunteer_roll_number,
            activityName: record.activity_name,
            activityDate: new Date(record.activity_date),
            status: record.status,
            markedBy: record.marked_by,
            markedById: record.marked_by_id,
            markedAt: new Date(record.marked_at),
            notes: record.notes,
            createdAt: new Date(record.created_at),
        }))
    } catch (error) {
        console.error('Error fetching attendance by activity:', error)
        return []
    }
}

// Get volunteer attendance statistics
export async function getVolunteerStats(volunteerId: string): Promise<VolunteerAttendanceStats | null> {
    try {
        const { data, error } = await supabase
            .from('volunteer_attendance_stats')
            .select('*')
            .eq('volunteer_id', volunteerId)
            .single()

        if (error) throw error
        if (!data) return null

        return {
            volunteerId: data.volunteer_id,
            volunteerName: data.volunteer_name,
            rollNumber: data.roll_number,
            department: data.department,
            year: data.year,
            totalActivities: data.total_activities || 0,
            daysPresent: data.days_present || 0,
            daysLate: data.days_late || 0,
            daysAbsent: data.days_absent || 0,
            attendancePercentage: data.attendance_percentage || 0,
            firstActivityDate: data.first_activity_date ? new Date(data.first_activity_date) : null,
            lastActivityDate: data.last_activity_date ? new Date(data.last_activity_date) : null,
        }
    } catch (error) {
        console.error('Error fetching volunteer stats:', error)
        return null
    }
}

// Get all volunteer statistics
export async function getAllVolunteerStats(): Promise<VolunteerAttendanceStats[]> {
    try {
        const { data, error } = await supabase
            .from('volunteer_attendance_stats')
            .select('*')
            .order('attendance_percentage', { ascending: false })

        if (error) throw error

        return (data || []).map(record => ({
            volunteerId: record.volunteer_id,
            volunteerName: record.volunteer_name,
            rollNumber: record.roll_number,
            department: record.department,
            year: record.year,
            totalActivities: record.total_activities || 0,
            daysPresent: record.days_present || 0,
            daysLate: record.days_late || 0,
            daysAbsent: record.days_absent || 0,
            attendancePercentage: record.attendance_percentage || 0,
            firstActivityDate: record.first_activity_date ? new Date(record.first_activity_date) : null,
            lastActivityDate: record.last_activity_date ? new Date(record.last_activity_date) : null,
        }))
    } catch (error) {
        console.error('Error fetching all volunteer stats:', error)
        return []
    }
}

// Get activity attendance summary
export async function getActivitySummary(): Promise<ActivityAttendanceSummary[]> {
    try {
        const { data, error } = await supabase
            .from('activity_attendance_summary')
            .select('*')
            .order('activity_date', { ascending: false })

        if (error) throw error

        return (data || []).map(record => ({
            activityName: record.activity_name,
            activityDate: new Date(record.activity_date),
            totalVolunteers: record.total_volunteers || 0,
            presentCount: record.present_count || 0,
            lateCount: record.late_count || 0,
            absentCount: record.absent_count || 0,
            attendancePercentage: record.attendance_percentage || 0,
            markedBy: record.marked_by,
            markedAt: new Date(record.marked_at),
        }))
    } catch (error) {
        console.error('Error fetching activity summary:', error)
        return []
    }
}

// Get attendance history with filters and pagination
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
        let query = supabase.from('attendance_records').select('*', { count: 'exact' })

        // Apply filters
        if (filters?.volunteerId) {
            query = query.eq('volunteer_id', filters.volunteerId)
        }
        if (filters?.startDate) {
            query = query.gte('activity_date', filters.startDate)
        }
        if (filters?.endDate) {
            query = query.lte('activity_date', filters.endDate)
        }
        if (filters?.status) {
            query = query.eq('status', filters.status)
        }

        // Apply pagination
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to).order('activity_date', { ascending: false })

        const { data, error, count } = await query

        if (error) throw error

        const records = (data || []).map(record => ({
            id: record.id,
            volunteerId: record.volunteer_id,
            volunteerName: record.volunteer_name,
            volunteerRollNumber: record.volunteer_roll_number,
            activityName: record.activity_name,
            activityDate: new Date(record.activity_date),
            status: record.status,
            markedBy: record.marked_by,
            markedById: record.marked_by_id,
            markedAt: new Date(record.marked_at),
            notes: record.notes,
            createdAt: new Date(record.created_at),
        }))

        return {
            records,
            total: count || 0,
        }
    } catch (error) {
        console.error('Error fetching attendance history:', error)
        return { records: [], total: 0 }
    }
}
