import { Department, Year, Section, ExtendedBloodGroup, TNDistrict, Gender, ResidentialStatus } from './constants'

export interface Volunteer {
    id: string
    name: string
    email: string
    rollNumber: string
    department: Department
    year: Year
    bloodGroup: string
    phone?: string
    skills?: string[]
    role: 'volunteer' | 'supersenior' | 'admin'
    createdAt: Date
    isApproved?: boolean
    approvedBy?: string
    approvedAt?: Date
}

export interface DetailedDonor {
    id: string
    name: string
    email: string
    rollNumber: string
    age: number
    department: Department
    year: Year
    section: Section
    gender: Gender
    bloodGroup: ExtendedBloodGroup
    phone: string
    alternatePhone?: string
    district: TNDistrict | string
    hometown: string
    address: string
    bloodDonationWillingness: 'Yes' | 'No' | 'Maybe'
    residentialStatus: ResidentialStatus
    lastDonatedAt: Date | null
    lastCalledAt: Date | null
    lastCalledBy: string | null
    isAvailable: boolean
    latitude?: number | null
    longitude?: number | null
    createdAt: Date
}

// Legacy Donor interface for backward compatibility
export interface Donor {
    id: string
    name: string
    department: string
    bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-'
    phone: string
    lastDonatedAt: Date | null
    lastCalledAt: Date | null
    lastCalledBy: string | null
    medicalNotes?: string
    isAvailable: boolean
}

export interface CallLog {
    id: string
    donorId: string
    volunteerId: string
    volunteerName: string
    calledAt: Date
    result?: 'agreed' | 'declined' | 'no_answer' | 'pending'
    notes?: string
}

export interface Activity {
    id: string
    title: string
    description: string
    date: Date
    type: 'regular' | 'special_camp'
    imageUrl?: string
    participantCount?: number
    hoursContributed?: number
}

export interface ImpactStats {
    totalVolunteers: number
    hoursServed: number
    bloodUnitsCollected: number
    villagesAdopted: number
}

export interface AttendanceRecord {
    id: string
    volunteerId: string
    volunteerName: string
    date: Date
    activityName: string
    status: 'present' | 'absent' | 'late'
    markedBy: string
    notes?: string
}

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] as const

export type BloodGroup = typeof BLOOD_GROUPS[number]
