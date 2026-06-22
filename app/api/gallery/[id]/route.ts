import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        // 1. Get the image URL to extract file path
        const image = await prisma.gallery.findUnique({
            where: { id: params.id }
        })

        if (image?.imagePath) {
            // Delete from local storage if it's a local upload via our API
            if (image.imagePath.startsWith('/api/media/')) {
                const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
                const fileNamePath = image.imagePath.replace('/api/media/', '')
                const filePath = path.join(baseUploadDir, fileNamePath)
                
                try {
                    await unlink(filePath)
                } catch (e) {
                    console.error('Failed to delete physical file:', e)
                    // Continue anyway to delete the database record
                }
            }
        }

        // 2. Delete from database
        await prisma.gallery.delete({
            where: { id: params.id },
        })
        
        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting gallery image:', error)
        return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const image = await prisma.gallery.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
            },
        })
        return NextResponse.json(image)
    } catch (error) {
        console.error('Error updating gallery image:', error)
        return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
    }
}
