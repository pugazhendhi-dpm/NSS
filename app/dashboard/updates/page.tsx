'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit2, Trash2, Save, X, Megaphone } from 'lucide-react'
import { Volunteer } from '@/lib/types'
import {
    getUpdates,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    subscribeToUpdates,
    Update
} from '@/lib/updatesService'

export default function UpdatesManagementPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
    const [updates, setUpdates] = useState<Update[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [newUpdateText, setNewUpdateText] = useState('')
    const [editText, setEditText] = useState('')

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) {
            router.push('/login')
        } else {
            setVolunteer(JSON.parse(volunteerData))
        }

        // Load initial updates (async)
        const loadUpdates = async () => {
            const data = await getUpdates()
            setUpdates(data)
        }
        loadUpdates()

        // Subscribe to updates changes
        const unsubscribe = subscribeToUpdates(async () => {
            const data = await getUpdates()
            setUpdates(data)
        })

        return unsubscribe
    }, [router])

    const handleAddUpdate = async () => {
        if (!newUpdateText.trim() || !volunteer) return

        await addUpdate(newUpdateText.trim(), volunteer.name)
        setNewUpdateText('')
        setIsAdding(false)
    }

    const handleEditUpdate = async (id: string) => {
        if (!editText.trim()) return

        await updateUpdate(id, editText.trim())
        setEditingId(null)
        setEditText('')
    }

    const handleDeleteUpdate = async (id: string) => {
        if (confirm('Are you sure you want to delete this update?')) {
            await deleteUpdate(id)
        }
    }

    const startEdit = (update: Update) => {
        setEditingId(update.id)
        setEditText(update.content)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditText('')
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
                            <h1 className="text-2xl font-bold">Updates Management</h1>
                            <p className="text-gray-200">Manage latest announcements on the home page</p>
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

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info Card */}
                <div className="bg-blue-50 border-l-4 border-nss-blue p-6 rounded mb-6">
                    <div className="flex items-start space-x-3">
                        <Megaphone className="w-6 h-6 text-nss-blue mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-nss-blue mb-2">About Updates</h3>
                            <p className="text-gray-700 text-sm">
                                These updates appear in the scrolling marquee on the home page. Keep them concise and
                                informative. Updates are displayed in reverse chronological order (newest first).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add New Update */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    {!isAdding ? (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Update</span>
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-nss-blue">New Update</h3>
                            <textarea
                                value={newUpdateText}
                                onChange={(e) => setNewUpdateText(e.target.value)}
                                placeholder="Enter update text (e.g., Blood Donation Camp on Jan 15th at Main Auditorium)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue resize-none"
                                rows={3}
                                maxLength={200}
                            />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    {newUpdateText.length}/200 characters
                                </span>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setIsAdding(false)
                                            setNewUpdateText('')
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddUpdate}
                                        disabled={!newUpdateText.trim()}
                                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save Update</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Updates List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-nss-blue">
                            Current Updates ({updates.length})
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            These updates are visible on the home page marquee
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {updates.length === 0 ? (
                            <div className="p-12 text-center">
                                <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No updates yet. Add your first update!</p>
                            </div>
                        ) : (
                            updates.map((update) => (
                                <div key={update.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    {editingId === update.id ? (
                                        <div className="space-y-4">
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nss-blue resize-none"
                                                rows={3}
                                                maxLength={200}
                                            />
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    {editText.length}/200 characters
                                                </span>
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                                                    >
                                                        <X className="w-4 h-4" />
                                                        <span>Cancel</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditUpdate(update.id)}
                                                        disabled={!editText.trim()}
                                                        className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                        <span>Save</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-gray-900 font-medium mb-2">{update.content}</p>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>By: {update.createdBy}</span>
                                                    <span>•</span>
                                                    <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2 ml-4">
                                                <button
                                                    onClick={() => startEdit(update)}
                                                    className="p-2 text-nss-blue hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUpdate(update.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Preview */}
                {updates.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h3 className="font-semibold text-nss-blue mb-4">Preview (How it appears on home page)</h3>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 overflow-hidden">
                            <div className="flex items-center space-x-3">
                                <Megaphone className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                <div className="overflow-hidden">
                                    <div className="animate-marquee whitespace-nowrap">
                                        {updates.map((update, index) => (
                                            <span key={update.id} className="text-yellow-900 font-medium">
                                                {update.content}
                                                {index < updates.length - 1 && (
                                                    <span className="mx-8 text-yellow-600">•</span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
