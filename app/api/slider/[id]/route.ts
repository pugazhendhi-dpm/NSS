import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const event = await prisma.sliderEvent.update({
            where: { id: params.id },
            data: {
                title: body.title,
                subtitle: body.subtitle,
            },
        })
        return NextResponse.json(event)
    } catch (error) {
        console.error('Error updating slider event:', error)
        return NextResponse.json({ error: 'Failed to update slider event' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // 1. Get the image URL to extract file path
        const event = await prisma.sliderEvent.findUnique({
            where: { id: params.id }
        })

        if (event?.imagePath) {
            // Delete from local storage if it's a local upload via our API
            if (event.imagePath.startsWith('/api/media/')) {
                const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
                const fileNamePath = event.imagePath.replace('/api/media/', '')
                const filePath = path.join(baseUploadDir, fileNamePath)
                
                try {
                    await unlink(filePath)
                } catch (e) {
                    console.error('Failed to delete physical file:', e)
                }
            }
        }

        // 2. Delete database entry
        await prisma.sliderEvent.delete({
            where: { id: params.id },
        })
        
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting slider event:', error)
        return NextResponse.json({ error: 'Failed to delete slider event' }, { status: 500 })
    }
}
