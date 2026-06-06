import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export function getTimeSince(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    }

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit)
        if (interval >= 1) {
            return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
        }
    }

    return 'Just now'
}

export function canCallDonor(lastCalledAt: Date | string | null | undefined): boolean {
    if (!lastCalledAt) return true

    const lastCall = typeof lastCalledAt === 'string' ? new Date(lastCalledAt) : lastCalledAt
    const now = new Date()
    const hoursSinceCall = (now.getTime() - lastCall.getTime()) / (1000 * 60 * 60)

    // 24-hour cooldown period
    return hoursSinceCall >= 24
}

export function getDonorStatus(
    lastCalledAt: Date | string | null | undefined,
    lastDonatedAt: Date | string | null | undefined
): 'ready' | 'called' | 'donated' {
    // Check if donated recently (within 90 days)
    if (lastDonatedAt) {
        const donatedDate = typeof lastDonatedAt === 'string' ? new Date(lastDonatedAt) : lastDonatedAt
        const daysSinceDonation = (new Date().getTime() - donatedDate.getTime()) / (1000 * 60 * 60 * 24)
        if (daysSinceDonation < 90) return 'donated'
    }

    // Check if called recently (within 24 hours)
    if (!canCallDonor(lastCalledAt)) return 'called'

    return 'ready'
}
