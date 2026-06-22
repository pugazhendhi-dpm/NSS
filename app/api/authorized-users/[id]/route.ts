import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const user = await prisma.authorizedUser.update({
            where: { id: params.id },
            data: {
                name: body.name,
                role: body.role,
                isActive: body.is_active,
            },
        })
        return NextResponse.json(user)
    } catch (error) {
        console.error('Error updating authorized user:', error)
        return NextResponse.json({ error: 'Failed to update authorized user' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.authorizedUser.delete({
            where: { id: params.id },
        })
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting authorized user:', error)
        return NextResponse.json({ error: 'Failed to delete authorized user' }, { status: 500 })
    }
}
