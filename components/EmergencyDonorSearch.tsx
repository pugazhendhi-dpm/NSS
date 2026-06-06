'use client'

import { useState } from 'react'
import { Search, MapPin, Droplet, Phone, Navigation, Loader2 } from 'lucide-react'
import { DetailedDonor } from '@/lib/types'
import { geocodeAddress, filterDonorsInRadius, formatDistance, getDirectionsUrl } from '@/lib/geocoding'

interface EmergencyDonorSearchProps {
    donors: DetailedDonor[]
    onClose?: () => void
}

export default function EmergencyDonorSearch({ donors, onClose }: EmergencyDonorSearchProps) {
    const [emergencyLocation, setEmergencyLocation] = useState('')
    const [bloodGroup, setBloodGroup] = useState<string>('')
    const [radius, setRadius] = useState(20)
    const [searching, setSearching] = useState(false)
    const [searchResults, setSearchResults] = useState<(DetailedDonor & { distance: number })[]>([])
    const [emergencyCoords, setEmergencyCoords] = useState<{ lat: number; lon: number } | null>(null)
    const [error, setError] = useState('')

    const bloodGroups = [
        'O Positive (O+)',
        'O Negative (O-)',
        'A Positive (A+)',
        'A Negative (A-)',
        'B Positive (B+)',
        'B Negative (B-)',
        'AB Positive (AB+)',
        'AB Negative (AB-)',
        'A1 Positive (A1+)',
        'A1 Negative (A1-)',
        'A1B Positive (A1B+)',
        'A1B Negative (A1B-)',
        'A2 Positive (A2+)',
        'A2 Negative (A2-)',
        'A2B Positive (A2B+)',
        'A2B Negative (A2B-)',
    ]

    const handleSearch = async () => {
        if (!emergencyLocation.trim()) {
            setError('Please enter an emergency location')
            return
        }

        if (!bloodGroup) {
            setError('Please select a blood group')
            return
        }

        setSearching(true)
        setError('')
        setSearchResults([])

        try {
            // Geocode the emergency location
            const coords = await geocodeAddress(emergencyLocation + ', Tamil Nadu, India')

            if (!coords) {
                setError('Could not find the location. Please try a different address or landmark.')
                setSearching(false)
                return
            }

            setEmergencyCoords({ lat: coords.lat, lon: coords.lon })

            // Filter donors by blood group (if not "Any Group", filter by specific blood group)
            const matchingDonors = donors.filter(
                (donor) => {
                    const bloodGroupMatch = bloodGroup === 'Any Group' || donor.bloodGroup === bloodGroup
                    return bloodGroupMatch && donor.latitude && donor.longitude
                }
            )

            // Find donors within radius
            const nearbyDonors = filterDonorsInRadius(matchingDonors, coords.lat, coords.lon, radius)

            setSearchResults(nearbyDonors)

            if (nearbyDonors.length === 0) {
                const groupText = bloodGroup === 'Any Group' ? 'donors' : `${bloodGroup} donors`
                setError(`No ${groupText} found within ${radius}km of ${emergencyLocation}. Try increasing the search radius.`)
            }
        } catch (err) {
            console.error('Search error:', err)
            setError('An error occurred while searching. Please try again.')
        } finally {
            setSearching(false)
        }
    }

    const getDonorStatus = (lastDonatedAt: Date | null) => {
        if (!lastDonatedAt) return { status: 'ready', text: 'Ready to donate', color: 'text-green-600' }

        const daysSince = Math.floor((Date.now() - new Date(lastDonatedAt).getTime()) / (1000 * 60 * 60 * 24))

        if (daysSince < 90) {
            return {
                status: 'cooldown',
                text: `Cooldown (${90 - daysSince} days left)`,
                color: 'text-red-600',
            }
        }

        return { status: 'ready', text: 'Ready to donate', color: 'text-green-600' }
    }

    return (
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-nss-red flex items-center">
                        <MapPin className="w-6 h-6 mr-2" />
                        🚨 Emergency Blood Donor Search
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">Find nearby donors based on location and blood group</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Search Form */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Emergency Location */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📍 Emergency Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={emergencyLocation}
                                onChange={(e) => setEmergencyLocation(e.target.value)}
                                placeholder="Enter address, landmark, or district (e.g., Adyar, Chennai)"
                                className="input-field pl-10 w-full"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Blood Group */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🩸 Blood Group Required
                        </label>
                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="input-field w-full"
                        >
                            <option value="">Select blood group</option>
                            <option value="Any Group">Any Group (Show All)</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-end gap-4">
                    {/* Search Radius */}
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📏 Search Radius: {radius} km
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="50"
                            step="5"
                            value={radius}
                            onChange={(e) => setRadius(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5 km</span>
                            <span>50 km</span>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={searching}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {searching ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Searching...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span>Find Donors</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded">
                    <p className="text-yellow-700 text-sm">{error}</p>
                </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                            Found {searchResults.length} donor{searchResults.length !== 1 ? 's' : ''} within {radius}km
                        </h3>
                        <span className="text-sm text-gray-600">Sorted by distance</span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {searchResults.map((donor, index) => {
                            const status = getDonorStatus(donor.lastDonatedAt)

                            return (
                                <div
                                    key={donor.id}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Donor Info */}
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">
                                                    #{index + 1}
                                                </span>
                                                <h4 className="text-lg font-bold text-gray-900">{donor.name}</h4>
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-nss-red text-white">
                                                    <Droplet className="w-4 h-4 mr-1" />
                                                    {donor.bloodGroup}
                                                </span>
                                            </div>

                                            {/* Distance & Location */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Navigation className="w-4 h-4 mr-2 text-blue-500" />
                                                    <span className="font-semibold text-blue-600">
                                                        {formatDistance(donor.distance)} away
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                    {donor.hometown}, {donor.district}
                                                </div>
                                            </div>

                                            {/* Contact & Details */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Phone className="w-4 h-4 mr-2 text-green-500" />
                                                    <a href={`tel:${donor.phone}`} className="hover:text-nss-blue font-semibold">
                                                        {donor.phone}
                                                    </a>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    🏠 {donor.residentialStatus} • {donor.year} Year {donor.department}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className={`font-semibold ${status.color}`}>
                                                    {status.text}
                                                </span>
                                                <span className="text-gray-500">
                                                    Willingness: <span className="font-semibold">{donor.bloodDonationWillingness}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col space-y-2 ml-4">
                                            <a
                                                href={`tel:${donor.phone}`}
                                                className="inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                                            >
                                                <Phone className="w-4 h-4" />
                                                <span>Call</span>
                                            </a>
                                            {emergencyCoords && (
                                                <a
                                                    href={getDirectionsUrl(
                                                        emergencyCoords.lat,
                                                        emergencyCoords.lon,
                                                        donor.latitude!,
                                                        donor.longitude!
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                                                >
                                                    <Navigation className="w-4 h-4" />
                                                    <span>Directions</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {!searching && searchResults.length === 0 && !error && emergencyLocation && bloodGroup && (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Enter a location and blood group to search for nearby donors</p>
                </div>
            )}
        </div>
    )
}
