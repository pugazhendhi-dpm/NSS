'use client'

import { useState } from 'react'
import { BLOOD_GROUPS } from '@/lib/types'
import { DEPARTMENTS, YEARS } from '@/lib/constants'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { addVolunteer } from '@/lib/volunteersService'

export default function JoinPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        year: '',
        bloodGroup: '',
        phone: '',
        skills: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [emailError, setEmailError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email.endsWith('@kongu.edu')) {
            setEmailError('Only @kongu.edu college email addresses are accepted.')
            return
        }
        setLoading(true)
        setError('')

        try {
            console.log('Submitting enrollment:', formData)

            // Save to Supabase
            const result = await addVolunteer({
                name: formData.name,
                email: formData.email,
                rollNumber: formData.rollNumber,
                department: formData.department,
                year: formData.year,
                bloodGroup: formData.bloodGroup,
                phone: formData.phone,
                skills: formData.skills,
            })

            console.log('Enrollment result:', result)

            if (result) {
                setSubmitted(true)
            } else {
                console.error('Enrollment failed - addVolunteer returned null')
                setError('Failed to submit enrollment. Please try again or contact NSS volunteers.')
            }
        } catch (err) {
            console.error('Enrollment error:', err)

            // Display specific error message if available
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        if (name === 'email') {
            if (value && !value.endsWith('@kongu.edu')) {
                setEmailError('Only @kongu.edu college email addresses are accepted.')
            } else {
                setEmailError('')
            }
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nss-blue to-nss-blue-dark flex items-center justify-center px-4">
                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-nss-blue mb-4">Welcome to NSS!</h2>
                    <p className="text-gray-700 mb-6">
                        Thank you for joining the National Service Scheme. Your enrollment has been received successfully.
                    </p>
                    <p className="text-gray-600 mb-4">
                        <strong>Next Steps:</strong>
                    </p>
                    <ul className="text-left text-gray-600 mb-8 space-y-2">
                        <li>• Your application will be reviewed by the senior volunteers</li>
                        <li>• You'll receive approval notification via email</li>
                        <li>• Attend the orientation session</li>
                        <li>• Collect your NSS ID card and diary</li>
                    </ul>
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
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Join NSS</h1>
                    <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                        Begin your journey of service and personal growth
                    </p>
                </div>
            </section>

            {/* Enrollment Form */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-nss-blue mb-4">Volunteer Enrollment Form</h2>
                            <p className="text-gray-600">
                                Fill out the form below to become a part of our NSS family. All fields are required.
                            </p>
                            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>Approval Process:</strong> Your enrollment will be reviewed by senior volunteers
                                    before being approved. You'll receive a confirmation email once approved.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start space-x-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-red-800 font-medium">Enrollment Failed</p>
                                        <p className="text-sm text-red-700 mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Full Name */}
                            <div>
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

                            {/* Email */}
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
                                    className={`input-field ${emailError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="e.g., name.24cse@kongu.edu"
                                />
                                {emailError && (
                                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                        ⚠️ {emailError}
                                    </p>
                                )}
                            </div>

                            {/* Roll Number & Department */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>

                            {/* Year & Blood Group */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Year *
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
                                        {BLOOD_GROUPS.map((group) => (
                                            <option key={group} value={group}>
                                                {group}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Phone */}
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

                            {/* Skills */}
                            <div>
                                <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skills & Interests (Optional)
                                </label>
                                <textarea
                                    id="skills"
                                    name="skills"
                                    rows={3}
                                    value={formData.skills}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g., Photography, Content Writing, First Aid, Teaching, etc."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : 'Submit Enrollment'}
                            </button>
                        </form>
                    </div>

                    {/* Info Cards */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-nss-blue/10 border-l-4 border-nss-blue p-6 rounded">
                            <h3 className="font-semibold text-nss-blue mb-2">What Happens Next?</h3>
                            <ul className="text-gray-700 space-y-2 text-sm">
                                <li>• Orientation session within 1 week</li>
                                <li>• NSS Diary and ID card distribution</li>
                                <li>• Assignment to activity groups</li>
                            </ul>
                        </div>
                        <div className="bg-nss-red/10 border-l-4 border-nss-red p-6 rounded">
                            <h3 className="font-semibold text-nss-red mb-2">Commitment Required</h3>
                            <ul className="text-gray-700 space-y-2 text-sm">
                                <li>• 120 hours of regular activities</li>
                                <li>• One 7-day special camp annually</li>
                                <li>• Active participation in events</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
