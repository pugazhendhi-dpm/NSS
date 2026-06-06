'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Calendar, Target, MapPin, Users, Droplet, TrendingUp } from 'lucide-react'
import { getCampaignStats, CampaignStats } from '@/lib/campaignService'

export default function CampaignDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const campaignId = params.id as string

    const [campaign, setCampaign] = useState<CampaignStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCampaign()
    }, [])

    const loadCampaign = async () => {
        const campaigns = await getCampaignStats()
        const found = campaigns.find(c => c.campaignId === campaignId)
        setCampaign(found || null)
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading campaign...</p>
                </div>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Campaign not found</p>
                    <button onClick={() => router.back()} className="mt-4 btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">{campaign.campaignName}</h1>
                            <p className="text-red-100">Campaign Details</p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <Target className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Goal</p>
                                <p className="text-xl font-bold text-blue-600">{campaign.goalUnits} units</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <Droplet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Collected</p>
                                <p className="text-xl font-bold text-green-600">{campaign.unitsCollected} units</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Progress</p>
                                <p className="text-xl font-bold text-purple-600">{campaign.progressPercentage}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                    <div className="w-full bg-gray-200 rounded-full h-6">
                        <div
                            className={`h-6 rounded-full flex items-center justify-center text-white text-sm font-semibold ${campaign.progressPercentage >= 100 ? 'bg-green-500' :
                                    campaign.progressPercentage >= 75 ? 'bg-blue-500' :
                                        campaign.progressPercentage >= 50 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                }`}
                            style={{ width: `${Math.min(campaign.progressPercentage, 100)}%` }}
                        >
                            {campaign.progressPercentage}%
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-semibold">{campaign.startDate.toLocaleDateString()} - {campaign.endDate.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <Users className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Participants</p>
                                <p className="font-semibold">{campaign.uniqueDonors} unique donors • {campaign.totalDonations} donations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-4">
                    <button
                        onClick={() => router.push(`/dashboard/campaigns/${campaignId}/record`)}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Droplet className="w-4 h-4" />
                        <span>Record Donation</span>
                    </button>
                    <button
                        onClick={() => router.push(`/dashboard/campaigns/${campaignId}/edit`)}
                        className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
                    >
                        Edit Campaign
                    </button>
                </div>
            </div>
        </div>
    )
}
