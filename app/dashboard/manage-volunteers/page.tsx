'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { Trash2, UserPlus, Users } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import { 
    FeaturedVolunteer, 
    getFeaturedVolunteers, 
    addFeaturedVolunteer, 
    deleteFeaturedVolunteer 
} from '@/lib/featuredVolunteersService'

export default function ManageVolunteersPage() {
    const router = useRouter()
    const { user } = useAuth()
    const volunteer = user ? { id: user.dbId, name: user.name, email: user.email, role: user.role } as any : null
    const [featuredVolunteers, setFeaturedVolunteers] = useState<FeaturedVolunteer[]>([])
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    
    // Form state
    const [name, setName] = useState('')
    const [department, setDepartment] = useState('')
    const [phone, setPhone] = useState('')

    useEffect(() => {
        if (!user) return
        
        // Ensure only admin or supersenior can access
        if (user.role === 'volunteer') {
            router.push('/dashboard')
            return
        }
        
        loadFeaturedVolunteers()
    }, [user?.email, user?.role, router])

    const loadFeaturedVolunteers = async () => {
        setLoading(true)
        const data = await getFeaturedVolunteers()
        setFeaturedVolunteers(data)
        setLoading(false)
    }

    const handleAddVolunteer = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !department || !phone) {
            setError('Please fill in all fields.')
            return
        }

        setIsSubmitting(true)
        setError('')

        const success = await addFeaturedVolunteer({ name, department, phone })
        
        if (success) {
            // Reset form and reload
            setName('')
            setDepartment('')
            setPhone('')
            await loadFeaturedVolunteers()
        } else {
            setError('Failed to add volunteer. Please try again.')
        }
        
        setIsSubmitting(false)
    }

    const handleDeleteVolunteer = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this volunteer?')) return

        const success = await deleteFeaturedVolunteer(id)
        if (success) {
            await loadFeaturedVolunteers()
        } else {
            alert('Failed to delete volunteer.')
        }
    }

    if (!volunteer || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nss-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
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
                            <h1 className="text-2xl font-bold">Manage Featured Volunteers</h1>
                            <p className="text-gray-200">Add or remove student volunteers displayed on the About page</p>
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

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Add Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-nss-blue mb-6 flex items-center gap-2">
                                <UserPlus className="w-5 h-5" />
                                Add New Volunteer
                            </h2>
                            
                            {error && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleAddVolunteer} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g. Sabari"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g. ECE"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-field"
                                        placeholder="e.g. +91 9876543210"
                                        required
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            <span>Add Volunteer</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Volunteers List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-nss-blue mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Current Volunteers ({featuredVolunteers.length})
                            </h2>

                            {featuredVolunteers.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No volunteers added</h3>
                                    <p className="text-gray-500">Use the form to add student volunteers to the About page.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {featuredVolunteers.map((vol) => (
                                        <div key={vol.id} className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-lg">{vol.name}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                                                        {vol.department}
                                                    </span>
                                                    <span>{vol.phone}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteVolunteer(vol.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Remove volunteer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
