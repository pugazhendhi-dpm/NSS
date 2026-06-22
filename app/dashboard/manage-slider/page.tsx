'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { Plus, Trash2, Upload, Image as ImageIcon, X, GripVertical, Edit2, Save, XCircle } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { Reorder } from 'framer-motion'
import {
    getSliderEvents,
    addSliderEvent,
    deleteSliderEvent,
    updateSliderEvent,
    updateSliderOrder,
    subscribeToSliderEvents,
    SliderEvent,
} from '@/lib/sliderService'

export default function ManageSliderPage() {
    const router = useRouter()
    const { user } = useAuth()
    const volunteer = user ? { id: user.dbId, name: user.name, email: user.email, role: user.role } as any : null
    const [events, setEvents] = useState<SliderEvent[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [uploading, setUploading] = useState(false)
    
    // Editing state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editFormData, setEditFormData] = useState({ title: '', subtitle: '' })

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        imageFile: null as File | null,
        imagePreview: '',
    })

    useEffect(() => {
        const loadEvents = async () => {
            const data = await getSliderEvents()
            setEvents(data)
        }
        loadEvents()

        const unsubscribe = subscribeToSliderEvents(async () => {
            const data = await getSliderEvents()
            setEvents(data)
        })

        return unsubscribe
    }, [])

    const resetForm = () => {
        setFormData({
            title: '',
            subtitle: '',
            imageFile: null,
            imagePreview: '',
        })
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }
            setFormData({
                ...formData,
                imageFile: file,
                imagePreview: URL.createObjectURL(file),
            })
        }
    }

    const handleUpload = async () => {
        if (!volunteer || !formData.title || !formData.subtitle || !formData.imageFile) return

        setUploading(true)
        try {
            const result = await addSliderEvent(
                formData.title,
                formData.subtitle,
                formData.imageFile,
                volunteer.name
            )

            if (result) {
                resetForm()
                setIsAdding(false)
                alert('Slide added successfully!')
            } else {
                alert('Failed to add slide. Please try again.')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try a smaller file.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            await deleteSliderEvent(id)
        }
    }

    const handleReorder = async (newOrder: SliderEvent[]) => {
        setEvents(newOrder)
        const orderedIds = newOrder.map(e => e.id)
        await updateSliderOrder(orderedIds)
    }

    const startEditing = (event: SliderEvent) => {
        setEditingId(event.id)
        setEditFormData({ title: event.title, subtitle: event.subtitle || '' })
    }

    const cancelEditing = () => {
        setEditingId(null)
    }

    const saveEdit = async (id: string) => {
        const success = await updateSliderEvent(id, editFormData.title, editFormData.subtitle)
        if (success) {
            setEditingId(null)
            // Local state update is handled by realtime subscription, but we can do it optimistically
            setEvents(events.map(e => e.id === id ? { ...e, title: editFormData.title, subtitle: editFormData.subtitle } : e))
        } else {
            alert("Failed to update slide.")
        }
    }

    if (!volunteer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Home Slider Management</h1>
                            <p className="text-gray-200">Upload and manage images shown on the Home Page</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Upload Section */}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-primary mb-6 flex items-center space-x-2 shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Slide</span>
                    </button>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="font-semibold text-nss-blue mb-4">Add New Slide</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Image (Max 5MB)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center h-64 flex flex-col items-center justify-center">
                                    {formData.imagePreview ? (
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="max-h-full max-w-full object-contain rounded-lg"
                                            />
                                            <button
                                                onClick={() =>
                                                    setFormData({ ...formData, imageFile: null, imagePreview: '' })
                                                }
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                            <label className="cursor-pointer">
                                                <span className="text-nss-blue hover:text-nss-blue-dark font-semibold">
                                                    Click to upload
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageSelect}
                                                    className="hidden"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1">Wide landscape images work best (e.g. 1920x1080)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., NSS KEC '26 Volunteer Orientation"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtitle / Description
                                    </label>
                                    <textarea
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        className="input-field resize-none"
                                        rows={4}
                                        placeholder="Brief description that appears over the image"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex space-x-3 justify-end">
                            <button
                                onClick={() => {
                                    resetForm()
                                    setIsAdding(false)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!formData.title || !formData.subtitle || !formData.imageFile || uploading}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{uploading ? 'Uploading...' : 'Save Slide'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Slides List */}
                {events.length > 0 && (
                    <div className="mb-4 text-sm text-gray-500 italic">
                        Tip: Drag and drop the handle (⋮⋮) to reorder the slides.
                    </div>
                )}
                
                <Reorder.Group axis="y" values={events} onReorder={handleReorder} className="space-y-4">
                    {events.map((event) => (
                        <Reorder.Item 
                            key={event.id} 
                            value={event}
                            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row relative group cursor-default border border-transparent hover:border-gray-200"
                        >
                            {/* Drag Handle */}
                            <div className="flex items-center justify-center p-3 bg-gray-50 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors">
                                <GripVertical className="w-6 h-6" />
                            </div>

                            <div className="w-full md:w-64 h-40 relative bg-gray-200 shrink-0">
                                <img
                                    src={event.imagePath}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                {editingId === event.id ? (
                                    <div className="space-y-3 w-full">
                                        <input
                                            type="text"
                                            value={editFormData.title}
                                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                            className="input-field text-lg font-bold py-1 px-2"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            value={editFormData.subtitle}
                                            onChange={(e) => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                                            className="input-field text-sm resize-none py-1 px-2"
                                            rows={2}
                                            placeholder="Subtitle"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-bold text-nss-blue mb-1">{event.title}</h3>
                                            <span className="bg-blue-50 text-nss-blue border border-blue-100 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ml-4">
                                                Order: {event.orderIndex}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1 line-clamp-2">{event.subtitle}</p>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-400 font-medium">Added by: {event.createdBy}</p>
                                    
                                    <div className="flex space-x-2">
                                        {editingId === event.id ? (
                                            <>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="text-gray-500 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Cancel</span>
                                                </button>
                                                <button
                                                    onClick={() => saveEdit(event.id)}
                                                    className="text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Save</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(event)}
                                                    className="text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-sm font-medium">Delete</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {events.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No slides found</p>
                        <p className="text-gray-400 text-sm mt-1">Upload your first slider image above!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
