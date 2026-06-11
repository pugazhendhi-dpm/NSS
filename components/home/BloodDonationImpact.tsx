'use client'

import { useEffect, useState } from 'react'
import { Droplet, Users } from 'lucide-react'
import { getBloodDonationYearRecords, groupByYear, YearSummary } from '@/lib/bloodDonationYearService'

export default function BloodDonationImpact() {
    const [showAll, setShowAll] = useState(false)
    const [allYearSummaries, setAllYearSummaries] = useState<YearSummary[]>([])
    const [yearSummaries, setYearSummaries] = useState<YearSummary[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        const records = await getBloodDonationYearRecords()
        const grouped = groupByYear(records)
        setAllYearSummaries(grouped)
        // Keep only the past 4 years for the cards
        setYearSummaries(grouped.slice(0, 4))
        setLoading(false)
    }

    const totalUnits = allYearSummaries.reduce((s, y) => s + y.totalUnits, 0)
    const totalDonors = allYearSummaries.reduce((s, y) => s + y.totalDonors, 0)

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Droplet className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-blue-600 mb-2">{totalUnits}</div>
                        <div className="text-gray-600 font-semibold">Total Units Donated</div>
                        <div className="text-xs text-gray-500 mt-1">Blood units donated</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-5xl font-bold text-green-600 mb-2">{totalDonors}</div>
                        <div className="text-gray-600 font-semibold">Total Donors Donated</div>
                        <div className="text-xs text-gray-500 mt-1">Generous volunteers</div>
                    </div>
                </div>

                {/* Year-wise Cards */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        Year-wise Blood Donation Records
                    </h3>
                    <p className="text-gray-500 text-sm text-center mb-8">
                        {showAll ? `All ${allYearSummaries.length} academic years` : `Last ${yearSummaries.length} academic years`}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {(showAll ? allYearSummaries : yearSummaries)
                            .slice()
                            .reverse()
                            .map((y, i) => {
                                const styles = [
                                    { bg: 'bg-gradient-to-br from-amber-50 to-amber-100', border: 'border-amber-400', num: 'text-amber-600', year: 'text-amber-700', icon: '🟠' },
                                    { bg: 'bg-gradient-to-br from-purple-50 to-purple-100', border: 'border-purple-400', num: 'text-purple-600', year: 'text-purple-700', icon: '🟣' },
                                    { bg: 'bg-gradient-to-br from-blue-50 to-blue-100', border: 'border-blue-400', num: 'text-blue-600', year: 'text-blue-700', icon: '🔵' },
                                    { bg: 'bg-gradient-to-br from-red-50 to-red-100', border: 'border-red-400', num: 'text-red-600', year: 'text-red-700', icon: '🔴' },
                                ]
                                const s = styles[i % styles.length]
                                return (
                                    <div key={y.academicYear} className={`${s.bg} border-2 ${s.border} rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300`}>
                                        <p className={`text-sm font-bold ${s.year} mb-3 tracking-wide`}>
                                            {y.academicYear}
                                        </p>
                                        <p className={`text-5xl font-extrabold ${s.num} mb-1`}>
                                            {y.totalUnits}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium mt-2">units donated</p>
                                    </div>
                                )
                            })}
                    </div>

                    {allYearSummaries.length > 4 && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full transition-colors"
                            >
                                {showAll ? 'Show Less ▲' : 'View Full History ▼'}
                            </button>
                        </div>
                    )}
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
