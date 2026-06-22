import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const stats = await prisma.statistics.findFirst({
            orderBy: { lastUpdated: 'desc' },
        })

        if (!stats) {
            return NextResponse.json({
                volunteersEnrolled: 250,
                hoursOfService: 12500,
                bloodUnitsDonated: 450,
                villagesAdopted: 8,
                lastUpdated: new Date(),
                lastUpdatedBy: 'System',
            })
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Error fetching statistics:', error)
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        
        // Get the current stats ID (there should only be one row)
        const currentStats = await prisma.statistics.findFirst({
            orderBy: { lastUpdated: 'desc' },
            select: { id: true }
        })

        let updatedStats
        if (currentStats) {
            updatedStats = await prisma.statistics.update({
                where: { id: currentStats.id },
                data: {
                    volunteersEnrolled: body.volunteersEnrolled,
                    hoursOfService: body.hoursOfService,
                    bloodUnitsDonated: body.bloodUnitsDonated,
                    villagesAdopted: body.villagesAdopted,
                    lastUpdatedBy: body.updatedBy,
                    lastUpdated: new Date()
                },
            })
        } else {
            updatedStats = await prisma.statistics.create({
                data: {
                    volunteersEnrolled: body.volunteersEnrolled,
                    hoursOfService: body.hoursOfService,
                    bloodUnitsDonated: body.bloodUnitsDonated,
                    villagesAdopted: body.villagesAdopted,
                    lastUpdatedBy: body.updatedBy,
                },
            })
        }

        return NextResponse.json(updatedStats)
    } catch (error) {
        console.error('Error updating statistics:', error)
        return NextResponse.json({ error: 'Failed to update statistics' }, { status: 500 })
    }
}
