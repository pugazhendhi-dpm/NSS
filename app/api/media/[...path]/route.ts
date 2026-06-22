import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const filePath = params.path.join('/')
        const absolutePath = path.join(UPLOAD_DIR, filePath)

        // Security check: ensure the requested file is actually within the UPLOAD_DIR
        if (!absolutePath.startsWith(path.normalize(UPLOAD_DIR))) {
            return new NextResponse('Forbidden', { status: 403 })
        }

        const fileBuffer = await fs.readFile(absolutePath)
        
        // Determine mime type from extension
        const ext = path.extname(absolutePath).toLowerCase()
        const mimeTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.pdf': 'application/pdf',
            '.doc': 'application/msword',
            '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }
        
        const contentType = mimeTypes[ext] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        })
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return new NextResponse('File not found', { status: 404 })
        }
        console.error('Error serving media file:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
