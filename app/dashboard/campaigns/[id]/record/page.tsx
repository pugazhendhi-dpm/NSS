'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Droplet, Search, CheckCircle } from 'lucide-react'
import { getEligibleDonors, recordDonation, DonorEligibility } from '@/lib/campaignService'

export default function RecordDonationPage() {
    const router = useRouter()
    const params = useParams()
    const campaignId = params.id as string

    const [donors, setDonors] = useState<DonorEligibility[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedDonor, setSelectedDonor] = useState<DonorEligibility | null>(null)
    const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0])
    const [units, setUnits] = useState('1.0')
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        loadDonors()
    }, [])

    const loadDonors = async () => {
        try {
            // Fetch directly from blood_donors table
            const { data, error } = await (await import('@/lib/supabase/client')).supabase
                .from('blood_donors')
                .select('*')
                .order('name')

            if (error) {
                console.error('Error loading donors:', error)
                alert('Error loading donors. Check console.')
            } else {
                console.log('Loaded donors:', data?.length)
                // Map to DonorEligibility format
                const mappedDonors: DonorEligibility[] = (data || []).map(d => ({
                    id: d.id,
                    name: d.name,
                    rollNumber: d.roll_number,
                    bloodGroup: d.blood_group,
                    department: d.department,
                    year: d.year,
                    phone: d.phone,
                    lastDonationDate: d.last_donation_date ? new Date(d.last_donation_date) : null,
                    isEligible: true, // Show all for now
                    daysUntilEligible: 0,
                    totalDonations: 0,
                }))
                setDonors(mappedDonors)
            }
        } catch (err) {
            console.error('Exception loading donors:', err)
        }
        setLoading(false)
    }

    const filteredDonors = donors.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDonor) return

        setSaving(true)
        const volunteer = JSON.parse(sessionStorage.getItem('volunteer') || '{}')

        let donorId = selectedDonor.id

        // If walk-in donor, add to database first
        if (selectedDonor.id === 'new') {
            try {
                const { data, error } = await (await import('@/lib/supabase/client')).supabase
                    .from('blood_donors')
                    .insert({
                        name: selectedDonor.name,
                        roll_number: selectedDonor.rollNumber,
                        blood_group: selectedDonor.bloodGroup,
                        department: selectedDonor.department,
                        year: selectedDonor.year,
                        phone: selectedDonor.phone || '',
                    })
                    .select()
                    .single()

                if (error) {
                    console.error('Error adding walk-in donor:', error)
                    alert('Failed to add donor to database')
                    setSaving(false)
                    return
                }

                donorId = data.id
            } catch (err) {
                console.error('Exception adding donor:', err)
                alert('Failed to add donor')
                setSaving(false)
                return
            }
        }

        const result = await recordDonation({
            donorId,
            donorName: selectedDonor.name,
            donorRollNumber: selectedDonor.rollNumber,
            bloodGroup: selectedDonor.bloodGroup,
            campaignId,
            donationDate,
            unitsDonated: parseFloat(units),
            notes,
            recordedBy: volunteer.name || 'Unknown',
        })

        setSaving(false)

        if (result) {
            setSuccess(true)
            setTimeout(() => {
                router.push('/dashboard/campaigns')
            }, 2000)
        } else {
            alert('Failed to record donation. Please try again.')
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Donation Recorded!</h2>
                    <p className="text-gray-600">Thank you for saving lives 🩸</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold">Record Blood Donation</h1>
                    <p className="text-red-100">Add a new donation to this campaign</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Search or Add New */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Search Donor * ({donors.length} donors available)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedDonor({
                                            id: 'new',
                                            name: '',
                                            rollNumber: 'WALK-IN-' + Date.now(),
                                            bloodGroup: '',
                                            department: 'External',
                                            year: 'N/A',
                                            phone: '',
                                            lastDonationDate: null,
                                            isEligible: true,
                                            daysUntilEligible: 0,
                                            totalDonations: 0,
                                        } as any)
                                    }}
                                    className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-semibold"
                                >
                                    + Walk-in Donor
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, roll number, or blood group..."
                                    className="input-field pl-10"
                                />
                            </div>
                            {loading && <p className="text-sm text-gray-500 mt-1">Loading donors...</p>}
                        </div>

                        {/* Donor List */}
                        {searchQuery && (
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                {filteredDonors.length === 0 ? (
                                    <p className="p-4 text-gray-500 text-center">No eligible donors found</p>
                                ) : (
                                    filteredDonors.map((donor) => (
                                        <button
                                            key={donor.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedDonor(donor)
                                                setSearchQuery('')
                                            }}
                                            className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{donor.name}</p>
                                                    <p className="text-sm text-gray-600">{donor.rollNumber} • {donor.department}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                                        {donor.bloodGroup}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">{donor.totalDonations} donations</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Selected Donor */}
                        {selectedDonor && selectedDonor.id !== 'new' && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <p className="text-sm font-medium text-green-800">Selected Donor:</p>
                                <p className="text-lg font-bold text-green-900">{selectedDonor.name} ({selectedDonor.bloodGroup})</p>
                                <p className="text-sm text-green-700">{selectedDonor.rollNumber}</p>
                            </div>
                        )}

                        {/* Walk-in Donor Form */}
                        {selectedDonor && selectedDonor.id === 'new' && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                                <h3 className="text-lg font-semibold text-blue-900 mb-4">Walk-in Donor Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={selectedDonor.name}
                                            onChange={(e) => setSelectedDonor({ ...selectedDonor, name: e.target.value })}
                                            className="input-field"
                                            placeholder="Full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                                        <select
                                            required
                                            value={selectedDonor.bloodGroup}
                                            onChange={(e) => setSelectedDonor({ ...selectedDonor, bloodGroup: e.target.value })}
                                            className="input-field"
                                        >
                                            <option value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={selectedDonor.phone}
                                            onChange={(e) => setSelectedDonor({ ...selectedDonor, phone: e.target.value })}
                                            className="input-field"
                                            placeholder="Optional"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <input
                                            type="text"
                                            value={selectedDonor.department}
                                            onChange={(e) => setSelectedDonor({ ...selectedDonor, department: e.target.value })}
                                            className="input-field"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-blue-600 mt-3">This donor will be added to the database automatically</p>
                            </div>
                        )}

                        {/* Donation Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Donation Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={donationDate}
                                    onChange={(e) => setDonationDate(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Units Donated *
                                </label>
                                <input
                                    type="number"
                                    required
                                    step="0.1"
                                    min="0.1"
                                    value={units}
                                    onChange={(e) => setUnits(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any additional notes..."
                                className="input-field"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={!selectedDonor || saving}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Recording...' : 'Record Donation'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
