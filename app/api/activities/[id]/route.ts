import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const activity = await prisma.activity.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                date: new Date(body.date),
                location: body.location,
                participants: body.participants,
                imageUrl: body.imageUrl,
                documentUrl: body.documentUrl,
            },
        })
        return NextResponse.json(activity)
    } catch (error) {
        console.error('Error updating activity:', error)
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.activity.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting activity:', error)
        return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
    }
}
