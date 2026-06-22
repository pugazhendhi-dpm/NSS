import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.featuredVolunteer.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting featured volunteer:', error)
        return NextResponse.json({ error: 'Failed to delete featured volunteer' }, { status: 500 })
    }
}
