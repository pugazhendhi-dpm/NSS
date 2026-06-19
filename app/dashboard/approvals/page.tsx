'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, User, Mail, Phone, BookOpen, Calendar } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { getPendingVolunteers, approveVolunteer, rejectVolunteer, subscribeToVolunteers } from '@/lib/volunteersService'

export default function ApprovalsPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<any>(null)
    const [pendingVolunteers, setPendingVolunteers] = useState<Volunteer[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
            loadPendingVolunteers()
        }

        // Subscribe to real-time updates
        const unsubscribe = subscribeToVolunteers(() => {
            loadPendingVolunteers()
        })

        return unsubscribe
    }, [router])

    const loadPendingVolunteers = async () => {
        setLoading(true)
        const data = await getPendingVolunteers()
        setPendingVolunteers(data)
        setLoading(false)
    }

    const showSuccess = (message: string) => {
        setSuccessMessage(message)
        setTimeout(() => setSuccessMessage(null), 3000)
    }

    const handleApprove = async (id: string) => {
        setProcessingId(id)
        const success = await approveVolunteer(id)

        if (success) {
            setPendingVolunteers(prev => prev.filter(v => v.id !== id))
            showSuccess('Volunteer approved successfully!')
            await loadPendingVolunteers()
        } else {
            alert('Failed to approve volunteer. Please try again.')
        }
        setProcessingId(null)
    }

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this volunteer enrollment?')) {
            return
        }

        console.log('Rejecting volunteer with ID:', id)
        setProcessingId(id)
        const success = await rejectVolunteer(id)

        if (success) {
            setPendingVolunteers(prev => prev.filter(v => v.id !== id))
            showSuccess('Volunteer enrollment rejected.')
            await loadPendingVolunteers()
        } else {
            alert('Failed to reject volunteer. Please try again.')
        }
        setProcessingId(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading pending approvals...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Pending Approvals</h1>
                            <p className="text-gray-200">Review and approve new volunteer enrollments</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md animate-fade-in">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <p className="text-green-700 font-semibold">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Stats */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-nss-blue" />
                        <h2 className="text-lg font-semibold text-nss-blue">
                            {pendingVolunteers.length} Pending {pendingVolunteers.length === 1 ? 'Enrollment' : 'Enrollments'}
                        </h2>
                    </div>
                </div>

                {/* Pending Volunteers List */}
                {pendingVolunteers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-600">There are no pending volunteer enrollments to review.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingVolunteers.map((vol) => (
                            <div key={vol.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <div className="w-12 h-12 bg-nss-blue rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{vol.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Enrolled {new Date(vol.createdAt).toLocaleDateString('en-IN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{vol.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{vol.rollNumber}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{vol.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <BookOpen className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{vol.department}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-gray-700">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{vol.year} Year</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-2 ml-4">
                                        <button
                                            onClick={() => handleApprove(vol.id)}
                                            disabled={processingId === vol.id}
                                            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{processingId === vol.id ? 'Processing...' : 'Approve'}</span>
                                        </button>
                                        <button
                                            onClick={() => handleReject(vol.id)}
                                            disabled={processingId === vol.id}
                                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            <span>{processingId === vol.id ? 'Processing...' : 'Reject'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
