'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Phone, Filter, Search, Droplet, Clock, User, Building2, AlertCircle, MapPin, Home } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { EXTENDED_BLOOD_GROUPS } from '@/lib/constants'
import { getBloodDonors, subscribeToBloodDonors } from '@/lib/bloodDonorsService'
import { getDonorStatus, getTimeSince, canCallDonor } from '@/lib/utils'
import EmergencyDonorSearch from '@/components/EmergencyDonorSearch'

// Extended donor interface for the database page
interface DetailedDonor {
    id: string
    name: string
    rollNumber: string
    age: number
    gender: string
    bloodGroup: string
    phone: string
    alternatePhone?: string
    email?: string
    department: string
    year: string
    section: string
    residentialStatus: string
    district: string
    hometown: string
    address: string
    bloodDonationWillingness: string
    lastCalledAt?: Date
    lastDonatedAt?: Date
    lastCalledBy?: string
    latitude?: number | null
    longitude?: number | null
    isAvailable?: boolean
}

export default function BloodDonorsPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [donors, setDonors] = useState<DetailedDonor[]>([])
    const [filteredDonors, setFilteredDonors] = useState<DetailedDonor[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDonor, setSelectedDonor] = useState<DetailedDonor | null>(null)

    // Filters
    const [bloodGroupFilter, setBloodGroupFilter] = useState<string>('all')
    const [departmentFilter, setDepartmentFilter] = useState<string>('all')
    const [yearFilter, setYearFilter] = useState<string>('all')
    const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'called' | 'donated'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20

    // Emergency search
    const [showEmergencySearch, setShowEmergencySearch] = useState(false)

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
            loadDonors()
        }

        // Subscribe to real-time updates
        const unsubscribe = subscribeToBloodDonors(() => {
            loadDonors()
        })

        return unsubscribe
    }, [router])

    const loadDonors = async () => {
        setLoading(true)
        const data = await getBloodDonors()

        // Transform Supabase data to DetailedDonor format
        const transformedData: DetailedDonor[] = data.map(donor => ({
            id: donor.id,
            name: donor.name,
            rollNumber: donor.rollNumber || 'N/A',
            age: donor.age || 0,
            gender: donor.gender || 'N/A',
            bloodGroup: donor.bloodGroup,
            phone: donor.phone,
            alternatePhone: donor.alternatePhone,
            email: donor.email,
            department: donor.department || 'N/A',
            year: donor.year || 'N/A',
            section: donor.section || 'N/A',
            residentialStatus: donor.residentialStatus || 'N/A',
            district: donor.district || 'N/A',
            hometown: donor.hometown || 'N/A',
            address: donor.address || 'N/A',
            bloodDonationWillingness: donor.bloodDonationWillingness || 'N/A',
            lastCalledAt: undefined, // TODO: Implement call tracking
            lastDonatedAt: donor.lastDonationDate,
            lastCalledBy: undefined,
            latitude: donor.latitude,
            longitude: donor.longitude,
            isAvailable: donor.isAvailable !== false, // Default to true if not specified
        }))

        setDonors(transformedData)
        setFilteredDonors(transformedData)
        setLoading(false)
    }

    // Apply filters
    useEffect(() => {
        let filtered = [...donors]

        // Blood group filter
        if (bloodGroupFilter !== 'all') {
            filtered = filtered.filter((d) => d.bloodGroup === bloodGroupFilter)
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter((d) => d.department === departmentFilter)
        }

        // Year filter
        if (yearFilter !== 'all') {
            filtered = filtered.filter((d) => d.year === yearFilter)
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter((d) => {
                const status = getDonorStatus(d.lastCalledAt, d.lastDonatedAt)
                return status === statusFilter
            })
        }

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter((d) =>
                d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        setFilteredDonors(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [bloodGroupFilter, departmentFilter, yearFilter, statusFilter, searchQuery, donors])

    // Calculate pagination
    const totalPages = Math.ceil(filteredDonors.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentDonors = filteredDonors.slice(startIndex, endIndex)

    const handleCall = async (donor: DetailedDonor) => {
        if (!volunteer) return

        // Check if can call
        if (!canCallDonor(donor.lastCalledAt)) {
            alert('This donor was called recently. Please wait 24 hours before calling again.')
            return
        }

        // Initiate phone call
        window.location.href = `tel:${donor.phone}`

        // TODO: Implement call tracking in Supabase
        // For now, just reload donors
        await loadDonors()
    }

    const departments = Array.from(new Set(donors.map((d) => d.department)))
    const years = Array.from(new Set(donors.map((d) => d.year)))

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading donor database...</p>
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
                            <h1 className="text-2xl font-bold">Blood Donor Database</h1>
                            <p className="text-gray-200">Find and contact donors during emergencies</p>
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
                {/* Emergency Search Button */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowEmergencySearch(true)}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
                    >
                        <MapPin className="w-6 h-6" />
                        <span className="text-lg">🚨 Emergency Blood Donor Search</span>
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Find by Location</span>
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <Filter className="w-5 h-5 text-nss-blue" />
                        <h2 className="text-lg font-semibold text-nss-blue">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {/* Blood Group Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                            <select
                                value={bloodGroupFilter}
                                onChange={(e) => setBloodGroupFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue text-sm"
                            >
                                <option value="all">All Groups</option>
                                {EXTENDED_BLOOD_GROUPS.map((group) => (
                                    <option key={group} value={group}>
                                        {group}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue text-sm"
                            >
                                <option value="all">All Departments</option>
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                            <select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue text-sm"
                            >
                                <option value="all">All Years</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue text-sm"
                            >
                                <option value="all">All Status</option>
                                <option value="ready">Ready to Call</option>
                                <option value="called">Called Recently</option>
                                <option value="donated">Donated Recently</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Name or Roll No..."
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue text-sm"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                            Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredDonors.length)}</strong> of <strong>{filteredDonors.length}</strong> donors
                            {filteredDonors.length !== donors.length && (
                                <span className="ml-2 text-gray-500">(filtered from {donors.length} total)</span>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="text-gray-500">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </div>
                        )}
                    </div>
                </div>

                {/* Donors Table - Detailed View */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-nss-blue text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Name & Roll No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Dept/Year</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Blood Group</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Contact</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Hostel/Day</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Willingness</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {currentDonors.map((donor) => {
                                    const status = getDonorStatus(donor.lastCalledAt, donor.lastDonatedAt)
                                    const canCall = canCallDonor(donor.lastCalledAt)

                                    return (
                                        <tr
                                            key={donor.id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => setSelectedDonor(donor)}
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-start space-x-2">
                                                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{donor.name}</p>
                                                        <p className="text-xs text-gray-500">{donor.rollNumber}</p>
                                                        <p className="text-xs text-gray-500">{donor.age} yrs, {donor.gender}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs">
                                                    <p className="font-medium text-gray-700 truncate" title={donor.department}>{donor.department}</p>
                                                    <p className="text-gray-500">{donor.year} Year</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center space-x-2">
                                                    <Droplet className="w-4 h-4 text-nss-red flex-shrink-0" />
                                                    <span className="font-semibold text-nss-red text-sm">{donor.bloodGroup}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs space-y-1">
                                                    <p className="text-gray-700 font-mono font-semibold">{donor.phone}</p>
                                                    {donor.alternatePhone && (
                                                        <p className="text-gray-500 font-mono">{donor.alternatePhone}</p>
                                                    )}
                                                    <p className="text-gray-600">{donor.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${donor.residentialStatus === 'Hostel'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {donor.residentialStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-xs">
                                                    <div className="flex items-center space-x-1">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        <p className="text-gray-700">{donor.district}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Home className="w-3 h-3 text-gray-400" />
                                                        <p className="text-gray-500">{donor.hometown}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${donor.bloodDonationWillingness === 'Yes'
                                                        ? 'bg-green-100 text-green-800'
                                                        : donor.bloodDonationWillingness === 'Maybe'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {donor.bloodDonationWillingness}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {status === 'ready' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                        🟢 Ready
                                                    </span>
                                                )}
                                                {status === 'called' && (
                                                    <div className="text-xs">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full font-semibold bg-yellow-100 text-yellow-800 mb-1">
                                                            🟡 Called
                                                        </span>
                                                        <div className="text-gray-600 mt-1">
                                                            <Clock className="w-3 h-3 inline mr-1" />
                                                            {getTimeSince(donor.lastCalledAt!)}
                                                        </div>
                                                        <div className="text-gray-600">By: {donor.lastCalledBy}</div>
                                                    </div>
                                                )}
                                                {status === 'donated' && (
                                                    <div className="text-xs">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full font-semibold bg-red-100 text-red-800 mb-1">
                                                            🔴 Donated
                                                        </span>
                                                        <div className="text-gray-600 mt-1">{getTimeSince(donor.lastDonatedAt!)}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {canCall && status !== 'donated' ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCall(donor)
                                                        }}
                                                        className="inline-flex items-center space-x-1 bg-nss-red hover:bg-nss-red-dark text-white px-3 py-2 rounded-lg transition-colors font-semibold text-xs shadow-md hover:shadow-lg"
                                                    >
                                                        <Phone className="w-3 h-3" />
                                                        <span>Call</span>
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="inline-flex items-center space-x-1 bg-gray-300 text-gray-500 px-3 py-2 rounded-lg cursor-not-allowed text-xs"
                                                        title={
                                                            status === 'donated'
                                                                ? 'Donor in cooldown period'
                                                                : 'Called recently - wait 24 hours'
                                                        }
                                                    >
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Locked</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredDonors.length === 0 && (
                        <div className="text-center py-12">
                            <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No donors found matching your filters</p>
                            <button
                                onClick={() => {
                                    setBloodGroupFilter('all')
                                    setDepartmentFilter('all')
                                    setYearFilter('all')
                                    setStatusFilter('all')
                                    setSearchQuery('')
                                }}
                                className="mt-4 text-nss-blue hover:text-nss-red font-semibold"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && filteredDonors.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                            <span className="font-medium">{totalPages}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>

                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                            ? 'z-10 bg-nss-blue border-nss-blue text-white'
                                                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-nss-blue mb-4">Status Legend</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-start space-x-2">
                            <span className="text-2xl">🟢</span>
                            <div>
                                <p className="font-semibold text-green-700">Ready to Call</p>
                                <p className="text-gray-600">Donor is available and can be contacted</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="text-2xl">🟡</span>
                            <div>
                                <p className="font-semibold text-yellow-700">Called Recently</p>
                                <p className="text-gray-600">Contacted within last 24 hours - avoid duplicate calls</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="text-2xl">🔴</span>
                            <div>
                                <p className="font-semibold text-red-700">Donated Recently</p>
                                <p className="text-gray-600">In 90-day cooldown period - do not call</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-6 bg-gradient-to-r from-nss-blue to-nss-blue-dark rounded-lg shadow-md p-8 text-white">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-3">Have Feedback or Suggestions?</h3>
                        <p className="text-gray-100 mb-6 max-w-2xl mx-auto">
                            Help us improve the Blood Command Center! Share your experience, report issues, or suggest new features.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="mailto:nsskec@kongu.ac.in?subject=Blood Command Center Feedback"
                                className="inline-flex items-center space-x-2 bg-white text-nss-blue hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>Send Feedback via Email</span>
                            </a>
                            <a
                                href="tel:+919876543210"
                                className="inline-flex items-center space-x-2 bg-nss-red hover:bg-nss-red-dark text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                            >
                                <Phone className="w-5 h-5" />
                                <span>Call Programme Officer</span>
                            </a>
                        </div>
                        <p className="text-sm text-gray-200 mt-6">
                            Your feedback helps us serve the community better. Thank you for being part of NSS!
                        </p>
                    </div>
                </div>
            </div>

            {/* Emergency Donor Search Modal */}
            {showEmergencySearch && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowEmergencySearch(false)}
                >
                    <div
                        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <EmergencyDonorSearch
                            donors={donors as any}
                            onClose={() => setShowEmergencySearch(false)}
                        />
                    </div>
                </div>
            )}

            {/* Donor Detail Modal */}
            {selectedDonor && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedDonor(null)}
                >
                    <div
                        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-nss-blue text-white p-6">
                            <h2 className="text-2xl font-bold">{selectedDonor.name}</h2>
                            <p className="text-gray-200">{selectedDonor.rollNumber}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Age</p>
                                    <p className="font-semibold">{selectedDonor.age} years</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Gender</p>
                                    <p className="font-semibold">{selectedDonor.gender}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Blood Group</p>
                                    <p className="font-semibold text-nss-red">{selectedDonor.bloodGroup}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Willingness</p>
                                    <p className="font-semibold">{selectedDonor.bloodDonationWillingness}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Department</p>
                                    <p className="font-semibold">{selectedDonor.department}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Year & Section</p>
                                    <p className="font-semibold">{selectedDonor.year} Year, Section {selectedDonor.section}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Residential Status</p>
                                    <p className="font-semibold">{selectedDonor.residentialStatus}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-semibold font-mono">{selectedDonor.phone}</p>
                                </div>
                                {selectedDonor.alternatePhone && (
                                    <div>
                                        <p className="text-sm text-gray-600">Alternate Phone</p>
                                        <p className="font-semibold font-mono">{selectedDonor.alternatePhone}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">District</p>
                                    <p className="font-semibold">{selectedDonor.district}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Hometown</p>
                                    <p className="font-semibold">{selectedDonor.hometown}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="font-semibold">{selectedDonor.address}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    onClick={() => setSelectedDonor(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {canCallDonor(selectedDonor.lastCalledAt) && getDonorStatus(selectedDonor.lastCalledAt, selectedDonor.lastDonatedAt) !== 'donated' && (
                                    <button
                                        onClick={() => {
                                            handleCall(selectedDonor)
                                            setSelectedDonor(null)
                                        }}
                                        className="btn-primary flex items-center space-x-2"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span>Call Donor</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
