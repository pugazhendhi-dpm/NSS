'use client'

import { useEffect, useState } from 'react'
import { Users, Clock, Droplet, Home } from 'lucide-react'
import { getStats, subscribeToStats, ImpactStats } from '@/lib/statsService'

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
            setStats(initialStats)
        }
        loadStats()

        // Subscribe to stats changes
        const unsubscribe = subscribeToStats(async () => {
            const newStats = await getStats()
            setStats(newStats)
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
        { label: 'Volunteers Enrolled', value: displayStats.volunteersEnrolled, icon: Users },
        { label: 'Hours of Service', value: displayStats.hoursOfService, icon: Clock },
        { label: 'Blood Units Donated', value: displayStats.bloodUnitsDonated, icon: Droplet },
        { label: 'Villages Adopted', value: displayStats.villagesAdopted, icon: Home },
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
                                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 animate-slide-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 bg-nss-blue rounded-full flex items-center justify-center">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <span className="text-4xl md:text-5xl font-bold text-nss-red">
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
