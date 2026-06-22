export interface SliderEvent {
    id: string
    title: string
    subtitle?: string
    imagePath: string
    orderIndex: number
    createdAt: Date
    createdBy: string
}

export async function getSliderEvents(): Promise<SliderEvent[]> {
    try {
        const response = await fetch('/api/slider')
        if (!response.ok) throw new Error('Failed to fetch slider events')
        
        const data = await response.json()
        return data.map((event: any) => ({
            ...event,
            createdAt: new Date(event.createdAt)
        }))
    } catch (error) {
        console.error('Error loading slider events:', error)
        return []
    }
}

export async function addSliderEvent(
    title: string,
    subtitle: string | undefined,
    imageFile: File,
    createdBy: string
): Promise<SliderEvent | null> {
    try {
        // 1. Upload image to local server
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('folder', 'slider')

        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        if (!uploadResponse.ok) throw new Error('Failed to upload image file')
        
        const { imagePath } = await uploadResponse.json()

        // 2. Add event entry to database
        const response = await fetch('/api/slider', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                subtitle,
                imagePath,
                createdBy
            })
        })

        if (!response.ok) throw new Error('Failed to add slider event')
        
        const data = await response.json()
        return {
            ...data,
            createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('Error adding slider event:', error)
        return null
    }
}

export async function updateSliderOrder(orderedIds: string[]): Promise<boolean> {
    try {
        const response = await fetch('/api/slider/reorder', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating slider order:', error)
        return false
    }
}

export async function updateSliderEvent(
    id: string,
    title: string,
    subtitle?: string
): Promise<boolean> {
    try {
        const response = await fetch(`/api/slider/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, subtitle })
        })
        return response.ok
    } catch (error) {
        console.error('Error updating slider event:', error)
        return false
    }
}

export async function deleteSliderEvent(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/slider/${id}`, {
            method: 'DELETE'
        })
        return response.ok
    } catch (error) {
        console.error('Error deleting slider event:', error)
        return false
    }
}

export function subscribeToSlider(callback: () => void): () => void {
    console.warn('Real-time subscriptions are not supported with MySQL backend.')
    return () => {}
}

export const subscribeToSliderEvents = subscribeToSlider
