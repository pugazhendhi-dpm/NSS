// Mock data for demonstration - Replace with Supabase in production
import { Donor, CallLog, Volunteer, DetailedDonor } from './types'

// Mock volunteers database
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
    {
        id: '3',
        name: 'Regular Volunteer',
        email: 'volunteer@college.edu',
        rollNumber: '2024ME020',
        department: 'Mechanical Engineering',
        year: '2nd',
        bloodGroup: 'B+',
        phone: '98765 43212',
        skills: ['First Aid', 'Teaching'],
        role: 'volunteer',
        createdAt: new Date('2024-08-01'),
        isApproved: true,
    },
]

// Mock donors database with detailed information matching registration form
export const mockDonors: DetailedDonor[] = [
    {
        id: 'd1',
        name: 'Amit Patel',
        email: 'amit.patel@college.edu',
        rollNumber: '2024CSE025',
        age: 20,
        department: 'Computer Science & Engineering (CSE)',
        year: '2nd',
        section: 'A',
        gender: 'Male',
        bloodGroup: 'O Positive (O+)',
        phone: '98765 11111',
        alternatePhone: '98765 11112',
        district: 'Chennai',
        hometown: 'Adyar',
        address: '123 Main Street, Adyar, Chennai - 600020',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Hostel',
        lastDonatedAt: null,
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd2',
        name: 'Sneha Reddy',
        email: 'sneha.reddy@college.edu',
        rollNumber: '2024ECE042',
        age: 19,
        department: 'Electronics & Communication Engineering (ECE)',
        year: '2nd',
        section: 'B',
        gender: 'Female',
        bloodGroup: 'A Positive (A+)',
        phone: '98765 22222',
        alternatePhone: '98765 22223',
        district: 'Coimbatore',
        hometown: 'Gandhipuram',
        address: '456 Park Avenue, Gandhipuram, Coimbatore - 641012',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Day Scholar',
        lastDonatedAt: new Date('2025-10-15'),
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd3',
        name: 'Vikram Singh',
        email: 'vikram.singh@college.edu',
        rollNumber: '2023ME018',
        age: 21,
        department: 'Mechanical Engineering',
        year: '3rd',
        section: 'A',
        gender: 'Male',
        bloodGroup: 'B Positive (B+)',
        phone: '98765 33333',
        district: 'Madurai',
        hometown: 'Anna Nagar',
        address: '789 College Road, Anna Nagar, Madurai - 625020',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Hostel',
        lastDonatedAt: null,
        lastCalledAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastCalledBy: 'Rahul Kumar',
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd4',
        name: 'Anjali Gupta',
        email: 'anjali.gupta@college.edu',
        rollNumber: '2024CE055',
        age: 19,
        department: 'Civil Engineering',
        year: '2nd',
        section: 'C',
        gender: 'Female',
        bloodGroup: 'O Positive (O+)',
        phone: '98765 44444',
        district: 'Salem',
        hometown: 'Fairlands',
        address: '321 Temple Street, Fairlands, Salem - 636016',
        bloodDonationWillingness: 'Maybe',
        residentialStatus: 'Day Scholar',
        lastDonatedAt: null,
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd5',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@college.edu',
        rollNumber: '2024AIDS012',
        age: 20,
        department: 'Artificial Intelligence & Data Science (AIDS)',
        year: '2nd',
        section: 'A',
        gender: 'Male',
        bloodGroup: 'AB Positive (AB+)',
        phone: '98765 55555',
        district: 'Tiruchirappalli',
        hometown: 'Srirangam',
        address: '567 Market Street, Srirangam, Trichy - 620006',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Hostel',
        lastDonatedAt: null,
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd6',
        name: 'Meera Joshi',
        email: 'meera.joshi@college.edu',
        rollNumber: '2024EEE028',
        age: 19,
        department: 'Electrical & Electronics Engineering (EEE)',
        year: '2nd',
        section: 'B',
        gender: 'Female',
        bloodGroup: 'A1 Positive (A1+)',
        phone: '98765 66666',
        district: 'Vellore',
        hometown: 'Katpadi',
        address: '890 Station Road, Katpadi, Vellore - 632007',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Hostel',
        lastDonatedAt: null,
        lastCalledAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
        lastCalledBy: 'Priya Sharma',
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd7',
        name: 'Karan Malhotra',
        email: 'karan.malhotra@college.edu',
        rollNumber: '2023IT045',
        age: 21,
        department: 'Information Technology (IT)',
        year: '3rd',
        section: 'A',
        gender: 'Male',
        bloodGroup: 'O Negative (O-)',
        phone: '98765 77777',
        district: 'Erode',
        hometown: 'Perundurai',
        address: '234 Bus Stand Road, Perundurai, Erode - 638052',
        bloodDonationWillingness: 'Yes',
        residentialStatus: 'Day Scholar',
        lastDonatedAt: null,
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
    {
        id: 'd8',
        name: 'Divya Nair',
        email: 'divya.nair@college.edu',
        rollNumber: '2024CHEM019',
        age: 19,
        department: 'Chemical Engineering',
        year: '2nd',
        section: 'A',
        gender: 'Female',
        bloodGroup: 'B Positive (B+)',
        phone: '98765 88888',
        district: 'Kanchipuram',
        hometown: 'Tambaram',
        address: '678 East Street, Tambaram, Chennai - 600045',
        bloodDonationWillingness: 'Maybe',
        residentialStatus: 'Hostel',
        lastDonatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        lastCalledAt: null,
        lastCalledBy: null,
        isAvailable: true,
        createdAt: new Date('2024-08-01'),
    },
]

// Mock call logs
export const mockCallLogs: CallLog[] = []

// Mock authentication function
export async function authenticateVolunteer(email: string, password: string): Promise<Volunteer | null> {
    // In production, this would verify against Supabase
    // For demo: accept any email from mockVolunteers with password "nss"
    if (password === 'nss') {
        const volunteer = mockVolunteers.find((v) => v.email === email)
        return volunteer || null
    }
    return null
}

// Mock function to get all donors
export async function getDonors(): Promise<DetailedDonor[]> {
    return mockDonors
}

// Mock function to log a call
export async function logCall(donorId: string, volunteerId: string, volunteerName: string): Promise<void> {
    const donor = mockDonors.find((d) => d.id === donorId)
    if (donor) {
        donor.lastCalledAt = new Date()
        donor.lastCalledBy = volunteerName
    }

    mockCallLogs.push({
        id: `log-${Date.now()}`,
        donorId,
        volunteerId,
        volunteerName,
        calledAt: new Date(),
        result: 'pending',
    })
}

// Mock function to update call result
export async function updateCallResult(
    donorId: string,
    result: 'agreed' | 'declined' | 'no_answer',
    notes?: string
): Promise<void> {
    const log = mockCallLogs.find((l) => l.donorId === donorId)
    if (log) {
        log.result = result
        log.notes = notes
    }

    // If agreed, update last donated date
    if (result === 'agreed') {
        const donor = mockDonors.find((d) => d.id === donorId)
        if (donor) {
            donor.lastDonatedAt = new Date()
        }
    }
}
