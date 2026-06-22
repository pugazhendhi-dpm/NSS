import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        // Determine sub-folder based on upload context, default to 'misc'
        const folder = (formData.get('folder') as string) || 'misc'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.name)
        const filename = `${file.name.replace(ext, '')}-${uniqueSuffix}${ext}`

        // Get UPLOAD_DIR from env or default to ./uploads
        const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads')
        const targetDir = path.join(baseUploadDir, folder)

        // Ensure directory exists
        if (!existsSync(targetDir)) {
            await mkdir(targetDir, { recursive: true })
        }

        const filePath = path.join(targetDir, filename)
        await writeFile(filePath, buffer)

        // Return URL for the new media API route
        const fileUrl = `/api/media/${folder}/${filename}`
        
        return NextResponse.json({ 
            url: fileUrl, 
            imagePath: fileUrl,
            fileSize: file.size,
            mimeType: file.type,
            fileName: file.name
        }, { status: 201 })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
}
