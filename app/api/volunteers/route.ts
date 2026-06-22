import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'rejected'

    try {
        let whereClause = {}
        if (status) {
            whereClause = { status }
        }

        const volunteers = await prisma.volunteer.findMany({
            where: whereClause,
            orderBy: status === 'approved' ? { name: 'asc' } : { createdAt: 'desc' },
        })
        return NextResponse.json(volunteers)
    } catch (error) {
        console.error('Error fetching volunteers:', error)
        return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const volunteer = await prisma.volunteer.create({
            data: {
                name: body.name,
                email: body.email,
                rollNumber: body.rollNumber,
                department: body.department,
                year: parseInt(body.year),
                phone: body.phone,
                bloodGroup: body.bloodGroup,
                role: 'volunteer',
                status: 'pending',
            },
        })
        return NextResponse.json(volunteer, { status: 201 })
    } catch (error: any) {
        console.error('Error creating volunteer:', error)
        
        // Handle Prisma unique constraint errors
        if (error.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
                return NextResponse.json(
                    { error: 'This email address is already registered. Please use a different email or contact NSS if you need help.' }, 
                    { status: 409 }
                )
            } else if (error.meta?.target?.includes('roll_number')) {
                return NextResponse.json(
                    { error: 'This roll number is already registered. Please check your roll number or contact NSS if you need help.' }, 
                    { status: 409 }
                )
            }
        }
        
        return NextResponse.json({ error: 'Failed to create volunteer' }, { status: 500 })
    }
}
