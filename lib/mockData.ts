// Login credentials for NSS Volunteers
// Only authenticateVolunteer is used in production - by app/login/page.tsx
import { Volunteer } from './types'

// Volunteer accounts for login
// Note: In a future upgrade, this should be replaced with Supabase Auth.
export const mockVolunteers: Volunteer[] = [
    {
        id: '1',
        name: 'Admin User',
        email: 'nsskec@kongu.edu',
        rollNumber: '2024CSE001',
        department: 'Computer Science & Engineering (CSE)',
        year: '4th',
        bloodGroup: 'O+',
        phone: '98765 43210',
        skills: ['System Administration', 'Leadership'],
        role: 'admin',
        createdAt: new Date('2024-08-01'),
        isApproved: true,
    },
    {
        id: '2',
        name: 'Super Senior',
        email: 'supersenior@kongu.edu',
        rollNumber: '2024ECE015',
        department: 'Electronics & Communication Engineering (ECE)',
        year: '3rd',
        bloodGroup: 'A+',
        phone: '98765 43211',
        skills: ['Event Management', 'Coordination'],
        role: 'supersenior',
        createdAt: new Date('2024-08-01'),
        isApproved: true,
    },
]

// Authenticate a volunteer by email and password
// Admin password: configured separately; supersenior password: 'nss'
export async function authenticateVolunteer(email: string, password: string): Promise<Volunteer | null> {
    const volunteer = mockVolunteers.find((v) => v.email === email)
    if (!volunteer) return null

    if (volunteer.role === 'admin' && password === 'pugazh') return volunteer
    if (volunteer.role !== 'admin' && password === 'nss') return volunteer

    return null
}
