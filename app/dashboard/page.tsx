'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Droplet, Phone, LogOut, UserCheck, Shield, Calendar, BarChart, Megaphone, Activity, Image, ClipboardCheck, BookOpen } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import FeedbackSection from '@/components/FeedbackSection'
import { hasPermission, getRoleName, getRoleBadgeColor, PERMISSIONS } from '@/lib/permissions'

function PendingBadge() {
    const [count, setCount] = useState<number>(0)

    useEffect(() => {
        supabase
            .from('volunteers')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending')
            .then(({ count }) => setCount(count || 0))
    }, [])

    if (count === 0) return null
    return (
        <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-500 text-white text-sm font-bold rounded-full animate-pulse">
            {count}
        </span>
    )
}

export default function DashboardPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [stats, setStats] = useState({
        totalDonors: 0,
        availableNow: 0,
        calledToday: 0,
    })

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
            loadStats()
        }
    }, [router])

    const loadStats = async () => {
        try {
            // Total donors
            const { count: totalCount } = await supabase
                .from('blood_donors')
                .select('*', { count: 'exact', head: true })

            // Available now (eligible donors - no donation in last 90 days)
            const ninetyDaysAgo = new Date()
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

            const { data: eligibleDonors } = await supabase
                .from('blood_donors')
                .select('id, last_donation_date')
                .or(`last_donation_date.is.null,last_donation_date.lt.${ninetyDaysAgo.toISOString()}`)

            // Called today - you can track this in a separate table later
            // For now, using 0 as placeholder
            const calledToday = 0

            setStats({
                totalDonors: totalCount || 0,
                availableNow: eligibleDonors?.length || 0,
                calledToday,
            })
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    const handleLogout = () => {
        sessionStorage.removeItem('volunteer')
        router.push('/')
    }

    if (!volunteer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Header */}
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">Blood Command Center</h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getRoleBadgeColor(volunteer.role)}`}>
                                    <Shield className="w-3 h-3 mr-1.5 flex-shrink-0" />
                                    {getRoleName(volunteer.role)}
                                </span>
                            </div>
                            <p className="text-gray-200">Welcome, {volunteer.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-lg p-6 mb-8 border-l-4 border-nss-blue">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-16 h-16 bg-nss-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {volunteer.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{volunteer.name}</h2>
                                    <p className="text-gray-600">{volunteer.email}</p>
                                </div>
                            </div>


                        </div>

                        <button
                            onClick={handleLogout}
                            className="ml-4 inline-flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-nss-blue rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Total Donors</p>
                                <p className="text-2xl font-bold text-nss-blue">{stats.totalDonors}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                <Droplet className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Available Now</p>
                                <p className="text-2xl font-bold text-green-600">{stats.availableNow}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-nss-red rounded-lg flex items-center justify-center">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm">Called Today</p>
                                <p className="text-2xl font-bold text-nss-red">{stats.calledToday}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Blood Donors - Accessible to all */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-nss-blue mb-4">Donor Management</h2>
                        <p className="text-gray-600 mb-6">
                            Access the donor database to find and contact blood donors during emergencies.
                        </p>
                        <Link
                            href="/dashboard/blood-donors"
                            className="inline-flex items-center space-x-2 bg-nss-red hover:bg-nss-red-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Droplet className="w-5 h-5" />
                            <span>View Donors</span>
                        </Link>
                    </div>

                    {/* Attendance - Admin & Supersenior only */}
                    {hasPermission(volunteer.role, 'VIEW_ALL_ATTENDANCE') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Attendance</h2>
                            <p className="text-gray-600 mb-6">
                                Mark attendance for NSS activities and events. Track volunteer participation.
                            </p>
                            <Link
                                href="/dashboard/attendance"
                                className="inline-flex items-center space-x-2 bg-nss-blue hover:bg-nss-blue-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Mark Attendance</span>
                            </Link>
                        </div>
                    )}

                    {/* Volunteer Stats - Admin & Supersenior only */}
                    {hasPermission(volunteer.role, 'VIEW_ALL_VOLUNTEERS') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Volunteer Statistics</h2>
                            <p className="text-gray-600 mb-6">
                                View individual volunteer attendance rates, performance metrics, and detailed records.
                            </p>
                            <Link
                                href="/dashboard/volunteer-stats"
                                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <BarChart className="w-5 h-5" />
                                <span>View Statistics</span>
                            </Link>
                        </div>
                    )}

                    {/* Approve Volunteers - Admin & Supersenior */}
                    {hasPermission(volunteer.role, 'APPROVE_VOLUNTEERS') && (
                        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-amber-500">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-nss-blue">Approve Volunteers</h2>
                                <PendingBadge />
                            </div>
                            <p className="text-gray-600 mb-6">
                                Review and approve new volunteer enrollment requests submitted through the join form.
                            </p>
                            <Link
                                href="/dashboard/approvals"
                                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <ClipboardCheck className="w-5 h-5" />
                                <span>Review Approvals</span>
                            </Link>
                        </div>
                    )}

                    {/* Updates - Admin only */}
                    {hasPermission(volunteer.role, 'MANAGE_ACTIVITIES') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Updates</h2>
                            <p className="text-gray-600 mb-6">
                                Add, edit, or remove announcements that appear on the home page marquee.
                            </p>
                            <Link
                                href="/dashboard/updates"
                                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Megaphone className="w-5 h-5" />
                                <span>Manage Updates</span>
                            </Link>
                        </div>
                    )}

                    {/* Statistics - Admin only */}
                    {hasPermission(volunteer.role, 'EDIT_STATISTICS') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Statistics</h2>
                            <p className="text-gray-600 mb-6">
                                Update impact counter numbers displayed on the home page.
                            </p>
                            <Link
                                href="/dashboard/statistics"
                                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <BarChart className="w-5 h-5" />
                                <span>Manage Statistics</span>
                            </Link>
                        </div>
                    )}

                    {/* Activities - Admin only */}
                    {hasPermission(volunteer.role, 'MANAGE_ACTIVITIES') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Activities</h2>
                            <p className="text-gray-600 mb-6">
                                Add and manage NSS activities displayed on the activities page.
                            </p>
                            <Link
                                href="/dashboard/manage-activities"
                                className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Activity className="w-5 h-5" />
                                <span>Manage Activities</span>
                            </Link>
                        </div>
                    )}

                    {/* Gallery - Admin only */}
                    {hasPermission(volunteer.role, 'MANAGE_GALLERY') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Gallery</h2>
                            <p className="text-gray-600 mb-6">
                                Upload and manage photos displayed in the gallery page.
                            </p>
                            <Link
                                href="/dashboard/manage-gallery"
                                className="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Image className="w-5 h-5" />
                                <span>Manage Gallery</span>
                            </Link>
                        </div>
                    )}

                    {/* Home Slider - Admin only */}
                    {hasPermission(volunteer.role, 'MANAGE_SLIDER') && (
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Home Slider</h2>
                            <p className="text-gray-600 mb-6">
                                Update the event highlight images and text on the Home Page.
                            </p>
                            <Link
                                href="/dashboard/manage-slider"
                                className="inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Image className="w-5 h-5" />
                                <span>Manage Slider</span>
                            </Link>
                        </div>
                    )}

                    {/* Blood Donation Records - Admin & Supersenior */}
                    {hasPermission(volunteer.role, 'VIEW_CAMPAIGNS') && (
                        <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Blood Donation Records</h2>
                            <p className="text-gray-600 mb-6">
                                Track and manage blood donation data year-wise. View units donated, donors count and lives saved each academic year.
                            </p>
                            <Link
                                href="/dashboard/blood-year"
                                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <Droplet className="w-5 h-5" />
                                <span>View by Year</span>
                            </Link>
                        </div>
                    )}
                </div>
                {/* Instructions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border-l-4 border-nss-blue p-6 rounded">
                        <h3 className="font-semibold text-nss-blue mb-2">How It Works</h3>
                        <ul className="text-gray-700 space-y-2 text-sm">
                            <li>• Filter donors by blood group and department</li>
                            <li>• Click "Call" to initiate phone call</li>
                            <li>• System locks donor for 24 hours automatically</li>
                            <li>• Other volunteers see who called and when</li>
                        </ul>
                    </div>

                    <div className="bg-red-50 border-l-4 border-nss-red p-6 rounded">
                        <h3 className="font-semibold text-nss-red mb-2">Important Notes</h3>
                        <ul className="text-gray-700 space-y-2 text-sm">
                            <li>• Only call donors marked as "Ready"</li>
                            <li>• Respect the 90-day donation cooldown</li>
                            <li>• Update call results after each contact</li>
                            <li>• Be polite and professional always</li>
                        </ul>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-8">
                    <FeedbackSection />
                </div>
            </div>
        </div>
    )
}
