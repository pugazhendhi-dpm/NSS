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
    createdBy: string
): Promise<SliderEvent | null> {
    try {
        // 0. Calculate new order index
        const { data: maxOrderData } = await supabase
            .from('slider_events')
            .select('order_index')
            .order('order_index', { ascending: false })
            .limit(1)
        
        const newOrderIndex = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order_index + 1 : 0;

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
                order_index: newOrderIndex,
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

export async function updateSliderEvent(
    id: string,
    title: string,
    subtitle: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('slider_events')
            .update({ title, subtitle })
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error updating slider event:', error)
        return false
    }
}

export async function updateSliderOrder(
    orderedIds: string[]
): Promise<boolean> {
    try {
        // Prepare the upsert payload (we only update order_index for existing records)
        // Note: Supabase JS doesn't have a bulk update, so we can do it via a loop or by fetching and updating individually. 
        // Since the list of slides is usually small (e.g. 5-10), a Promise.all with updates is fine.
        const promises = orderedIds.map((id, index) => 
            supabase
                .from('slider_events')
                .update({ order_index: index })
                .eq('id', id)
        )

        await Promise.all(promises)
        
        return true
    } catch (error) {
        console.error('Error updating slider order:', error)
        return false
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
