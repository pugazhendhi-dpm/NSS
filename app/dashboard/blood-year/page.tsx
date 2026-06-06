'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Droplet, Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronUp, CalendarDays, Users, HeartPulse, FlaskConical } from 'lucide-react'
import {
    BloodDonationYearRecord,
    YearSummary,
    getBloodDonationYearRecords,
    addBloodDonationYearRecord,
    updateBloodDonationYearRecord,
    deleteBloodDonationYearRecord,
    groupByYear,
} from '@/lib/bloodDonationYearService'
import { hasPermission } from '@/lib/permissions'

const ACADEMIC_YEARS = ['2019-20', '2020-21', '2021-22', '2022-23', '2023-24', '2024-25', '2025-26', '2026-27']

const emptyForm = { academicYear: '', eventName: '', donationDate: '', unitsDonated: '', donorsCount: '' }

export default function BloodDonationYearPage() {
    const router = useRouter()
    const [volunteer, setVolunteer] = useState<any>(null)
    const [yearSummaries, setYearSummaries] = useState<YearSummary[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [expandedYear, setExpandedYear] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    // Add form state
    const [formData, setFormData] = useState(emptyForm)

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState(emptyForm)

    useEffect(() => {
        const volunteerData = sessionStorage.getItem('volunteer')
        if (!volunteerData) { router.push('/login'); return }
        const vol = JSON.parse(volunteerData)
        setVolunteer(vol)
        if (!hasPermission(vol.role, 'VIEW_CAMPAIGNS')) { router.push('/dashboard'); return }
        loadRecords()
    }, [router])

    const loadRecords = async () => {
        setLoading(true)
        const data = await getBloodDonationYearRecords()
        setYearSummaries(groupByYear(data))
        setLoading(false)
    }

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg)
        setErrorMsg('')
        setTimeout(() => setSuccessMsg(''), 3000)
    }

    const showError = (msg: string) => {
        setErrorMsg(msg)
        setSuccessMsg('')
    }

    // --- Add ---
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!volunteer) return
        setSubmitting(true)
        const ok = await addBloodDonationYearRecord({
            academicYear: formData.academicYear,
            eventName: formData.eventName,
            donationDate: formData.donationDate,
            unitsDonated: parseInt(formData.unitsDonated),
            donorsCount: parseInt(formData.donorsCount),
            createdBy: volunteer.name,
        })
        if (ok) { showSuccess('Record added successfully!'); setFormData(emptyForm); setShowForm(false); await loadRecords() }
        else { showError('Failed to add record. Please make sure the Supabase table exists. Check console for details.') }
        setSubmitting(false)
    }

    // --- Edit start ---
    const startEdit = (rec: BloodDonationYearRecord) => {
        setEditingId(rec.id)
        setEditData({
            academicYear: rec.academicYear,
            eventName: rec.eventName,
            donationDate: rec.donationDate,
            unitsDonated: String(rec.unitsDonated),
            donorsCount: String(rec.donorsCount),
        })
    }

    // --- Save edit ---
    const saveEdit = async (id: string) => {
        setSubmitting(true)
        const ok = await updateBloodDonationYearRecord(id, {
            academicYear: editData.academicYear,
            eventName: editData.eventName,
            donationDate: editData.donationDate,
            unitsDonated: parseInt(editData.unitsDonated),
            donorsCount: parseInt(editData.donorsCount),
        })
        if (ok) { showSuccess('Record updated successfully!'); setEditingId(null); await loadRecords() }
        else { showError('Failed to update record. Please try again.') }
        setSubmitting(false)
    }

    // --- Delete ---
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this record?')) return
        await deleteBloodDonationYearRecord(id)
        await loadRecords()
    }

    const totalUnits = yearSummaries.reduce((s, y) => s + y.totalUnits, 0)
    const totalDonors = yearSummaries.reduce((s, y) => s + y.totalDonors, 0)

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading blood donation records...</p>
            </div>
        </div>
    )

    const canManage = hasPermission(volunteer?.role, 'MANAGE_CAMPAIGNS')

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Droplet className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Blood Donation Records</h1>
                                <p className="text-red-100 text-sm">Year-wise blood donation data management</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {canManage && (
                                <button
                                    onClick={() => { setShowForm(!showForm); setEditingId(null) }}
                                    className="flex items-center gap-2 bg-white text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Record
                                </button>
                            )}
                            <button onClick={() => router.push('/dashboard')} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                                ← Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Error Message */}
                {errorMsg && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p className="text-red-700 font-semibold">❌ {errorMsg}</p>
                    </div>
                )}

                {/* Success Message */}
                {successMsg && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                        <p className="text-green-700 font-semibold">✅ {successMsg}</p>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500 flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                            <Droplet className="w-7 h-7 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Units Donated</p>
                            <p className="text-3xl font-bold text-red-600">{totalUnits}</p>
                            <p className="text-xs text-gray-400">Across all years</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500 flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Donors</p>
                            <p className="text-3xl font-bold text-blue-600">{totalDonors}</p>
                            <p className="text-xs text-gray-400">Generous volunteers</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500 flex items-center gap-4">
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                            <HeartPulse className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Lives Saved</p>
                            <p className="text-3xl font-bold text-green-600">{totalUnits * 3}</p>
                            <p className="text-xs text-gray-400">1 unit = 3 lives</p>
                        </div>
                    </div>
                </div>

                {/* Add Record Form */}
                {showForm && canManage && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-red-100">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-red-500" />
                            Add New Donation Record
                        </h2>
                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Academic Year *</label>
                                <select required value={formData.academicYear} onChange={e => setFormData({ ...formData, academicYear: e.target.value })} className="input-field">
                                    <option value="">Select Year</option>
                                    {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name *</label>
                                <input type="text" required placeholder="e.g., Annual Blood Donation Camp" value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Donation Date *</label>
                                <input type="date" required value={formData.donationDate} onChange={e => setFormData({ ...formData, donationDate: e.target.value })} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Units Donated *</label>
                                <input type="number" required min="1" placeholder="e.g., 45" value={formData.unitsDonated} onChange={e => setFormData({ ...formData, unitsDonated: e.target.value })} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Donors Count *</label>
                                <input type="number" required min="1" placeholder="e.g., 45" value={formData.donorsCount} onChange={e => setFormData({ ...formData, donorsCount: e.target.value })} className="input-field" />
                            </div>
                            <div className="flex items-end gap-2">
                                <button type="submit" disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
                                    {submitting ? 'Saving...' : '+ Add Record'}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Year-wise Records */}
                {yearSummaries.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Droplet className="w-16 h-16 text-red-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No Records Yet</h3>
                        <p className="text-gray-500">Click "Add Record" to start tracking blood donation data by year.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {yearSummaries.map(summary => (
                            <div key={summary.academicYear} className="bg-white rounded-xl shadow-md overflow-hidden">
                                {/* Year Header */}
                                <button
                                    onClick={() => setExpandedYear(expandedYear === summary.academicYear ? null : summary.academicYear)}
                                    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {summary.academicYear.slice(0, 2)}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-gray-800 text-lg">Academic Year {summary.academicYear}</p>
                                            <p className="text-sm text-gray-500">{summary.totalEvents} event{summary.totalEvents !== 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-center hidden md:block">
                                            <p className="text-xl font-bold text-red-600">{summary.totalUnits}</p>
                                            <p className="text-xs text-gray-500">Units</p>
                                        </div>
                                        <div className="text-center hidden md:block">
                                            <p className="text-xl font-bold text-blue-600">{summary.totalDonors}</p>
                                            <p className="text-xs text-gray-500">Donors</p>
                                        </div>
                                        <div className="text-center hidden md:block">
                                            <p className="text-xl font-bold text-green-600">{summary.totalUnits * 3}</p>
                                            <p className="text-xs text-gray-500">Lives Saved</p>
                                        </div>
                                        {expandedYear === summary.academicYear ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </div>
                                </button>

                                {/* Expanded Table */}
                                {expandedYear === summary.academicYear && (
                                    <div className="border-t border-gray-100">
                                        <table className="w-full text-sm">
                                            <thead className="bg-red-50">
                                                <tr>
                                                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Event</th>
                                                    <th className="text-left px-5 py-3 text-gray-600 font-semibold">Date</th>
                                                    <th className="text-center px-5 py-3 text-gray-600 font-semibold">Units</th>
                                                    <th className="text-center px-5 py-3 text-gray-600 font-semibold">Donors</th>
                                                    <th className="text-center px-5 py-3 text-gray-600 font-semibold">Lives Saved</th>
                                                    {canManage && <th className="text-center px-5 py-3 text-gray-600 font-semibold">Actions</th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {summary.records.map((rec, i) => (
                                                    editingId === rec.id ? (
                                                        /* ── EDIT ROW ── */
                                                        <tr key={rec.id} className="bg-amber-50 border-l-4 border-amber-400">
                                                            <td className="px-3 py-2">
                                                                <input type="text" value={editData.eventName} onChange={e => setEditData({ ...editData, eventName: e.target.value })} className="input-field text-sm py-1" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <input type="date" value={editData.donationDate} onChange={e => setEditData({ ...editData, donationDate: e.target.value })} className="input-field text-sm py-1" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <input type="number" min="1" value={editData.unitsDonated} onChange={e => setEditData({ ...editData, unitsDonated: e.target.value })} className="input-field text-sm py-1 text-center" />
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <input type="number" min="1" value={editData.donorsCount} onChange={e => setEditData({ ...editData, donorsCount: e.target.value })} className="input-field text-sm py-1 text-center" />
                                                            </td>
                                                            <td className="px-3 py-2 text-center text-green-600 font-bold">
                                                                {(parseInt(editData.unitsDonated) || 0) * 3}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <button onClick={() => saveEdit(rec.id)} disabled={submitting} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                                                                        <Check className="w-3.5 h-3.5" /> Save
                                                                    </button>
                                                                    <button onClick={() => setEditingId(null)} className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                                                        <X className="w-3.5 h-3.5" /> Cancel
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        /* ── VIEW ROW ── */
                                                        <tr key={rec.id} className={i % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                                            <td className="px-5 py-3 font-medium text-gray-800">{rec.eventName}</td>
                                                            <td className="px-5 py-3 text-gray-600">
                                                                <span className="flex items-center gap-1">
                                                                    <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                                                                    {new Date(rec.donationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3 text-center font-bold text-red-600">{rec.unitsDonated}</td>
                                                            <td className="px-5 py-3 text-center font-bold text-blue-600">{rec.donorsCount}</td>
                                                            <td className="px-5 py-3 text-center font-bold text-green-600">{rec.unitsDonated * 3}</td>
                                                            {canManage && (
                                                                <td className="px-5 py-3">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button onClick={() => startEdit(rec)} className="flex items-center gap-1 text-amber-500 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold">
                                                                            <Pencil className="w-3.5 h-3.5" /> Edit
                                                                        </button>
                                                                        <button onClick={() => handleDelete(rec.id)} className="flex items-center gap-1 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors text-xs font-semibold">
                                                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    )
                                                ))}
                                                {/* Year Total Row */}
                                                <tr className="bg-red-50 border-t-2 border-red-200 font-bold">
                                                    <td className="px-5 py-3 text-red-700" colSpan={2}>Year Total</td>
                                                    <td className="px-5 py-3 text-center text-red-700">{summary.totalUnits}</td>
                                                    <td className="px-5 py-3 text-center text-blue-700">{summary.totalDonors}</td>
                                                    <td className="px-5 py-3 text-center text-green-700">{summary.totalUnits * 3}</td>
                                                    {canManage && <td></td>}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
