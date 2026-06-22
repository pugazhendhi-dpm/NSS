import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request) {
    try {
        const { orderedIds } = await request.json()
        
        if (!Array.isArray(orderedIds)) {
            return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 })
        }

        // Run all updates in a transaction
        await prisma.$transaction(
            orderedIds.map((id, index) => 
                prisma.sliderEvent.update({
                    where: { id },
                    data: { orderIndex: index },
                })
            )
        )
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating slider order:', error)
        return NextResponse.json({ error: 'Failed to update slider order' }, { status: 500 })
    }
}
