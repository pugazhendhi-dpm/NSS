'use client'

import { useEffect, useState } from 'react'
import { Award, Droplet } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface TopDonor {
    name: string
    roll_number: string
    blood_group: string
    total_donations: number
    total_units: number
}

export default function TopDonors() {
    const [donors, setDonors] = useState<TopDonor[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadTopDonors()
    }, [])

    const loadTopDonors = async () => {
        try {
            const { data, error } = await supabase
                .from('donation_records')
                .select('donor_name, donor_roll_number, blood_group, units_donated')
                .order('donation_date', { ascending: false })

            if (error) {
                console.error('Error loading donors:', error)
            } else {
                // Group by donor and calculate totals
                const donorMap = new Map<string, TopDonor>()

                data?.forEach(record => {
                    const key = record.donor_roll_number
                    if (donorMap.has(key)) {
                        const existing = donorMap.get(key)!
                        existing.total_donations += 1
                        existing.total_units += record.units_donated || 0
                    } else {
                        donorMap.set(key, {
                            name: record.donor_name,
                            roll_number: record.donor_roll_number,
                            blood_group: record.blood_group,
                            total_donations: 1,
                            total_units: record.units_donated || 0,
                        })
                    }
                })

                // Convert to array and sort by total donations
                const topDonors = Array.from(donorMap.values())
                    .sort((a, b) => b.total_donations - a.total_donations)
                    .slice(0, 5) // Top 5 donors

                setDonors(topDonors)
            }
        } catch (err) {
            console.error('Exception loading donors:', err)
        }
        setLoading(false)
    }

    if (loading || donors.length === 0) return null

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full mb-3">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">Blood Heroes</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Our Top Donors
                    </h2>
                    <p className="text-gray-600">
                        Celebrating our volunteers who have made the biggest impact
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {donors.map((donor, index) => (
                        <div
                            key={donor.roll_number}
                            className={`relative bg-gradient-to-br ${index === 0 ? 'from-yellow-400 to-yellow-500' :
                                    index === 1 ? 'from-gray-300 to-gray-400' :
                                        index === 2 ? 'from-orange-400 to-orange-500' :
                                            'from-red-100 to-red-200'
                                } rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-300 shadow-lg`}
                        >
                            {/* Rank Badge */}
                            <div className={`absolute -top-3 -right-3 w-10 h-10 ${index === 0 ? 'bg-yellow-600' :
                                    index === 1 ? 'bg-gray-600' :
                                        index === 2 ? 'bg-orange-600' :
                                            'bg-red-600'
                                } rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                                #{index + 1}
                            </div>

                            {/* Trophy for top 3 */}
                            {index < 3 && (
                                <div className="mb-3">
                                    <Award className={`w-12 h-12 mx-auto ${index === 0 ? 'text-yellow-700' :
                                            index === 1 ? 'text-gray-700' :
                                                'text-orange-700'
                                        }`} />
                                </div>
                            )}

                            {/* Donor Info */}
                            <h3 className={`font-bold text-lg mb-1 ${index < 3 ? 'text-gray-900' : 'text-red-900'
                                }`}>
                                {donor.name}
                            </h3>
                            <p className={`text-sm mb-2 ${index < 3 ? 'text-gray-700' : 'text-red-700'
                                }`}>
                                {donor.roll_number}
                            </p>

                            {/* Blood Group Badge */}
                            <div className="inline-block bg-white/80 px-3 py-1 rounded-full mb-3">
                                <span className="text-red-600 font-bold">{donor.blood_group}</span>
                            </div>

                            {/* Stats */}
                            <div className={`mt-3 pt-3 border-t ${index < 3 ? 'border-gray-700/20' : 'border-red-700/20'
                                }`}>
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                    <Droplet className={`w-4 h-4 ${index < 3 ? 'text-gray-700' : 'text-red-700'
                                        }`} />
                                    <span className={`font-bold ${index < 3 ? 'text-gray-900' : 'text-red-900'
                                        }`}>
                                        {donor.total_donations} {donor.total_donations === 1 ? 'donation' : 'donations'}
                                    </span>
                                </div>
                                <p className={`text-xs ${index < 3 ? 'text-gray-700' : 'text-red-700'
                                    }`}>
                                    {donor.total_units.toFixed(1)} units donated
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Appreciation Message */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 italic">
                        "Every donation is a gift of life. Thank you to all our heroes!" 🩸
                    </p>
                </div>
            </div>
        </section>
    )
}
