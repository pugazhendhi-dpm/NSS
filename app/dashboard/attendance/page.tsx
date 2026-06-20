'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { Users, Calendar, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { getApprovedVolunteers } from '@/lib/volunteersService'
import { saveAttendanceRecords } from '@/lib/attendanceService'

export default function AttendancePage() {
    const router = useRouter()
    const { user } = useAuth()
    const volunteer = user ? { id: user.dbId, name: user.name, email: user.email, role: user.role } as any : null
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [activityName, setActivityName] = useState('')
    const [volunteers, setVolunteers] = useState<Volunteer[]>([])
    const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({})
    const [saved, setSaved] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadApprovedVolunteers()
    }, [])

    const loadApprovedVolunteers = async () => {
        // Fetch approved volunteers from database
        const approvedVolunteers = await getApprovedVolunteers()

        // Set volunteers with isApproved flag
        const formattedVolunteers: Volunteer[] = approvedVolunteers.map(v => ({
            ...v,
            isApproved: true,
        }))

        setVolunteers(formattedVolunteers)

        // Initialize attendance as absent for all
        const initialAttendance: Record<string, 'present' | 'absent' | 'late'> = {}
        formattedVolunteers.forEach((v) => {
            initialAttendance[v.id] = 'absent'
        })
        setAttendance(initialAttendance)
    }

    const handleAttendanceChange = (volunteerId: string, status: 'present' | 'absent' | 'late') => {
        setAttendance({
            ...attendance,
            [volunteerId]: status,
        })
    }

    const handleMarkAll = (status: 'present' | 'absent' | 'late') => {
        const newAttendance: Record<string, 'present' | 'absent' | 'late'> = {}
        filteredVolunteers.forEach((v) => {
            newAttendance[v.id] = status
        })
        setAttendance(newAttendance)
    }

    const handleSaveAttendance = async () => {
        if (!activityName.trim()) {
            alert('Please enter activity name')
            return
        }

        if (!volunteer) {
            alert('Volunteer information not found')
            return
        }

        setSaving(true)
        setError(null)

        try {
            // Prepare volunteer data for saving
            const volunteerData = volunteers.map(v => ({
                id: v.id,
                name: v.name,
                rollNumber: v.rollNumber,
            }))

            // Save attendance to database
            const success = await saveAttendanceRecords(
                activityName,
                selectedDate,
                attendance,
                volunteerData,
                volunteer.name,
                volunteer.id
            )

            if (success) {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)

                // Reset form
                setActivityName('')
                setSelectedDate(new Date().toISOString().split('T')[0])

                // Reset attendance to absent
                const resetAttendance: Record<string, 'present' | 'absent' | 'late'> = {}
                volunteers.forEach((v) => {
                    resetAttendance[v.id] = 'absent'
                })
                setAttendance(resetAttendance)
            } else {
                setError('Failed to save attendance. Please try again.')
            }
        } catch (err) {
            console.error('Error saving attendance:', err)
            setError('An error occurred while saving attendance.')
        } finally {
            setSaving(false)
        }
    }

    // Filter volunteers based on search query
    const filteredVolunteers = volunteers.filter(vol =>
        vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vol.department.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const stats = {
        total: volunteers.length,
        present: Object.values(attendance).filter((s) => s === 'present').length,
        absent: Object.values(attendance).filter((s) => s === 'absent').length,
        late: Object.values(attendance).filter((s) => s === 'late').length,
    }

    const attendancePercentage = stats.total > 0
        ? Math.round(((stats.present + stats.late) / stats.total) * 100)
        : 0

    if (!user) {
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
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Attendance Management</h1>
                            <p className="text-gray-200">Mark attendance for NSS activities</p>
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
                {/* Activity Details */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-nss-blue mb-4">Activity Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Activity Name *
                            </label>
                            <input
                                type="text"
                                value={activityName}
                                onChange={(e) => setActivityName(e.target.value)}
                                placeholder="e.g., Blood Donation Drive"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date *
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-nss-blue rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Total</p>
                                    <p className="text-xl font-bold text-nss-blue">{stats.total}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Present</p>
                                    <p className="text-xl font-bold text-green-600">{stats.present}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Late</p>
                                    <p className="text-xl font-bold text-yellow-600">{stats.late}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${stats.total > 0 ? (stats.late / stats.total) * 100 : 0}%` }}></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                    <XCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-xs">Absent</p>
                                    <p className="text-xl font-bold text-red-600">{stats.absent}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.total > 0 ? (stats.absent / stats.total) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Attendance Percentage */}
                <div className="bg-gradient-to-r from-nss-blue to-nss-blue-dark rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between text-white">
                        <div>
                            <p className="text-sm opacity-90">Overall Attendance Rate</p>
                            <p className="text-4xl font-bold mt-1">{attendancePercentage}%</p>
                            <p className="text-xs opacity-75 mt-1">{stats.present + stats.late} out of {stats.total} volunteers</p>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold opacity-20">📊</div>
                        </div>
                    </div>
                </div>

                {/* Search and Bulk Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search Volunteers</label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, roll number, or department..."
                                className="input-field"
                            />
                            {searchQuery && (
                                <p className="text-xs text-gray-500 mt-1">Showing {filteredVolunteers.length} of {volunteers.length} volunteers</p>
                            )}
                        </div>

                        {/* Bulk Actions */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleMarkAll('present')}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                <span>Mark All Present</span>
                            </button>
                            <button
                                onClick={() => handleMarkAll('late')}
                                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2"
                            >
                                <Clock className="w-4 h-4" />
                                <span>Mark All Late</span>
                            </button>
                            <button
                                onClick={() => handleMarkAll('absent')}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-colors flex items-center space-x-2"
                            >
                                <XCircle className="w-4 h-4" />
                                <span>Mark All Absent</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-nss-blue">Volunteer List</h2>
                        <p className="text-sm text-gray-600 mt-1">Mark attendance for approved volunteers only</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Roll No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Year
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Attendance
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredVolunteers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            {searchQuery ? 'No volunteers found matching your search.' : 'No approved volunteers found.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVolunteers.map((vol, index) => (
                                        <tr key={vol.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {vol.rollNumber}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{vol.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{vol.department}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{vol.year}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAttendanceChange(vol.id, 'present')}
                                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${attendance[vol.id] === 'present'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                                                            }`}
                                                    >
                                                        Present
                                                    </button>
                                                    <button
                                                        onClick={() => handleAttendanceChange(vol.id, 'late')}
                                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${attendance[vol.id] === 'late'
                                                            ? 'bg-yellow-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                                                            }`}
                                                    >
                                                        Late
                                                    </button>
                                                    <button
                                                        onClick={() => handleAttendanceChange(vol.id, 'absent')}
                                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${attendance[vol.id] === 'absent'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                                                            }`}
                                                    >
                                                        Absent
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Save Button */}
                    <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Marked by: <strong>{volunteer.name}</strong>
                            </div>
                            <button
                                onClick={handleSaveAttendance}
                                disabled={saving}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserCheck className="w-5 h-5" />
                                        <span>Save Attendance</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {saved && (
                            <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <p className="text-green-700 font-semibold">
                                    ✓ Attendance saved successfully to database!
                                </p>
                            </div>
                        )}
                        {error && (
                            <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 font-semibold">
                                    ✗ {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
