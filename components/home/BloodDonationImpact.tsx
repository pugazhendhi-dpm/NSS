'use client'

import { useEffect, useState } from 'react'
import { Droplet, Heart, Users, Award } from 'lucide-react'
import { getImpactStats } from '@/lib/campaignService'

export default function BloodDonationImpact() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const data = await getImpactStats()
        setStats(data)
        setLoading(false)
    }

    if (loading || !stats) return null

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full mb-4">
                        <Droplet className="w-5 h-5" />
                        <span className="font-semibold">Blood Donation Impact</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Saving Lives Together
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Every drop counts. See the incredible impact our volunteers have made through blood donation.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Lives Saved */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div className="text-5xl font-bold text-red-600 mb-2 animate-count-up">
                            {stats.livesSaved}
                        </div>
                        <div className="text-gray-600 font-semibold">Lives Saved</div>
                        <div className="text-xs text-gray-500 mt-1">1 unit = 3 lives</div>
                    </div>

                    {/* Total Units */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Droplet className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-blue-600 mb-2">
                            {stats.totalUnits}
                        </div>
                        <div className="text-gray-600 font-semibold">Units Collected</div>
                        <div className="text-xs text-gray-500 mt-1">Blood units donated</div>
                    </div>

                    {/* Total Donations */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-green-600 mb-2">
                            {stats.totalDonations}
                        </div>
                        <div className="text-gray-600 font-semibold">Donations</div>
                        <div className="text-xs text-gray-500 mt-1">Generous contributions</div>
                    </div>
                </div>

                {/* Blood Group Breakdown */}
                {stats.bloodGroupBreakdown && Object.keys(stats.bloodGroupBreakdown).length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Blood Group Contributions
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {Object.entries(stats.bloodGroupBreakdown).map(([group, units]: [string, any]) => (
                                <div key={group} className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-2xl font-bold text-red-600 mb-1">{group}</div>
                                    <div className="text-sm text-gray-600">{units} units</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-12 text-center">
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
                        <h3 className="text-3xl font-bold mb-4">Be a Hero. Donate Blood.</h3>
                        <p className="text-xl mb-6 text-red-100">
                            Your single donation can save up to 3 lives. Join our mission today!
                        </p>
                        <a
                            href="/register-donor"
                            className="inline-block bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-red-50 transition-colors shadow-lg"
                        >
                            Register as Blood Donor
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
