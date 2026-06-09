'use client'

import { useEffect, useState } from 'react'
import { Droplet, Heart, Users } from 'lucide-react'
import { getBloodDonationYearRecords, groupByYear, YearSummary } from '@/lib/bloodDonationYearService'

export default function BloodDonationImpact() {
    const [yearSummaries, setYearSummaries] = useState<YearSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const records = await getBloodDonationYearRecords()
        const grouped = groupByYear(records)
        // Keep only the past 4 years (already sorted descending)
        setYearSummaries(grouped.slice(0, 4))
        setLoading(false)
    }

    const totalUnits = yearSummaries.reduce((s, y) => s + y.totalUnits, 0)
    const totalDonors = yearSummaries.reduce((s, y) => s + y.totalDonors, 0)
    const maxUnits = Math.max(...yearSummaries.map(y => y.totalUnits), 1)

    if (loading || yearSummaries.length === 0) return null

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

                {/* All-time Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <div className="text-5xl font-bold text-red-600 mb-2">{totalUnits * 3}</div>
                        <div className="text-gray-600 font-semibold">Lives Saved</div>
                        <div className="text-xs text-gray-500 mt-1">1 unit = 3 lives</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Droplet className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-blue-600 mb-2">{totalUnits}</div>
                        <div className="text-gray-600 font-semibold">Units Collected</div>
                        <div className="text-xs text-gray-500 mt-1">Blood units donated</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-green-600 mb-2">{totalDonors}</div>
                        <div className="text-gray-600 font-semibold">Total Donors</div>
                        <div className="text-xs text-gray-500 mt-1">Generous volunteers</div>
                    </div>
                </div>

                {/* Year-wise Bar Chart */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        Year-wise Blood Donation Records
                    </h3>
                    <p className="text-gray-500 text-sm text-center mb-8">Last {yearSummaries.length} academic years</p>

                    <div className="space-y-5">
                        {yearSummaries.map((y, i) => {
                            const barWidth = Math.round((y.totalUnits / maxUnits) * 100)
                            const colors = [
                                { bar: 'bg-gradient-to-r from-red-400 to-red-600', text: 'text-red-600', light: 'bg-red-50' },
                                { bar: 'bg-gradient-to-r from-blue-400 to-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
                                { bar: 'bg-gradient-to-r from-purple-400 to-purple-600', text: 'text-purple-600', light: 'bg-purple-50' },
                                { bar: 'bg-gradient-to-r from-amber-400 to-amber-600', text: 'text-amber-600', light: 'bg-amber-50' },
                            ]
                            const c = colors[i % colors.length]
                            return (
                                <div key={y.academicYear} className="flex items-center gap-4">
                                    {/* Year label */}
                                    <span className={`text-sm font-bold ${c.text} w-20 shrink-0 text-right`}>
                                        {y.academicYear}
                                    </span>
                                    {/* Bar */}
                                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                                        <div
                                            className={`h-5 rounded-full ${c.bar} transition-all duration-700 shadow-sm`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

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
