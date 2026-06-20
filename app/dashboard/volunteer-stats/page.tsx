'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { TrendingUp, Calendar, CheckCircle, XCircle, Clock, User, Search } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { getAllVolunteerStats, VolunteerAttendanceStats } from '@/lib/attendanceService'

export default function VolunteerStatsPage() {
    const router = useRouter()
    const { user } = useAuth()
    const volunteer = user ? { id: user.dbId, name: user.name, email: user.email, role: user.role } as any : null
    const [stats, setStats] = useState<VolunteerAttendanceStats[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        setLoading(true)
        const data = await getAllVolunteerStats()
        setStats(data)
        setLoading(false)
    }

    const filteredStats = stats.filter(stat =>
        stat.volunteerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stat.department.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-green-600 bg-green-50'
        if (percentage >= 75) return 'text-blue-600 bg-blue-50'
        if (percentage >= 60) return 'text-yellow-600 bg-yellow-50'
        return 'text-red-600 bg-red-50'
    }

    const getPercentageBadge = (percentage: number) => {
        if (percentage >= 90) return '🌟 Excellent'
        if (percentage >= 75) return '👍 Good'
        if (percentage >= 60) return '⚠️ Average'
        return '❌ Poor'
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
            {/* Header */}
            <div className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Volunteer Statistics</h1>
                            <p className="text-gray-200">Individual attendance rates and performance</p>
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
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-nss-blue rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Total Volunteers</p>
                                <p className="text-xl font-bold text-nss-blue">{stats.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Avg Attendance</p>
                                <p className="text-xl font-bold text-green-600">
                                    {stats.length > 0
                                        ? Math.round(stats.reduce((sum, s) => sum + s.attendancePercentage, 0) / stats.length)
                                        : 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">High Performers</p>
                                <p className="text-xl font-bold text-yellow-600">
                                    {stats.filter(s => s.attendancePercentage >= 90).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-gray-600 text-xs">Need Attention</p>
                                <p className="text-xl font-bold text-red-600">
                                    {stats.filter(s => s.attendancePercentage < 60).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Volunteers</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, roll number, or department..."
                            className="input-field pl-10"
                        />
                    </div>
                    {searchQuery && (
                        <p className="text-xs text-gray-500 mt-2">Showing {filteredStats.length} of {stats.length} volunteers</p>
                    )}
                </div>

                {/* Statistics Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-nss-blue">Individual Attendance Records</h2>
                        <p className="text-sm text-gray-600 mt-1">Detailed statistics for each volunteer</p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading statistics...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Volunteer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Total Activities
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Present
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Late
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Absent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Attendance %
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStats.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                {searchQuery ? 'No volunteers found matching your search.' : 'No attendance records found.'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStats.map((stat, index) => (
                                            <tr key={stat.volunteerId} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{stat.volunteerName}</p>
                                                        <p className="text-xs text-gray-500">{stat.rollNumber}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <div>
                                                        <p>{stat.department}</p>
                                                        <p className="text-xs text-gray-500">{stat.year} Year</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm font-semibold text-gray-900">{stat.totalActivities}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span className="text-sm font-semibold text-green-600">{stat.daysPresent}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-yellow-500" />
                                                        <span className="text-sm font-semibold text-yellow-600">{stat.daysLate}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <XCircle className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm font-semibold text-red-600">{stat.daysAbsent}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col space-y-1">
                                                        <span className={`text-lg font-bold ${getPercentageColor(stat.attendancePercentage)}`}>
                                                            {stat.attendancePercentage.toFixed(1)}%
                                                        </span>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full ${stat.attendancePercentage >= 90 ? 'bg-green-500' :
                                                                        stat.attendancePercentage >= 75 ? 'bg-blue-500' :
                                                                            stat.attendancePercentage >= 60 ? 'bg-yellow-500' :
                                                                                'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${stat.attendancePercentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPercentageColor(stat.attendancePercentage)}`}>
                                                        {getPercentageBadge(stat.attendancePercentage)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">≥90% - Excellent</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">75-89% - Good</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">60-74% - Average</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">&lt;60% - Needs Improvement</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
