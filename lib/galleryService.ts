import { supabase } from './supabase/client'

// Gallery image interface
export interface GalleryImage {
    id: string
    title: string
    description: string
    imageUrl: string
    category: string
    uploadedAt: Date
    uploadedBy: string
}

// Get all gallery images from Supabase
export async function getGalleryImages(): Promise<GalleryImage[]> {
    try {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('uploaded_at', { ascending: false })

        if (error) throw error

        return (data || []).map((image) => ({
            id: image.id,
            title: image.title,
            description: image.description || '',
            imageUrl: image.image_url,
            category: image.category || '',
            uploadedAt: new Date(image.uploaded_at),
            uploadedBy: image.uploaded_by || 'Unknown',
        }))
    } catch (error) {
        console.error('Error loading gallery:', error)
        return []
    }
}

// Upload image to Supabase Storage and add to gallery
export async function addGalleryImage(
    title: string,
    description: string,
    imageFile: File,
    category: string,
    uploadedBy: string
): Promise<GalleryImage | null> {
    try {
        // 1. Upload image to Supabase Storage
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(filePath, imageFile, {
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) throw uploadError

        // 2. Get public URL for the uploaded image
        const {
            data: { publicUrl },
        } = supabase.storage.from('gallery-images').getPublicUrl(filePath)

        // 3. Add gallery entry to database
        const { data, error } = await supabase
            .from('gallery')
            .insert({
                title,
                description,
                image_url: publicUrl,
                category,
                uploaded_by: uploadedBy,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            title: data.title,
            description: data.description || '',
            imageUrl: data.image_url,
            category: data.category || '',
            uploadedAt: new Date(data.uploaded_at),
            uploadedBy: data.uploaded_by || 'Unknown',
        }
    } catch (error) {
        console.error('Error uploading image:', error)
        return null
    }
}

// Delete gallery image from Supabase
export async function deleteGalleryImage(id: string): Promise<boolean> {
    try {
        // 1. Get the image URL to extract file path
        const { data: imageData } = await supabase.from('gallery').select('image_url').eq('id', id).single()

        if (imageData?.image_url) {
            // Extract file name from URL
            const urlParts = imageData.image_url.split('/')
            const fileName = urlParts[urlParts.length - 1]

            // 2. Delete from storage
            await supabase.storage.from('gallery-images').remove([fileName])
        }

        // 3. Delete from database
        const { error } = await supabase.from('gallery').delete().eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting image:', error)
        return false
    }
}

// Subscribe to real-time gallery changes
export function subscribeToGallery(callback: () => void): () => void {
    const channel = supabase
        .channel('gallery-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}

// Compress image before upload (optional, for better performance)
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
