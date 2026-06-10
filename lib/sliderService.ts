import { supabase } from './supabase/client'

export interface SliderEvent {
    id: string
    title: string
    subtitle: string
    imageUrl: string
    orderIndex: number
    createdAt: Date
    createdBy: string
}

export async function getSliderEvents(): Promise<SliderEvent[]> {
    try {
        const { data, error } = await supabase
            .from('slider_events')
            .select('*')
            .order('order_index', { ascending: true })

        if (error) throw error

        return (data || []).map((event) => ({
            id: event.id,
            title: event.title,
            subtitle: event.subtitle || '',
            imageUrl: event.image_url,
            orderIndex: event.order_index || 0,
            createdAt: new Date(event.created_at),
            createdBy: event.created_by || 'Unknown',
        }))
    } catch (error) {
        console.error('Error loading slider events:', error)
        return []
    }
}

export async function addSliderEvent(
    title: string,
    subtitle: string,
    imageFile: File,
    orderIndex: number,
    createdBy: string
): Promise<SliderEvent | null> {
    try {
        // 1. Upload image to gallery-images bucket
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `slider-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('gallery-images')
            .upload(filePath, imageFile, {
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) throw uploadError

        // 2. Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('gallery-images').getPublicUrl(filePath)

        // 3. Add database entry
        const { data, error } = await supabase
            .from('slider_events')
            .insert({
                title,
                subtitle,
                image_url: publicUrl,
                order_index: orderIndex,
                created_by: createdBy,
            })
            .select()
            .single()

        if (error) throw error

        return {
            id: data.id,
            title: data.title,
            subtitle: data.subtitle || '',
            imageUrl: data.image_url,
            orderIndex: data.order_index || 0,
            createdAt: new Date(data.created_at),
            createdBy: data.created_by || 'Unknown',
        }
    } catch (error) {
        console.error('Error adding slider event:', error)
        return null
    }
}

export async function deleteSliderEvent(id: string): Promise<boolean> {
    try {
        // 1. Get the image URL to delete from storage
        const { data: eventData } = await supabase.from('slider_events').select('image_url').eq('id', id).single()

        if (eventData?.image_url) {
            const urlParts = eventData.image_url.split('/')
            const fileName = urlParts[urlParts.length - 1]
            await supabase.storage.from('gallery-images').remove([fileName])
        }

        // 2. Delete database entry
        const { error } = await supabase.from('slider_events').delete().eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error deleting slider event:', error)
        return false
    }
}

export function subscribeToSliderEvents(callback: () => void): () => void {
    const channel = supabase
        .channel('slider-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'slider_events' }, () => {
            callback()
        })
        .subscribe()

    return () => {
        supabase.removeChannel(channel)
    }
}
