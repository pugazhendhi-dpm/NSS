import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
    try {
        const images = await prisma.gallery.findMany({
            orderBy: { uploadedAt: 'desc' },
        })
        return NextResponse.json(images)
    } catch (error) {
        console.error('Error fetching gallery:', error)
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const image = await prisma.gallery.create({
            data: {
                title: body.title,
                description: body.description,
                imagePath: body.imagePath,
                category: body.category,
                uploadedBy: body.uploadedBy,
                fileSize: body.fileSize,
                mimeType: body.mimeType,
            },
        })
        return NextResponse.json(image, { status: 201 })
    } catch (error) {
        console.error('Error creating gallery entry:', error)
        return NextResponse.json({ error: 'Failed to create gallery entry' }, { status: 500 })
    }
}
