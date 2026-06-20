'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, Image as ImageIcon, X } from 'lucide-react'
import { getGalleryImages, subscribeToGallery, GalleryImage } from '@/lib/galleryService'
import { useSession } from 'next-auth/react'

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
    const { status } = useSession()
    const isLoggedIn = status === 'authenticated'

    useEffect(() => {
        // Load gallery images (async)
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
    }, [])

    const openLightbox = (image: GalleryImage) => {
        setSelectedImage(image)
        document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

    const closeLightbox = () => {
        setSelectedImage(null)
        document.body.style.overflow = 'auto' // Restore scrolling
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
                    <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                        Moments of service, compassion, and community impact
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {images.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No photos yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                    onClick={() => openLightbox(image)}
                                >
                                    <div className="relative h-80">
                                        {image.imageUrl.startsWith('data:') ? (
                                            // For base64 images
                                            <img
                                                src={image.imageUrl}
                                                alt={image.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            // For external URLs
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                                        <div className="flex items-center space-x-2 text-sm text-gray-200 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(image.uploadedAt).toLocaleDateString()}</span>
                                        </div>
                                        {image.description && (
                                            <p className="text-sm text-gray-300">{image.description}</p>
                                        )}
                                        {image.category && (
                                            <span className="inline-block mt-2 px-3 py-1 bg-nss-blue/80 text-white text-xs rounded-full">
                                                {image.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-nss-red transition-colors p-2 bg-black/50 rounded-full"
                        aria-label="Close"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div
                        className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Image */}
                        <div className="relative w-full flex-1 flex items-center justify-center mb-4">
                            {selectedImage.imageUrl.startsWith('data:') ? (
                                <img
                                    src={selectedImage.imageUrl}
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
                                />
                            ) : (
                                <div className="relative w-full h-[70vh]">
                                    <Image
                                        src={selectedImage.imageUrl}
                                        alt={selectedImage.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Image Info */}
                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-2xl">
                            <h2 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h2>
                            <div className="flex items-center space-x-2 text-gray-300 mb-3">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(selectedImage.uploadedAt).toLocaleDateString()}</span>
                                {selectedImage.category && (
                                    <>
                                        <span>•</span>
                                        <span className="px-2 py-1 bg-nss-blue rounded-full text-xs">
                                            {selectedImage.category}
                                        </span>
                                    </>
                                )}
                            </div>
                            {selectedImage.description && (
                                <p className="text-gray-200">{selectedImage.description}</p>
                            )}
                            <p className="text-gray-400 text-sm mt-2">Uploaded by: {selectedImage.uploadedBy}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Section - Only show if not logged in */}
            {!isLoggedIn && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-2xl font-bold text-nss-blue mb-4">Share Your NSS Moments</h2>
                        <p className="text-gray-600 mb-6">
                            NSS volunteers can upload photos directly through the volunteer dashboard.
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-nss-red hover:bg-nss-red-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Volunteer Login
                        </a>
                    </div>
                </section>
            )}
        </div>
    )
}
