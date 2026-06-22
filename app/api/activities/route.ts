import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            orderBy: { date: 'desc' },
        })
        return NextResponse.json(activities)
    } catch (error) {
        console.error('Error fetching activities:', error)
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const activity = await prisma.activity.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                date: new Date(body.date),
                location: body.location,
                participants: body.participants,
                imageUrl: body.imageUrl,
                documentUrl: body.documentUrl,
                createdBy: body.createdBy,
            },
        })
        return NextResponse.json(activity, { status: 201 })
    } catch (error) {
        console.error('Error creating activity:', error)
        return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
    }
}
