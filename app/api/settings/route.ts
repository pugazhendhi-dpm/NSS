import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const settings = await prisma.systemSetting.findUnique({
            where: { id: 'global' }
        })
        return NextResponse.json(settings || { id: 'global', activeDonorBatch: null })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { activeDonorBatch } = body

        const settings = await prisma.systemSetting.upsert({
            where: { id: 'global' },
            update: { activeDonorBatch: activeDonorBatch || null },
            create: { id: 'global', activeDonorBatch: activeDonorBatch || null }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}
