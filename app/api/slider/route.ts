import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const events = await prisma.sliderEvent.findMany({
            orderBy: { orderIndex: 'asc' },
        })
        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching slider events:', error)
        return NextResponse.json({ error: 'Failed to fetch slider events' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        
        // Calculate new order index
        const maxOrderEvent = await prisma.sliderEvent.findFirst({
            orderBy: { orderIndex: 'desc' },
            select: { orderIndex: true }
        })
        const newOrderIndex = maxOrderEvent ? maxOrderEvent.orderIndex + 1 : 0

        const event = await prisma.sliderEvent.create({
            data: {
                title: body.title,
                subtitle: body.subtitle,
                imagePath: body.imagePath,
                orderIndex: newOrderIndex,
                createdBy: body.createdBy,
            },
        })
        return NextResponse.json(event, { status: 201 })
    } catch (error) {
        console.error('Error creating slider event:', error)
        return NextResponse.json({ error: 'Failed to create slider event' }, { status: 500 })
    }
}
