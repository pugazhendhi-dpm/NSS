import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const updates = await prisma.update.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(updates)
    } catch (error) {
        console.error('Error fetching updates:', error)
        return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const update = await prisma.update.create({
            data: {
                content: body.content,
                createdBy: body.createdBy,
            },
        })
        return NextResponse.json(update, { status: 201 })
    } catch (error) {
        console.error('Error creating update:', error)
        return NextResponse.json({ error: 'Failed to create update' }, { status: 500 })
    }
}
