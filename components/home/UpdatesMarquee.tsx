'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { getUpdates, subscribeToUpdates, Update } from '@/lib/updatesService'

export default function UpdatesMarquee() {
    const [updates, setUpdates] = useState<Update[]>([])

    useEffect(() => {
        // Load initial updates (async)
        const loadUpdates = async () => {
            const data = await getUpdates()
            setUpdates(data)
        }
        loadUpdates()

        // Subscribe to updates changes
        const unsubscribe = subscribeToUpdates(async () => {
            const data = await getUpdates()
            setUpdates(data)
        })

        return unsubscribe
    }, [])

    if (updates.length === 0) {
        return null
    }

    return (
        <div className="bg-yellow-50 border-y border-yellow-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 animate-pulse" />
                    <div className="overflow-hidden flex-1">
                        <div className="animate-marquee whitespace-nowrap">
                            {updates.map((update, index) => (
                                <span key={update.id} className="text-yellow-900 font-medium">
                                    {update.content}
                                    {index < updates.length - 1 && <span className="mx-8 text-yellow-600">•</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
