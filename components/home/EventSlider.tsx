'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getSliderEvents, subscribeToSliderEvents, SliderEvent } from '@/lib/sliderService'

export default function EventSlider() {
    const [sliderEvents, setSliderEvents] = useState<SliderEvent[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadEvents = async () => {
            const data = await getSliderEvents()
            setSliderEvents(data)
            setLoading(false)
        }
        loadEvents()

        const unsubscribe = subscribeToSliderEvents(async () => {
            const data = await getSliderEvents()
            setSliderEvents(data)
            setCurrentIndex(0) // Reset to first slide when data changes
        })

        return unsubscribe
    }, [])

    const nextSlide = useCallback(() => {
        if (sliderEvents.length === 0) return
        setCurrentIndex((prevIndex) => (prevIndex === sliderEvents.length - 1 ? 0 : prevIndex + 1))
    }, [sliderEvents.length])

    const prevSlide = () => {
        if (sliderEvents.length === 0) return
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? sliderEvents.length - 1 : prevIndex - 1))
    }

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    // Auto-play effect
    useEffect(() => {
        if (sliderEvents.length <= 1) return

        const timer = setInterval(() => {
            nextSlide()
        }, 4000)

        return () => clearInterval(timer)
    }, [nextSlide, sliderEvents.length])

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-nss-blue mb-10 text-center relative inline-block left-1/2 -translate-x-1/2">
                        Recent Event Highlights
                        <div className="h-1 w-2/3 bg-nss-red mx-auto mt-2 rounded-full"></div>
                    </h2>
                    <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl bg-gray-200 animate-pulse flex items-center justify-center">
                        <span className="text-gray-400">Loading slider...</span>
                    </div>
                </div>
            </section>
        )
    }

    if (sliderEvents.length === 0) {
        return null // Hide section if no slides
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-nss-blue mb-10 text-center relative inline-block left-1/2 -translate-x-1/2">
                    Recent Event Highlights
                    <div className="h-1 w-2/3 bg-nss-red mx-auto mt-2 rounded-full"></div>
                </h2>

                <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
                    {/* Slides Container */}
                    <div 
                        className="w-full h-full flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {sliderEvents.map((event) => (
                            <div key={event.id} className="min-w-full h-full relative">
                                <Image
                                    src={event.imageUrl}
                                    alt={event.title}
                                    fill
                                    loading="lazy"
                                    className="object-cover"
                                />
                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent 65%)' }} />
                                
                                {/* Text Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-white">
                                    <h3 className="text-2xl md:text-4xl font-bold mb-3 drop-shadow-lg">{event.title}</h3>
                                    <p className="text-lg md:text-xl text-gray-200 drop-shadow-md max-w-3xl">{event.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    {sliderEvents.length > 1 && (
                        <>
                            <button 
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-nss-blue backdrop-blur-sm transition-all opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button 
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-nss-blue backdrop-blur-sm transition-all opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Dots Navigation */}
                    {sliderEvents.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                            {sliderEvents.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === currentIndex 
                                            ? 'w-8 h-3 bg-nss-red' 
                                            : 'w-3 h-3 bg-white/50 hover:bg-white'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
