import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const records = await prisma.bloodDonationYear.findMany({
            orderBy: { donationDate: 'desc' },
        })
        return NextResponse.json(records)
    } catch (error) {
        console.error('Error fetching blood donation years:', error)
        return NextResponse.json({ error: 'Failed to fetch blood donation years' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const record = await prisma.bloodDonationYear.create({
            data: {
                academicYear: body.academicYear,
                eventName: body.eventName,
                donationDate: body.donationDate,
                unitsDonated: body.unitsDonated,
                donorsCount: body.donorsCount,
                createdBy: body.createdBy,
            },
        })
        return NextResponse.json(record, { status: 201 })
    } catch (error) {
        console.error('Error creating blood donation year:', error)
        return NextResponse.json({ error: 'Failed to create blood donation year' }, { status: 500 })
    }
}
