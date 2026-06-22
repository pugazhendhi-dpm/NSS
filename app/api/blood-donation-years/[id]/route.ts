import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const record = await prisma.bloodDonationYear.update({
            where: { id: params.id },
            data: {
                academicYear: body.academicYear,
                eventName: body.eventName,
                donationDate: body.donationDate,
                unitsDonated: body.unitsDonated,
                donorsCount: body.donorsCount,
            },
        })
        return NextResponse.json(record)
    } catch (error) {
        console.error('Error updating blood donation year:', error)
        return NextResponse.json({ error: 'Failed to update blood donation year' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.bloodDonationYear.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting blood donation year:', error)
        return NextResponse.json({ error: 'Failed to delete blood donation year' }, { status: 500 })
    }
}
