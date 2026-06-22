import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const update = await prisma.update.update({
            where: { id: params.id },
            data: { content: body.content },
        })
        return NextResponse.json(update)
    } catch (error) {
        console.error('Error updating update:', error)
        return NextResponse.json({ error: 'Failed to update update' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.update.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting update:', error)
        return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 })
    }
}
