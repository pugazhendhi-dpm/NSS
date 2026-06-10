'use client'

import { useEffect, useState } from 'react'
import { Calendar, Users, MapPin, ChevronDown } from 'lucide-react'
import { getActivities, subscribeToActivities, Activity } from '@/lib/activitiesService'

type ActivityType = 'all' | 'Regular Activities' | 'Special Camps'

// Helper function to get academic year from date
function getAcademicYear(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 0-indexed

    // Academic year starts in June (month 6)
    if (month >= 6) {
        return `${year}-${year + 1}`
    } else {
        return `${year - 1}-${year}`
    }
}

export default function ActivitiesPage() {
    const [filter, setFilter] = useState<ActivityType>('all')
    const [activities, setActivities] = useState<Activity[]>([])
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [expandedYear, setExpandedYear] = useState<string | null>(null)

    useEffect(() => {
        // Load activities (async)
        const loadActivities = async () => {
            const loadedActivities = await getActivities()
            setActivities(loadedActivities)

            // Auto-expand the most recent year
            if (loadedActivities.length > 0) {
                const years = groupActivitiesByYear(loadedActivities)
                const latestYear = Object.keys(years).sort().reverse()[0]
                setExpandedYear(latestYear)
            }
        }
        loadActivities()

        // Subscribe to changes
        const unsubscribe = subscribeToActivities(async () => {
            const newActivities = await getActivities()
            setActivities(newActivities)
        })

        return unsubscribe
    }, [])

    const filteredActivities = activities.filter(
        (activity) => filter === 'all' || activity.category === filter
    )

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    const toggleYear = (year: string) => {
        setExpandedYear(expandedYear === year ? null : year)
    }

    // Group activities by academic year
    const groupActivitiesByYear = (activities: Activity[]) => {
        const grouped: { [key: string]: Activity[] } = {}

        activities.forEach((activity) => {
            const year = getAcademicYear(activity.date)
            if (!grouped[year]) {
                grouped[year] = []
            }
            grouped[year].push(activity)
        })

        // Sort activities within each year by date (newest first)
        Object.keys(grouped).forEach((year) => {
            grouped[year].sort((a, b) => b.date.getTime() - a.date.getTime())
        })

        return grouped
    }

    const groupedActivities = groupActivitiesByYear(filteredActivities)
    const sortedYears = Object.keys(groupedActivities).sort().reverse() // Newest year first

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Activities</h1>
                    <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                        Transforming communities through dedicated service and action
                    </p>
                </div>
            </section>

            {/* Filter Tabs */}
            <section className="bg-gray-50 py-8 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${filter === 'all'
                                ? 'bg-nss-blue text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            All Activities
                        </button>
                        <button
                            onClick={() => setFilter('Regular Activities')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${filter === 'Regular Activities'
                                ? 'bg-nss-blue text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Sustainable Initiatives
                        </button>
                        <button
                            onClick={() => setFilter('Special Camps')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${filter === 'Special Camps'
                                ? 'bg-nss-blue text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            Special Camps (7 Days)
                        </button>
                    </div>
                </div>
            </section>

            {/* Activities by Year */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {sortedYears.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No activities found. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {sortedYears.map((year) => {
                                const yearActivities = groupedActivities[year]
                                const isYearExpanded = expandedYear === year

                                return (
                                    <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Year Header */}
                                        <button
                                            onClick={() => toggleYear(year)}
                                            className="w-full bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white px-6 py-4 flex items-center justify-between hover:from-nss-blue-dark hover:to-nss-blue transition-all"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-6 h-6" />
                                                <h2 className="text-2xl font-bold">Academic Year {year}</h2>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                                    {yearActivities.length} {yearActivities.length === 1 ? 'Activity' : 'Activities'}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`w-6 h-6 transition-transform duration-300 ${isYearExpanded ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Year Activities */}
                                        {isYearExpanded && (
                                            <div className="p-6 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {yearActivities.map((activity) => {
                                                        const isExpanded = expandedId === activity.id
                                                        return (
                                                            <div
                                                                key={activity.id}
                                                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                                                                onClick={() => toggleExpand(activity.id)}
                                                            >
                                                                {activity.imageUrl && (
                                                                    <div className="relative h-48 overflow-hidden">
                                                                        <img
                                                                            src={activity.imageUrl}
                                                                            alt={activity.title}
                                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                        />
                                                                        <div className="absolute top-4 right-4">
                                                                            <span
                                                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.category === 'Special Camps'
                                                                                    ? 'bg-nss-red text-white'
                                                                                    : 'bg-nss-blue text-white'
                                                                                    }`}
                                                                            >
                                                                                {activity.category}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                <div className="p-6">
                                                                    <h3 className="text-xl font-bold text-nss-blue mb-2">{activity.title}</h3>
                                                                    <p
                                                                        className={`text-gray-600 mb-4 transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'
                                                                            }`}
                                                                    >
                                                                        {activity.description}
                                                                    </p>
                                                                    <div className="space-y-2 text-sm text-gray-500">
                                                                        <div className="flex items-center space-x-2">
                                                                            <Calendar className="w-4 h-4 text-nss-red" />
                                                                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <MapPin className="w-4 h-4 text-nss-red" />
                                                                            <span>{activity.location}</span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <Users className="w-4 h-4 text-nss-red" />
                                                                            <span>{activity.participants} Volunteers</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                                                        <button className="text-nss-blue hover:text-nss-blue-dark font-semibold text-sm flex items-center space-x-1">
                                                                            <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                                                                            <svg
                                                                                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                                                                                    }`}
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={2}
                                                                                    d="M19 9l-7 7-7-7"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                        
                                                                        {activity.documentUrl && (
                                                                            <a
                                                                                href={activity.documentUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                                className="inline-flex items-center space-x-1.5 text-sm font-semibold bg-nss-blue text-white px-4 py-1.5 rounded-md hover:bg-nss-blue-dark hover:shadow-md transition-all duration-300"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                                <span>View Report</span>
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Info Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-nss-blue mb-6">Activity Requirements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border-l-4 border-nss-blue pl-4">
                                <h3 className="text-lg font-semibold text-nss-blue mb-2">Regular Activities</h3>
                                <p className="text-gray-700">
                                    Each NSS volunteer must complete <strong>120 hours</strong> of regular community
                                    service activities throughout the academic year. These include blood donation drives,
                                    tree plantation, literacy programs, and health camps.
                                </p>
                            </div>
                            <div className="border-l-4 border-nss-red pl-4">
                                <h3 className="text-lg font-semibold text-nss-red mb-2">Special Camping</h3>
                                <p className="text-gray-700">
                                    In addition to regular activities, volunteers participate in one <strong>7-day
                                        residential special camp</strong> annually. These intensive camps focus on rural
                                    development and community immersion.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
