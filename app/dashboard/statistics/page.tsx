'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Users, Clock, Droplet, Home, Save, RotateCcw } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { getStats, updateStats, ImpactStats } from '@/lib/statsService'
import { getBloodDonationYearRecords } from '@/lib/bloodDonationYearService'

export default function StatisticsManagementPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [stats, setStats] = useState<ImpactStats | null>(null)
    const [formData, setFormData] = useState({
        volunteersEnrolled: 0,
        hoursOfService: 0,
        bloodUnitsDonated: 0,
        villagesAdopted: 0,
    })
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
        }

        // Load current stats (async)
        const loadStats = async () => {
            const currentStats = await getStats()
            const records = await getBloodDonationYearRecords()
            const totalBloodUnits = records.reduce((sum, r) => sum + r.unitsDonated, 0)
            
            setStats({ ...currentStats, bloodUnitsDonated: totalBloodUnits })
            setFormData({
                volunteersEnrolled: currentStats.volunteersEnrolled,
                hoursOfService: currentStats.hoursOfService,
                bloodUnitsDonated: totalBloodUnits,
                villagesAdopted: currentStats.villagesAdopted,
            })
        }
        loadStats()
    }, [router])

    const handleChange = (field: keyof typeof formData, value: string) => {
        const numValue = parseInt(value) || 0
        setFormData({
            ...formData,
            [field]: numValue,
        })
    }

    const handleSave = async () => {
        if (!volunteer) return

        const success = await updateStats(
            formData.volunteersEnrolled,
            formData.hoursOfService,
            formData.bloodUnitsDonated,
            formData.villagesAdopted,
            volunteer.name
        )

        if (success) {
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)

            // Reload stats
            const updatedStats = await getStats()
            setStats(updatedStats)
        }
    }

    const handleReset = () => {
        if (stats) {
            setFormData({
                volunteersEnrolled: stats.volunteersEnrolled,
                hoursOfService: stats.hoursOfService,
                bloodUnitsDonated: stats.bloodUnitsDonated,
                villagesAdopted: stats.villagesAdopted,
            })
        }
    }

    if (!volunteer || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    const hasChanges =
        formData.volunteersEnrolled !== stats.volunteersEnrolled ||
        formData.hoursOfService !== stats.hoursOfService ||
        formData.bloodUnitsDonated !== stats.bloodUnitsDonated ||
        formData.villagesAdopted !== stats.villagesAdopted

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Statistics Management</h1>
                            <p className="text-gray-200">Update impact counter numbers on the home page</p>
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info Card */}
                <div className="bg-blue-50 border-l-4 border-nss-blue p-6 rounded mb-6">
                    <div className="flex items-start space-x-3">
                        <TrendingUp className="w-6 h-6 text-nss-blue mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-nss-blue mb-2">About Statistics</h3>
                            <p className="text-gray-700 text-sm">
                                These numbers appear in the "Our Impact" section on the home page. Update them regularly
                                to reflect the latest achievements of the NSS KEC.
                            </p>
                            <p className="text-gray-600 text-xs mt-2">
                                Last updated by <strong>{stats.lastUpdatedBy}</strong> on{' '}
                                {new Date(stats.lastUpdated).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Form */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-xl font-bold text-nss-blue mb-6">Update Impact Statistics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Volunteers Enrolled */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-nss-blue" />
                                    <span>Volunteers Enrolled</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.volunteersEnrolled}
                                onChange={(e) => handleChange('volunteersEnrolled', e.target.value)}
                                className="input-field text-2xl font-bold"
                                min="0"
                            />
                        </div>

                        {/* Hours of Service */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-nss-blue" />
                                    <span>Hours of Service</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.hoursOfService}
                                onChange={(e) => handleChange('hoursOfService', e.target.value)}
                                className="input-field text-2xl font-bold"
                                min="0"
                            />
                        </div>

                        {/* Blood Units Donated (Read-only) */}
                        <div className="opacity-75">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Droplet className="w-5 h-5 text-nss-red" />
                                        <span>Blood Units Donated</span>
                                    </div>
                                    <span className="text-xs text-nss-red bg-red-50 px-2 py-1 rounded">Auto-calculated</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.bloodUnitsDonated}
                                readOnly
                                disabled
                                className="input-field text-2xl font-bold bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                This value is automatically calculated from the Blood Donation Records.
                            </p>
                        </div>

                        {/* Villages Adopted */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Home className="w-5 h-5 text-nss-blue" />
                                    <span>Villages Adopted</span>
                                </div>
                            </label>
                            <input
                                type="number"
                                value={formData.villagesAdopted}
                                onChange={(e) => handleChange('villagesAdopted', e.target.value)}
                                className="input-field text-2xl font-bold"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RotateCcw className="w-5 h-5" />
                            <span>Reset Changes</span>
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Statistics</span>
                        </button>
                    </div>

                    {saved && (
                        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                            <p className="text-green-700 font-semibold">
                                ✓ Statistics updated successfully! Changes are now visible on the home page.
                            </p>
                        </div>
                    )}
                </div>

                {/* Preview */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-nss-blue mb-4">Preview (How it appears on home page)</h3>
                    <div className="bg-gradient-to-br from-nss-blue to-nss-blue-dark rounded-lg p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                    {formData.volunteersEnrolled.toLocaleString()}
                                </div>
                                <div className="text-gray-200 text-xs">Volunteers Enrolled</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                    {formData.hoursOfService.toLocaleString()}
                                </div>
                                <div className="text-gray-200 text-xs">Hours of Service</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                <Droplet className="w-8 h-8 text-white mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                    {formData.bloodUnitsDonated.toLocaleString()}
                                </div>
                                <div className="text-gray-200 text-xs">Blood Units Donated</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                                <Home className="w-8 h-8 text-white mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">
                                    {formData.villagesAdopted.toLocaleString()}
                                </div>
                                <div className="text-gray-200 text-xs">Villages Adopted</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
