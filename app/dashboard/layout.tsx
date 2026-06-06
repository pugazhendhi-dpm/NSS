import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard - NSS Blood Command Center',
    description: 'Volunteer dashboard for managing blood donors and NSS activities',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
