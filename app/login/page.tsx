'use client'

import { useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shield } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-nss-blue via-nss-blue-dark to-nss-blue flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-white">Loading...</p>
                </div>
            </div>
        )
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
                    <h1 className="text-3xl font-bold text-white mb-2">NSS Dashboard</h1>
                    <p className="text-gray-200">Sign in with your Kongu Engineering College account</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-nss-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-nss-blue" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">Authorized Access Only</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Only authorized NSS administrators and super seniors can access the dashboard.
                        </p>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md group"
                    >
                        {/* Google Icon SVG */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="group-hover:translate-x-0.5 transition-transform">Sign in with Google</span>
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Use your <span className="font-semibold text-gray-600">@kongu.edu</span> email address
                        </p>
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
