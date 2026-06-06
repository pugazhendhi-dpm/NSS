'use client'

import { useEffect, useState } from 'react'
import { Heart, Droplet } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface RecentDonor {
    name: string
    bloodGroup: string
    donatedAt: Date
}

export default function RecentDonorsTicker() {
    const [donors, setDonors] = useState<RecentDonor[]>([])

    useEffect(() => {
        loadRecentDonors()
    }, [])

    const loadRecentDonors = async () => {
        try {
            // Fetch recent donations from the last 90 days
            const { data, error } = await supabase
                .from('donation_records')
                .select(`
                    donated_at,
                    blood_donors (
                        name,
                        bloodGroup
                    )
                `)
                .order('donated_at', { ascending: false })
                .limit(20)

            if (error) {
                console.error('Error fetching recent donors:', error)
                return
            }

            if (data) {
                const recentDonors: RecentDonor[] = data
                    .filter(record => record.blood_donors)
                    .map(record => ({
                        name: (record.blood_donors as any).name,
                        bloodGroup: (record.blood_donors as any).bloodGroup,
                        donatedAt: new Date(record.donated_at)
                    }))

                setDonors(recentDonors)
            }
        } catch (error) {
            console.error('Error loading recent donors:', error)
        }
    }

    if (donors.length === 0) {
        return null
    }

    return (
        <div className="bg-gradient-to-r from-red-50 via-pink-50 to-red-50 border-y-2 border-red-200 py-4 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                        <Heart className="w-5 h-5 text-red-600 animate-pulse" fill="currentColor" />
                        <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                            Recent Blood Donors - Thank You Heroes! 🙏
                        </h3>
                    </div>
                </div>

                {/* Scrolling ticker */}
                <div className="relative">
                    <div className="ticker-wrapper">
                        <div className="ticker-content">
                            {/* Duplicate the list for seamless loop */}
                            {[...donors, ...donors].map((donor, index) => (
                                <div
                                    key={index}
                                    className="inline-flex items-center space-x-2 mx-6 px-4 py-2 bg-white rounded-full shadow-md border border-red-200"
                                >
                                    <Droplet className="w-4 h-4 text-red-600" fill="currentColor" />
                                    <span className="font-semibold text-gray-800">{donor.name}</span>
                                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                                        {donor.bloodGroup}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {getRelativeTime(donor.donatedAt)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .ticker-wrapper {
                    overflow: hidden;
                    white-space: nowrap;
                }

                .ticker-content {
                    display: inline-block;
                    animation: scroll 60s linear infinite;
                }

                .ticker-content:hover {
                    animation-play-state: paused;
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    )
}

function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
}
