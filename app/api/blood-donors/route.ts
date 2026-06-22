import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const bloodGroup = searchParams.get('bloodGroup')
    const batch = searchParams.get('batch')

    try {
        let whereClause: any = {}
        if (bloodGroup) {
            whereClause.bloodGroup = bloodGroup
            whereClause.isAvailable = true
        }
        if (batch) {
            whereClause.batch = batch
        }

        const donors = await prisma.bloodDonor.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(donors)
    } catch (error) {
        console.error('Error fetching blood donors:', error)
        return NextResponse.json({ error: 'Failed to fetch blood donors' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const donor = await prisma.bloodDonor.create({
            data: {
                name: body.name,
                bloodGroup: body.bloodGroup,
                phone: body.phone,
                email: body.email,
                age: body.age,
                gender: body.gender,
                address: body.address,
                isAvailable: true,
                rollNumber: body.rollNumber,
                department: body.department,
                year: body.year,
                section: body.section,
                district: body.district,
                hometown: body.hometown,
                alternatePhone: body.alternatePhone,
                bloodDonationWillingness: body.bloodDonationWillingness,
                residentialStatus: body.residentialStatus,
                batch: body.batch,
                lastDonationDate: body.lastDonationDate ? new Date(body.lastDonationDate) : null,
            },
        })
        return NextResponse.json(donor, { status: 201 })
    } catch (error) {
        console.error('Error creating blood donor:', error)
        return NextResponse.json({ error: 'Failed to create blood donor' }, { status: 500 })
    }
}
