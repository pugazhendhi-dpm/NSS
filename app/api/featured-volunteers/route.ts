import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const volunteers = await prisma.featuredVolunteer.findMany({
            orderBy: { createdAt: 'asc' },
        })
        return NextResponse.json(volunteers)
    } catch (error) {
        console.error('Error fetching featured volunteers:', error)
        return NextResponse.json({ error: 'Failed to fetch featured volunteers' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const volunteer = await prisma.featuredVolunteer.create({
            data: {
                name: body.name,
                department: body.department,
                phone: body.phone,
            },
        })
        return NextResponse.json(volunteer, { status: 201 })
    } catch (error) {
        console.error('Error creating featured volunteer:', error)
        return NextResponse.json({ error: 'Failed to create featured volunteer' }, { status: 500 })
    }
}
