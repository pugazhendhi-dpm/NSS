import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Volunteer Login - NSS',
    description: 'Login to NSS Volunteer Dashboard',
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
