import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'NSS KEC - National Service Scheme | Not Me But You',
    description: 'Official website of the National Service Scheme (NSS) Unit. Join us in community service, blood donation drives, and social work. Motto: Not Me But You.',
    keywords: ['NSS', 'National Service Scheme', 'Community Service', 'Volunteering', 'Blood Donation', 'Social Work', 'Student Volunteers', 'Gandhi', 'Not Me But You'],
    authors: [{ name: 'NSS KEC' }],
    openGraph: {
        title: 'NSS KEC - Not Me But You',
        description: 'Join the National Service Scheme and serve society through community work and blood donation.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    )
}

