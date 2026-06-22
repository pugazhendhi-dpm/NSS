import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const volunteerId = searchParams.get('volunteerId')
    const date = searchParams.get('date')
    const activityName = searchParams.get('activityName')
    const limitStr = searchParams.get('limit')
    const pageStr = searchParams.get('page')
    const pageSizeStr = searchParams.get('pageSize')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status')

    try {
        let whereClause: any = {}
        
        if (volunteerId) whereClause.volunteerId = volunteerId
        if (date) whereClause.activityDate = new Date(date)
        if (activityName) whereClause.activityName = activityName
        if (status) whereClause.status = status
        
        if (startDate || endDate) {
            whereClause.activityDate = {}
            if (startDate) whereClause.activityDate.gte = new Date(startDate)
            if (endDate) whereClause.activityDate.lte = new Date(endDate)
        }

        let queryArgs: any = {
            where: whereClause,
            orderBy: { activityDate: 'desc' },
        }

        if (limitStr) {
            queryArgs.take = parseInt(limitStr)
        }

        if (pageStr && pageSizeStr) {
            const page = parseInt(pageStr)
            const pageSize = parseInt(pageSizeStr)
            queryArgs.skip = (page - 1) * pageSize
            queryArgs.take = pageSize
            
            // Also get total count for pagination
            const total = await prisma.attendanceRecord.count({ where: whereClause })
            const records = await prisma.attendanceRecord.findMany(queryArgs)
            return NextResponse.json({ records, total })
        }

        const records = await prisma.attendanceRecord.findMany(queryArgs)
        return NextResponse.json(records)
    } catch (error) {
        console.error('Error fetching attendance:', error)
        return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { activityName, activityDate, attendance, volunteers, markedBy, markedById } = body

        const records = volunteers.map((volunteer: any) => ({
            volunteerId: volunteer.id,
            volunteerName: volunteer.name,
            volunteerRollNumber: volunteer.rollNumber,
            activityName,
            activityDate: new Date(activityDate),
            status: attendance[volunteer.id],
            markedBy,
            markedById: markedById || null,
        }))

        // Use transaction for bulk insert
        await prisma.$transaction(
            records.map((record: any) => prisma.attendanceRecord.create({ data: record }))
        )

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error) {
        console.error('Error saving attendance:', error)
        return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 })
    }
}
