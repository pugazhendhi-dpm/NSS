'use client'

import { useState } from 'react'
import { CheckCircle, Droplet, AlertCircle } from 'lucide-react'
import { DEPARTMENTS, YEARS, SECTIONS, EXTENDED_BLOOD_GROUPS, TN_DISTRICTS, TN_TOWNS_BY_DISTRICT, GENDERS, RESIDENTIAL_STATUS } from '@/lib/constants'
import Autocomplete from '@/components/ui/Autocomplete'
import { addBloodDonor } from '@/lib/bloodDonorsService'

export default function DonorRegistrationPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollNumber: '',
        age: '',
        department: '',
        year: '',
        section: '',
        gender: '',
        bloodGroup: '',
        phone: '',
        alternatePhone: '',
        district: '',
        hometown: '',
        address: '',
        bloodDonationWillingness: '',
        residentialStatus: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Save to Supabase
            const result = await addBloodDonor({
                name: formData.name,
                bloodGroup: formData.bloodGroup,
                phone: formData.phone,
                email: formData.email || undefined,
                age: formData.age ? parseInt(formData.age) : undefined,
                gender: formData.gender || undefined,
                address: formData.address || undefined,
                rollNumber: formData.rollNumber || undefined,
                department: formData.department || undefined,
                year: formData.year || undefined,
                section: formData.section || undefined,
                district: formData.district || undefined,
                hometown: formData.hometown || undefined,
                alternatePhone: formData.alternatePhone || undefined,
                bloodDonationWillingness: formData.bloodDonationWillingness || undefined,
                residentialStatus: formData.residentialStatus || undefined,
            })

            if (result) {
                setSubmitted(true)
            } else {
                setError('Failed to register. Please try again or contact NSS volunteers.')
            }
        } catch (err) {
            console.error('Registration error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleAutocompleteChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            [field]: value,
        })
    }

    // Get hometown options based on selected district
    const hometownOptions = formData.district && TN_TOWNS_BY_DISTRICT[formData.district]
        ? TN_TOWNS_BY_DISTRICT[formData.district]
        : []

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nss-red to-nss-red-dark flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-nss-blue mb-4">Thank You!</h2>
                    <p className="text-gray-700 mb-6">
                        Your blood donor registration has been received successfully. You are now part of our
                        life-saving donor database.
                    </p>
                    <p className="text-gray-600 mb-8">
                        NSS volunteers will contact you when there's an emergency blood requirement matching your group.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-primary w-full"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section
                className="relative text-white py-28 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/blood-donate-bg.png')" }}
            >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-1 tracking-wide drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white">
                        Blood Donor
                    </h1>
                    <div className="relative inline-block mb-10">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#E5B523] drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]">
                            Registration
                        </h2>
                        {/* Glow / Underline effect */}
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#E5B523] to-transparent opacity-80 blur-[1px]"></div>
                    </div>

                    <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-semibold tracking-wider mb-3 drop-shadow-md">
                        Register as a blood donor and help save lives in emergencies
                    </p>
                </div>
            </section>

            {/* Registration Form */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Donor Information Form</h2>
                            <p className="text-gray-600">
                                Please fill out all required fields. Your information will be kept confidential and used
                                only for emergency blood donation coordination.
                            </p>
                            <div className="mt-4 bg-red-50 border-l-4 border-nss-red p-4 rounded">
                                <p className="text-sm text-red-800">
                                    <strong>Important:</strong> By registering, you agree to be contacted by NSS volunteers
                                    during blood emergencies. You can always decline if you're unable to donate.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-red-800 font-medium">Registration Failed</p>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Personal Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-nss-blue mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="name.24cse@kongu.edu"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rollNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Roll Number *
                                        </label>
                                        <input
                                            type="text"
                                            id="rollNumber"
                                            name="rollNumber"
                                            required
                                            value={formData.rollNumber}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="e.g., 24CSR001"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Age *
                                        </label>
                                        <input
                                            type="number"
                                            id="age"
                                            name="age"
                                            required
                                            min="18"
                                            max="65"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="18-65"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Gender *
                                        </label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            required
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Gender</option>
                                            {GENDERS.map((gender) => (
                                                <option key={gender} value={gender}>
                                                    {gender}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-nss-blue mb-4">Academic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-3">
                                        <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Department *
                                        </label>
                                        <select
                                            id="department"
                                            name="department"
                                            required
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Department</option>
                                            {DEPARTMENTS.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Year of Study *
                                        </label>
                                        <select
                                            id="year"
                                            name="year"
                                            required
                                            value={formData.year}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Year</option>
                                            {YEARS.map((year) => (
                                                <option key={year} value={year}>
                                                    {year} Year
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="section" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Section *
                                        </label>
                                        <select
                                            id="section"
                                            name="section"
                                            required
                                            value={formData.section}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Section</option>
                                            {SECTIONS.map((section) => (
                                                <option key={section} value={section}>
                                                    Section {section}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="residentialStatus" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Residential Status *
                                        </label>
                                        <select
                                            id="residentialStatus"
                                            name="residentialStatus"
                                            required
                                            value={formData.residentialStatus}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Status</option>
                                            {RESIDENTIAL_STATUS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Blood Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-nss-blue mb-4">Blood Donation Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="bloodGroup" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Blood Group *
                                        </label>
                                        <select
                                            id="bloodGroup"
                                            name="bloodGroup"
                                            required
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Blood Group</option>
                                            {EXTENDED_BLOOD_GROUPS.map((group) => (
                                                <option key={group} value={group}>
                                                    {group}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="bloodDonationWillingness" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Willing to Donate Blood? *
                                        </label>
                                        <select
                                            id="bloodDonationWillingness"
                                            name="bloodDonationWillingness"
                                            required
                                            value={formData.bloodDonationWillingness}
                                            onChange={handleChange}
                                            className="input-field"
                                        >
                                            <option value="">Select Willingness</option>
                                            <option value="Yes">Yes, Always Ready</option>
                                            <option value="Maybe">Maybe, Depends on Situation</option>
                                            <option value="No">No, Just Registering Info</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-nss-blue mb-4">Contact Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="alternatePhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Alternate Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="alternatePhone"
                                            name="alternatePhone"
                                            value={formData.alternatePhone}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="+91 98765 43211 (Optional)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="border-b border-gray-200 pb-6">
                                <h3 className="text-lg font-semibold text-nss-blue mb-4">Location Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Autocomplete
                                            options={Array.from(TN_DISTRICTS)}
                                            value={formData.district}
                                            onChange={(value) => handleAutocompleteChange('district', value)}
                                            placeholder="Type to search districts..."
                                            label="District (Tamil Nadu)"
                                            required
                                            id="district"
                                        />
                                    </div>

                                    <div>
                                        <Autocomplete
                                            options={hometownOptions}
                                            value={formData.hometown}
                                            onChange={(value) => handleAutocompleteChange('hometown', value)}
                                            placeholder={formData.district ? "Type to search towns..." : "Select district first"}
                                            label="Hometown"
                                            required
                                            id="hometown"
                                        />
                                        {!formData.district && (
                                            <p className="text-xs text-gray-500 mt-1">Please select a district first</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Address *
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            required
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="input-field"
                                            placeholder="Enter your complete address (Street, Area, Landmark, Pin Code)"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Register as Blood Donor'}
                            </button>
                        </form>
                    </div>

                    {/* Info Card */}
                    <div className="mt-8 bg-blue-50 border-l-4 border-nss-blue p-6 rounded">
                        <h3 className="font-semibold text-nss-blue mb-2">Why Register?</h3>
                        <ul className="text-gray-700 space-y-2 text-sm">
                            <li>• Help save lives during medical emergencies</li>
                            <li>• Be part of a life-saving network</li>
                            <li>• Receive priority assistance if you ever need blood</li>
                            <li>• Contribute to community welfare</li>
                            <li>• Earn NSS service hours for blood donation</li>
                        </ul>
                    </div>

                    {/* Eligibility Info Card */}
                    <div className="mt-6 bg-red-50 border-l-4 border-nss-red p-6 rounded">
                        <h3 className="font-semibold text-nss-red-dark mb-3">Blood Donation Eligibility & Tips</h3>
                        <ul className="text-gray-700 space-y-2 text-sm mb-4">
                            <li><strong className="text-nss-red-dark">Age:</strong> Between 18 and 65 years old.</li>
                            <li><strong className="text-nss-red-dark">Hemoglobin Count:</strong> At least 12.5 g/dl.</li>
                            <li><strong className="text-nss-red-dark">Weight:</strong> Minimum 45 kg.</li>
                            <li><strong className="text-nss-red-dark">Health Status:</strong> You must have a normal body temperature and be feeling healthy on the day of donation.</li>
                        </ul>
                        <p className="text-gray-700 text-sm border-t border-red-100 pt-3">
                            You should always drink lots of water before the donation. Also, keep in mind that you should take a well-balanced meal prior to and after donating blood. This will keep you healthy and fit.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
