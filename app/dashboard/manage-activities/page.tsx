'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/useAuth'
import { Plus, Edit2, Trash2, Save, X, Calendar, MapPin, Users as UsersIcon } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import {
    getActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    subscribeToActivities,
    Activity,
} from '@/lib/activitiesService'

export default function ActivitiesManagementPage() {
    const router = useRouter()
    const { user } = useAuth()
    const volunteer = user ? { id: user.dbId, name: user.name, email: user.email, role: user.role } as any : null
    const [activities, setActivities] = useState<Activity[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Sustainable Initiatives' as 'Sustainable Initiatives' | 'Special Camps',
        date: '',
        location: '',
        participants: 0,
        documentUrl: '',
    })

    useEffect(() => {
        // Load activities (async)
        const loadActivities = async () => {
            const data = await getActivities()
            setActivities(data)
        }
        loadActivities()

        // Subscribe to changes
        const unsubscribe = subscribeToActivities(async () => {
            const data = await getActivities()
            setActivities(data)
        })

        return unsubscribe
    }, [router])

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'Sustainable Initiatives',
            date: '',
            location: '',
            participants: 0,
            documentUrl: '',
        })
    }

    const handleAdd = async () => {
        if (!volunteer || !formData.title || !formData.date) return

        await addActivity(
            formData.title,
            formData.description,
            formData.category,
            new Date(formData.date),
            formData.location,
            formData.participants,
            undefined, // imageUrl
            formData.documentUrl || undefined,
            volunteer.name
        )

        resetForm()
        setIsAdding(false)
    }

    const handleEdit = async (id: string) => {
        if (!formData.title || !formData.date) return

        await updateActivity(
            id,
            formData.title,
            formData.description,
            formData.category,
            new Date(formData.date),
            formData.location,
            formData.participants,
            undefined, // imageUrl
            formData.documentUrl || undefined
        )

        resetForm()
        setEditingId(null)
    }

    const startEdit = (activity: Activity) => {
        setEditingId(activity.id)
        setFormData({
            title: activity.title,
            description: activity.description,
            category: activity.category,
            date: activity.date.toISOString().split('T')[0],
            location: activity.location,
            participants: activity.participants,
            documentUrl: activity.documentUrl || '',
        })
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this activity?')) {
            await deleteActivity(id)
        }
    }

    if (!volunteer) {
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
                            <h1 className="text-2xl font-bold">Activities Management</h1>
                            <p className="text-gray-200">Add and manage NSS activities</p>
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Activity Button */}
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="btn-primary mb-6 flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Activity</span>
                    </button>
                )}

                {/* Add/Edit Form */}
                {(isAdding || editingId) && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="font-semibold text-nss-blue mb-4">
                            {isAdding ? 'New Activity' : 'Edit Activity'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Blood Donation Camp"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field resize-none"
                                    rows={3}
                                    placeholder="Brief description of the activity"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value as 'Sustainable Initiatives' | 'Special Camps',
                                        })
                                    }
                                    className="input-field"
                                >
                                    <option value="Sustainable Initiatives">Sustainable Initiatives</option>
                                    <option value="Special Camps">Special Camps</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Main Auditorium"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                                <input
                                    type="number"
                                    value={formData.participants}
                                    onChange={(e) =>
                                        setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })
                                    }
                                    className="input-field"
                                    min="0"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Document URL (Google Drive Link)</label>
                                <input
                                    type="url"
                                    value={formData.documentUrl}
                                    onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                                    className="input-field"
                                    placeholder="https://drive.google.com/file/d/.../view"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={() => {
                                    resetForm()
                                    setIsAdding(false)
                                    setEditingId(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => (editingId ? handleEdit(editingId) : handleAdd())}
                                disabled={!formData.title || !formData.date}
                                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{editingId ? 'Update' : 'Add'} Activity</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Activities List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activities.map((activity) => (
                        <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-nss-blue">{activity.title}</h3>
                                    <span className="px-3 py-1 bg-nss-blue/10 text-nss-blue text-xs font-semibold rounded-full">
                                        {activity.category}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">{activity.description}</p>

                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{activity.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <UsersIcon className="w-4 h-4" />
                                        <span>{activity.participants} participants</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-xs text-gray-400">By: {activity.createdBy}</span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEdit(activity)}
                                            className="p-2 text-nss-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activity.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activities.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No activities yet. Add your first activity!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
