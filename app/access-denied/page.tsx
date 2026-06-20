'use client'

import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldX, ArrowLeft, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

function AccessDeniedContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    const errorMessages: Record<string, { title: string; message: string }> = {
        domain: {
            title: 'Invalid Email Domain',
            message: 'Only @kongu.edu email addresses are allowed. Please sign in with your Kongu Engineering College Google account.',
        },
        not_authorized: {
            title: 'Not Authorized',
            message: 'Your email is not in the authorized users list. Please contact the NSS Administrator to request access.',
        },
        inactive: {
            title: 'Account Deactivated',
            message: 'Your account has been deactivated by the administrator. Please contact the NSS office for assistance.',
        },
    }

    const errorInfo = errorMessages[error || ''] || {
        title: 'Access Denied',
        message: 'You do not have permission to access the NSS Dashboard. Please contact the administrator.',
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg p-2">
                        <Image
                            src="/images/nss-logo.png"
                            alt="NSS Logo"
                            width={64}
                            height={64}
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Error Card */}
                <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-red-500">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldX className="w-8 h-8 text-red-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
                    <p className="text-gray-600 mb-8">{errorInfo.message}</p>

                    <div className="space-y-3">
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                            className="w-full flex items-center justify-center gap-2 bg-nss-blue hover:bg-nss-blue-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try a Different Account
                        </button>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-gray-400 mt-6">
                    Contact: <span className="font-mono">nsskec@kongu.edu</span>
                </p>
            </div>
        </div>
    )
}

export default function AccessDeniedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue"></div>
            </div>
        }>
            <AccessDeniedContent />
        </Suspense>
    )
}
