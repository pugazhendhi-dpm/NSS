import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const users = await prisma.authorizedUser.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching authorized users:', error)
        return NextResponse.json({ error: 'Failed to fetch authorized users' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const user = await prisma.authorizedUser.create({
            data: {
                email: body.email.toLowerCase().trim(),
                name: body.name.trim(),
                role: body.role,
            },
        })
        return NextResponse.json(user, { status: 201 })
    } catch (error) {
        console.error('Error creating authorized user:', error)
        return NextResponse.json({ error: 'Failed to create authorized user' }, { status: 500 })
    }
}
