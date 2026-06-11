'use client'

import { useEffect, useState } from 'react'
import { Users, Clock, Droplet, Home } from 'lucide-react'
import { getStats, subscribeToStats, ImpactStats } from '@/lib/statsService'
import { getBloodDonationYearRecords } from '@/lib/bloodDonationYearService'

export default function ImpactCounter() {
    const [stats, setStats] = useState<ImpactStats | null>(null)
    const [displayStats, setDisplayStats] = useState({
        volunteersEnrolled: 0,
        hoursOfService: 0,
        bloodUnitsDonated: 0,
        villagesAdopted: 0,
    })

    useEffect(() => {
        // Load initial stats (async)
        const loadStats = async () => {
            const initialStats = await getStats()
            const records = await getBloodDonationYearRecords()
            const totalBloodUnits = records.reduce((sum, r) => sum + r.unitsDonated, 0)
            setStats({ ...initialStats, bloodUnitsDonated: totalBloodUnits })
        }
        loadStats()

        // Subscribe to stats changes
        const unsubscribe = subscribeToStats(async () => {
            const newStats = await getStats()
            const records = await getBloodDonationYearRecords()
            const totalBloodUnits = records.reduce((sum, r) => sum + r.unitsDonated, 0)
            setStats({ ...newStats, bloodUnitsDonated: totalBloodUnits })
        })

        return unsubscribe
    }, [])

    useEffect(() => {
        if (!stats) return

        // Animate counters
        const duration = 2000 // 2 seconds
        const steps = 60
        const stepDuration = duration / steps

        let currentStep = 0

        const interval = setInterval(() => {
            currentStep++
            const progress = currentStep / steps

            setDisplayStats({
                volunteersEnrolled: Math.floor(stats.volunteersEnrolled * progress),
                hoursOfService: Math.floor(stats.hoursOfService * progress),
                bloodUnitsDonated: Math.floor(stats.bloodUnitsDonated * progress),
                villagesAdopted: Math.floor(stats.villagesAdopted * progress),
            })

            if (currentStep >= steps) {
                clearInterval(interval)
                setDisplayStats({
                    volunteersEnrolled: stats.volunteersEnrolled,
                    hoursOfService: stats.hoursOfService,
                    bloodUnitsDonated: stats.bloodUnitsDonated,
                    villagesAdopted: stats.villagesAdopted,
                })
            }
        }, stepDuration)

        return () => clearInterval(interval)
    }, [stats])

    const statsData = [
        { label: 'Volunteers Enrolled', value: displayStats.volunteersEnrolled, icon: Users, iconBg: 'bg-blue-600', iconColor: 'text-white', border: 'border-t-4 border-blue-600', valueColor: 'text-blue-600' },
        { label: 'Hours of Service', value: displayStats.hoursOfService, icon: Clock, iconBg: 'bg-amber-500', iconColor: 'text-white', border: 'border-t-4 border-amber-500', valueColor: 'text-amber-500' },
        { label: 'Blood Units Donated', value: displayStats.bloodUnitsDonated, icon: Droplet, iconBg: 'bg-red-600', iconColor: 'text-white', border: 'border-t-4 border-red-600', valueColor: 'text-red-600' },
        { label: 'Villages Adopted', value: displayStats.villagesAdopted, icon: Home, iconBg: 'bg-green-600', iconColor: 'text-white', border: 'border-t-4 border-green-600', valueColor: 'text-green-600' },
    ]

    return (
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-nss-blue mb-12">
                    Our Impact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsData.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up ${stat.border}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-center mb-4">
                                    <div className={`w-16 h-16 ${stat.iconBg} rounded-full flex items-center justify-center shadow-md`}>
                                        <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                                    </div>
                                </div>
                                <span className={`text-4xl md:text-5xl font-bold ${stat.valueColor}`}>
                                    {stat.value.toLocaleString()}
                                </span>
                                <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
