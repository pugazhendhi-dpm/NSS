'use client'

import { useRouter } from 'next/navigation'

export default function EditCampaignPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold">Edit Campaign</h1>
                    <p className="text-red-100">Modify campaign details</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center py-12">
                        <p className="text-gray-600 mb-4">Edit functionality coming soon!</p>
                        <p className="text-sm text-gray-500 mb-6">For now, you can create a new campaign or record donations to existing ones.</p>
                        <button
                            onClick={() => router.back()}
                            className="btn-primary"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
