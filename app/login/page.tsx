'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { authenticateVolunteer } from '@/lib/mockData'

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const volunteer = await authenticateVolunteer(formData.email, formData.password)

            if (volunteer) {
                // Store volunteer info in session storage
                sessionStorage.setItem('volunteer', JSON.stringify(volunteer))

                // Trigger custom event to update navbar immediately
                window.dispatchEvent(new Event('loginStateChanged'))

                router.push('/dashboard')
            } else {
                setError('Invalid email or password. Please try again.')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-nss-blue via-nss-blue-dark to-nss-blue flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                            <Image
                                src="/images/nss-logo.png"
                                alt="NSS Logo"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Volunteer Login</h1>
                    <p className="text-gray-200">Access the Blood Command Center</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="input-field"
                                placeholder="name.24cse@kongu.edu"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    id="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="input-field pl-10"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-xs font-semibold text-blue-900 mb-3">🔐 Test Accounts</p>

                        <div className="space-y-3">
                            {/* Admin Account */}
                            <div className="bg-white p-2 rounded border border-purple-200">
                                <p className="text-xs font-semibold text-purple-800 mb-1">👑 Administrator (Full Access)</p>
                                <p className="text-xs text-gray-700">
                                    <code className="bg-purple-50 px-1.5 py-0.5 rounded text-purple-700">nsskec@kongu.edu</code>
                                    <span className="mx-2 text-gray-400">|</span>
                                    Pass: <code className="bg-purple-50 px-1.5 py-0.5 rounded text-purple-700">pugazh</code>
                                </p>
                            </div>

                            {/* Supersenior Account */}
                            <div className="bg-white p-2 rounded border border-blue-200">
                                <p className="text-xs font-semibold text-blue-800 mb-1">⭐ Super Senior (Limited Access)</p>
                                <p className="text-xs text-gray-700">
                                    <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">supersenior@kongu.edu</code>
                                    <span className="mx-2 text-gray-400">|</span>
                                    Pass: <code className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-700">nss</code>
                                </p>
                            </div>

                            {/* Volunteer Account */}
                            <div className="bg-white p-2 rounded border border-green-200">
                                <p className="text-xs font-semibold text-green-800 mb-1">👤 Volunteer (Blood Donors Only)</p>
                                <p className="text-xs text-gray-700">
                                    <code className="bg-green-50 px-1.5 py-0.5 rounded text-green-700">volunteer@kongu.edu</code>
                                    <span className="mx-2 text-gray-400">|</span>
                                    Pass: <code className="bg-green-50 px-1.5 py-0.5 rounded text-green-700">nss</code>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <a href="/" className="text-white hover:text-gray-200 transition-colors">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    )
}
