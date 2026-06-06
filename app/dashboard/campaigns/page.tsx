'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, Target, TrendingUp, Users, Droplet, Award } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { getCampaignStats, getImpactStats, CampaignStats } from '@/lib/campaignService'
import FeedbackSection from '@/components/FeedbackSection'

export default function CampaignsPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [campaigns, setCampaigns] = useState<CampaignStats[]>([])
    const [impactStats, setImpactStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
            loadData()
        }
    }, [router])

    const loadData = async () => {
        setLoading(true)
        const [campaignData, impact] = await Promise.all([
            getCampaignStats(),
            getImpactStats()
        ])
        setCampaigns(campaignData)
        setImpactStats(impact)
        setLoading(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'upcoming': return 'bg-blue-100 text-blue-800'
            case 'completed': return 'bg-gray-100 text-gray-800'
            default: return 'bg-red-100 text-red-800'
        }
    }

    if (!volunteer) return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Blood Donation Campaigns</h1>
                            <p className="text-red-100">Manage drives, track donations, save lives</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Impact Stats */}
                {impactStats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Lives Saved</p>
                                    <p className="text-4xl font-bold mt-1">{impactStats.livesSaved}</p>
                                </div>
                                <Award className="w-12 h-12 opacity-50" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Droplet className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Total Units</p>
                                    <p className="text-2xl font-bold text-blue-600">{impactStats.totalUnits}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Donations</p>
                                    <p className="text-2xl font-bold text-green-600">{impactStats.totalDonations}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Campaigns List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">All Campaigns</h2>
                            <p className="text-sm text-gray-600 mt-1">Track and manage blood donation drives</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/campaigns/create')}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Campaign</span>
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading campaigns...</p>
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="p-12 text-center">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">No campaigns yet. Create your first campaign!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {campaigns.map((campaign) => (
                                <div key={campaign.campaignId} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{campaign.campaignName}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                                                    {campaign.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Target className="w-4 h-4" />
                                                    <span>Goal: {campaign.goalUnits} units</span>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mb-3">
                                                <div className="flex items-center justify-between text-sm mb-1">
                                                    <span className="text-gray-600">Progress</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {campaign.unitsCollected} / {campaign.goalUnits} units ({campaign.progressPercentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className={`h-3 rounded-full ${campaign.progressPercentage >= 100 ? 'bg-green-500' :
                                                            campaign.progressPercentage >= 75 ? 'bg-blue-500' :
                                                                campaign.progressPercentage >= 50 ? 'bg-yellow-500' :
                                                                    'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center space-x-6 text-sm mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-600">{campaign.uniqueDonors} donors</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Droplet className="w-4 h-4 text-red-400" />
                                                    <span className="text-gray-600">{campaign.totalDonations} donations</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => router.push(`/dashboard/campaigns/${campaign.campaignId}/record`)}
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2"
                                                >
                                                    <Droplet className="w-4 h-4" />
                                                    <span>Record Donation</span>
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/campaigns/${campaign.campaignId}`)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/dashboard/campaigns/${campaign.campaignId}/edit`)}
                                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-semibold transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Feedback Section */}
                <div className="mt-8">
                    <FeedbackSection />
                </div>
            </div>
        </div>
    )
}
