import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const volunteer = await prisma.volunteer.update({
            where: { id: params.id },
            data: { status: body.status },
        })
        return NextResponse.json(volunteer)
    } catch (error) {
        console.error('Error updating volunteer status:', error)
        return NextResponse.json({ error: 'Failed to update volunteer status' }, { status: 500 })
    }
}
