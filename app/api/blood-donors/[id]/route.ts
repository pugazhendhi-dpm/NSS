import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        
        let updateData: any = {}
        if ('isAvailable' in body) updateData.isAvailable = body.isAvailable
        if ('lastDonationDate' in body) updateData.lastDonationDate = new Date(body.lastDonationDate)
        if ('latitude' in body) updateData.latitude = body.latitude
        if ('longitude' in body) updateData.longitude = body.longitude
        
        const donor = await prisma.bloodDonor.update({
            where: { id: params.id },
            data: updateData,
        })
        return NextResponse.json(donor)
    } catch (error) {
        console.error('Error updating blood donor:', error)
        return NextResponse.json({ error: 'Failed to update blood donor' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.bloodDonor.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting blood donor:', error)
        return NextResponse.json({ error: 'Failed to delete blood donor' }, { status: 500 })
    }
}
