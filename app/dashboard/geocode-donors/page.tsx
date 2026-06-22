'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { geocodeAddress } from '@/lib/geocoding'

interface GeocodingResult {
    id: string
    name: string
    address: string
    status: 'pending' | 'success' | 'failed' | 'skipped'
    latitude?: number
    longitude?: number
    error?: string
}

export default function GeocodeDonorsPage() {
    const router = useRouter()
    const [processing, setProcessing] = useState(false)
    const [results, setResults] = useState<GeocodingResult[]>([])
    const [progress, setProgress] = useState({ current: 0, total: 0 })

    const geocodeDonors = async () => {
        setProcessing(true)
        setResults([])

        try {
            // Fetch all donors without coordinates
            const response = await fetch('/api/blood-donors')
            if (!response.ok) throw new Error('Failed to fetch donors')
            const allDonors = await response.json()
            const donors = allDonors.filter((d: any) => d.latitude == null || d.longitude == null)

            if (!donors || donors.length === 0) {
                alert('All donors already have geolocation data!')
                setProcessing(false)
                return
            }

            setProgress({ current: 0, total: donors.length })

            const geocodingResults: GeocodingResult[] = []

            for (let i = 0; i < donors.length; i++) {
                const donor = donors[i]
                setProgress({ current: i + 1, total: donors.length })

                // Build address string from available data
                const addressParts = [
                    donor.hometown,
                    donor.district,
                    'Tamil Nadu',
                    'India'
                ].filter(Boolean)

                const fullAddress = addressParts.join(', ')

                const result: GeocodingResult = {
                    id: donor.id,
                    name: donor.name,
                    address: fullAddress,
                    status: 'pending'
                }

                try {
                    // Geocode the address
                    const coords = await geocodeAddress(fullAddress)

                    if (coords) {
                        // Update donor in database
                        const updateResponse = await fetch(`/api/blood-donors/${donor.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                latitude: coords.lat,
                                longitude: coords.lon
                            })
                        })

                        if (!updateResponse.ok) {
                            result.status = 'failed'
                            result.error = 'Failed to update database'
                        } else {
                            result.status = 'success'
                            result.latitude = coords.lat
                            result.longitude = coords.lon
                        }
                    } else {
                        result.status = 'failed'
                        result.error = 'Could not geocode address'
                    }
                } catch (err) {
                    result.status = 'failed'
                    result.error = err instanceof Error ? err.message : 'Unknown error'
                }

                geocodingResults.push(result)
                setResults([...geocodingResults])

                // Rate limiting: wait 1 second between requests (Nominatim requirement)
                if (i < donors.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000))
                }
            }

            alert(`Geocoding complete! ${geocodingResults.filter(r => r.status === 'success').length} donors updated successfully.`)
        } catch (error) {
            console.error('Error geocoding donors:', error)
            alert('An error occurred while geocoding donors.')
        } finally {
            setProcessing(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-600" />
            case 'pending':
                return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-nss-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center">
                                <MapPin className="w-6 h-6 mr-2" />
                                Geocode Blood Donors
                            </h1>
                            <p className="text-gray-200">Add geolocation data to enable emergency search</p>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/blood-donors')}
                            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                        >
                            ← Back to Donors
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ About This Tool</h2>
                    <p className="text-blue-800 mb-4">
                        This tool will automatically geocode all blood donors who don't have latitude/longitude coordinates.
                        It uses their hometown and district information to find their approximate location.
                    </p>
                    <div className="bg-white rounded p-4 space-y-2 text-sm">
                        <p className="text-gray-700">
                            <strong>⚠️ Important Notes:</strong>
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                            <li>This process uses OpenStreetMap Nominatim API (free, no API key required)</li>
                            <li>Rate limit: 1 request per second (required by Nominatim)</li>
                            <li>The process may take several minutes for large databases</li>
                            <li>Coordinates are approximate based on hometown/district</li>
                            <li>Once completed, the emergency donor search will work properly</li>
                        </ul>
                    </div>
                </div>

                {/* Action Button */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <button
                        onClick={geocodeDonors}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-nss-red to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Geocoding in Progress...</span>
                            </>
                        ) : (
                            <>
                                <MapPin className="w-6 h-6" />
                                <span>Start Geocoding Donors</span>
                            </>
                        )}
                    </button>

                    {processing && (
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{progress.current} / {progress.total}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-nss-blue h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Table */}
                {results.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Geocoding Results</h3>
                            <p className="text-sm text-gray-600">
                                Success: {results.filter(r => r.status === 'success').length} |
                                Failed: {results.filter(r => r.status === 'failed').length} |
                                Total: {results.length}
                            </p>
                        </div>
                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Donor Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Address</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Coordinates</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Error</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {results.map((result) => (
                                        <tr key={result.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                {getStatusIcon(result.status)}
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                {result.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {result.address}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                                                {result.latitude && result.longitude ? (
                                                    <span className="text-green-600">
                                                        {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-red-600">
                                                {result.error || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
