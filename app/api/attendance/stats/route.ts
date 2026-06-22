import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'volunteer' or 'activity'
    const volunteerId = searchParams.get('volunteerId')

    try {
        if (type === 'volunteer') {
            if (volunteerId) {
                // Get stats for a specific volunteer using raw query matching the view
                const stats = await prisma.$queryRaw`
                    SELECT 
                        v.id as volunteerId,
                        v.name as volunteerName,
                        v.roll_number as rollNumber,
                        v.department,
                        v.year,
                        COUNT(DISTINCT ar.activity_date) as totalActivities,
                        CAST(SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS UNSIGNED) as daysPresent,
                        CAST(SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) AS UNSIGNED) as daysLate,
                        CAST(SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) AS UNSIGNED) as daysAbsent,
                        ROUND(
                            (SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) / 
                            NULLIF(COUNT(DISTINCT ar.activity_date), 0) * 100), 
                            2
                        ) as attendancePercentage,
                        MIN(ar.activity_date) as firstActivityDate,
                        MAX(ar.activity_date) as lastActivityDate
                    FROM volunteers v
                    LEFT JOIN attendance_records ar ON v.id = ar.volunteer_id
                    WHERE v.id = ${volunteerId} AND v.status = 'approved'
                    GROUP BY v.id, v.name, v.roll_number, v.department, v.year
                `
                const result = Array.isArray(stats) && stats.length > 0 ? stats[0] : null
                return NextResponse.json(result)
            } else {
                // Get all volunteer stats
                const stats = await prisma.$queryRaw`
                    SELECT 
                        v.id as volunteerId,
                        v.name as volunteerName,
                        v.roll_number as rollNumber,
                        v.department,
                        v.year,
                        COUNT(DISTINCT ar.activity_date) as totalActivities,
                        CAST(SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS UNSIGNED) as daysPresent,
                        CAST(SUM(CASE WHEN ar.status = 'late' THEN 1 ELSE 0 END) AS UNSIGNED) as daysLate,
                        CAST(SUM(CASE WHEN ar.status = 'absent' THEN 1 ELSE 0 END) AS UNSIGNED) as daysAbsent,
                        ROUND(
                            (SUM(CASE WHEN ar.status IN ('present', 'late') THEN 1 ELSE 0 END) / 
                            NULLIF(COUNT(DISTINCT ar.activity_date), 0) * 100), 
                            2
                        ) as attendancePercentage,
                        MIN(ar.activity_date) as firstActivityDate,
                        MAX(ar.activity_date) as lastActivityDate
                    FROM volunteers v
                    LEFT JOIN attendance_records ar ON v.id = ar.volunteer_id
                    WHERE v.status = 'approved'
                    GROUP BY v.id, v.name, v.roll_number, v.department, v.year
                    ORDER BY attendancePercentage DESC
                `
                return NextResponse.json(stats)
            }
        } else if (type === 'activity') {
            // Get activity attendance summary
            const stats = await prisma.$queryRaw`
                SELECT 
                    activity_name as activityName,
                    activity_date as activityDate,
                    COUNT(*) as totalVolunteers,
                    CAST(SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS UNSIGNED) as presentCount,
                    CAST(SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) AS UNSIGNED) as lateCount,
                    CAST(SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS UNSIGNED) as absentCount,
                    ROUND(
                        (SUM(CASE WHEN status IN ('present', 'late') THEN 1 ELSE 0 END) / 
                        NULLIF(COUNT(*), 0) * 100), 
                        2
                    ) as attendancePercentage,
                    marked_by as markedBy,
                    MIN(marked_at) as markedAt
                FROM attendance_records
                GROUP BY activity_name, activity_date, marked_by
                ORDER BY activity_date DESC
            `
            return NextResponse.json(stats)
        }

        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    } catch (error) {
        console.error('Error fetching attendance stats:', error)
        return NextResponse.json({ error: 'Failed to fetch attendance stats' }, { status: 500 })
    }
}
