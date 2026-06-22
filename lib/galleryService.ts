export interface GalleryImage {
    id: string
    title: string
    description: string
    imagePath: string
    category: string
    uploadedAt: Date
    uploadedBy: string
    fileSize?: number
    mimeType?: string
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const response = await fetch('/api/gallery')
        if (!response.ok) throw new Error('Failed to fetch gallery')
        
        const data = await response.json()
        return data.map((image: any) => ({
            ...image,
            uploadedAt: new Date(image.uploadedAt)
        }))
    } catch (error) {
        console.error('Error loading gallery:', error)
        return []
    }
}

export async function addGalleryImage(
    title: string,
    description: string,
    imageFile: File,
    category: string,
    uploadedBy: string
): Promise<GalleryImage | null> {
    try {
        // 1. Upload image to local server
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('folder', 'gallery')

        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload image file')
        
        const { imagePath, fileSize, mimeType } = await uploadResponse.json()

        // 2. Add gallery entry to database
        const response = await fetch('/api/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                imagePath,
                fileSize,
                mimeType,
                category,
                uploadedBy
            })
        })

        if (!response.ok) throw new Error('Failed to add gallery entry')
        
        const data = await response.json()
        return {
            ...data,
            uploadedAt: new Date(data.uploadedAt)
        }
    } catch (error) {
        console.error('Error uploading image:', error)
        return null
    }
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/gallery/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting image:', error)
        return false
    }
}

export async function updateGalleryImage(
    id: string,
    title: string,
    description: string,
    category: string
): Promise<boolean> {
    try {
        const response = await fetch(`/api/gallery/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                category
            })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating image:', error)
        return false
    }
}

export function subscribeToGallery(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend.')
    return () => {}
}

export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                if (!ctx) {
                    reject(new Error('Could not get canvas context'))
                    return
                }

                // Calculate new dimensions
                let width = img.width
                let height = img.height

                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            })
                            resolve(compressedFile)
                        } else {
                            reject(new Error('Failed to compress image'))
                        }
                    },
                    'image/jpeg',
                    0.8
                )
            }
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target?.result as string
        }
        reader.onerror = (error) => reject(error)
    })
}
