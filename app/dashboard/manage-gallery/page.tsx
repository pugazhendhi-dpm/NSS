'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import {
    getGalleryImages,
    addGalleryImage,
    deleteGalleryImage,
    subscribeToGallery,
    GalleryImage,
} from '@/lib/galleryService'

export default function GalleryManagementPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [images, setImages] = useState<GalleryImage[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [uploading, setUploading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        imageFile: null as File | null,
        imagePreview: '',
    })

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
        }

        // Load gallery (async)
        const loadImages = async () => {
            const data = await getGalleryImages()
            setImages(data)
        }
        loadImages()

        // Subscribe to changes
        const unsubscribe = subscribeToGallery(async () => {
            const data = await getGalleryImages()
            setImages(data)
        })

        return unsubscribe
    }, [router])

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: '',
            imageFile: null,
            imagePreview: '',
        })
    }

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB')
                return
            }

            // Check file type
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
        if (!volunteer || !formData.title || !formData.imageFile) return

        setUploading(true)
        try {
            // Upload image to Supabase Storage
            const result = await addGalleryImage(
                formData.title,
                formData.description,
                formData.imageFile,
                formData.category,
                volunteer.name
            )

            if (result) {
                resetForm()
                setIsAdding(false)
                alert('Photo uploaded successfully!')
            } else {
                alert('Failed to upload image. Please try again.')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try a smaller file.')
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this image?')) {
            await deleteGalleryImage(id)
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
                            <h1 className="text-2xl font-bold">Gallery Management</h1>
                            <p className="text-gray-200">Upload and manage gallery photos</p>
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
                        className="btn-primary mb-6 flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Upload New Photo</span>
                    </button>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="font-semibold text-nss-blue mb-4">Upload New Photo</h3>

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Image (Max 5MB)
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    {formData.imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={formData.imagePreview}
                                                alt="Preview"
                                                className="max-h-64 mx-auto rounded-lg"
                                            />
                                            <button
                                                onClick={() =>
                                                    setFormData({ ...formData, imageFile: null, imagePreview: '' })
                                                }
                                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
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
                                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Blood Donation Camp 2026"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows={2}
                                    placeholder="Brief description of the photo"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Blood Donation, Environment, Community Service"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-3">
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
                                    disabled={!formData.title || !formData.imageFile || uploading}
                                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden group relative"
                        >
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={image.imageUrl}
                                    alt={image.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{image.description}</p>
                                {image.category && (
                                    <span className="inline-block px-2 py-1 bg-nss-blue/10 text-nss-blue text-xs rounded-full">
                                        {image.category}
                                    </span>
                                )}
                                <p className="text-xs text-gray-400 mt-2">By: {image.uploadedBy}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {images.length === 0 && (
                    <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No photos yet. Upload your first photo!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
