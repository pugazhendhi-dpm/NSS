// Department list for the college
export const DEPARTMENTS = [
    'Artificial Intelligence & Data Science (AIDS)',
    'Artificial Intelligence & Machine Learning (AIML)',
    'Automobile Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Computer Science & Engineering (CSE)',
    'Computer Science & Design (CSD)',
    'Computer Technology (CT)',
    'Electrical & Electronics Engineering (EEE)',
    'Electronics & Communication Engineering (ECE)',
    'Electronics & Instrumentation Engineering (EIE)',
    'Information Technology (IT)',
    'Mechanical Engineering',
    'Mechatronics Engineering',
] as const

export type Department = typeof DEPARTMENTS[number]

// Year of study
export const YEARS = ['1st', '2nd', '3rd', '4th', '5th'] as const
export type Year = typeof YEARS[number]

// Sections
export const SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
export type Section = typeof SECTIONS[number]

// Extended blood groups including A1, A2 variants
export const EXTENDED_BLOOD_GROUPS = [
    'O Positive (O+)',
    'O Negative (O-)',
    'A Positive (A+)',
    'A Negative (A-)',
    'B Positive (B+)',
    'B Negative (B-)',
    'AB Positive (AB+)',
    'AB Negative (AB-)',
    'A1 Positive (A1+)',
    'A1 Negative (A1-)',
    'A2 Positive (A2+)',
    'A2 Negative (A2-)',
    'A1B Positive (A1B+)',
    'A1B Negative (A1B-)',
    'A2B Positive (A2B+)',
    'A2B Negative (A2B-)',
    'Others',
] as const

export type ExtendedBloodGroup = typeof EXTENDED_BLOOD_GROUPS[number]

// Tamil Nadu Districts
export const TN_DISTRICTS = [
    'Ariyalur',
    'Chengalpattu',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kallakurichi',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Krishnagiri',
    'Madurai',
    'Mayiladuthurai',
    'Nagapattinam',
    'Namakkal',
    'Nilgiris',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Ranipet',
    'Salem',
    'Sivaganga',
    'Tenkasi',
    'Thanjavur',
    'Theni',
    'Thoothukudi',
    'Tiruchirappalli',
    'Tirunelveli',
    'Tirupathur',
    'Tiruppur',
    'Tiruvallur',
    'Tiruvannamalai',
    'Tiruvarur',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
] as const

export type TNDistrict = typeof TN_DISTRICTS[number]

// Major towns/cities by district (sample data - can be expanded)
export const TN_TOWNS_BY_DISTRICT: Record<string, string[]> = {
    Chennai: ['Adyar', 'Anna Nagar', 'Guindy', 'Mylapore', 'T. Nagar', 'Velachery'],
    Coimbatore: ['Gandhipuram', 'Peelamedu', 'RS Puram', 'Saibaba Colony', 'Singanallur'],
    Madurai: ['Anna Nagar', 'KK Nagar', 'Pasumalai', 'Tallakulam', 'Thiruparankundram'],
    Salem: ['Ammapet', 'Fairlands', 'Hasthampatti', 'Shevapet', 'Suramangalam'],
    Tiruchirappalli: ['Cantonment', 'KK Nagar', 'Srirangam', 'Thillai Nagar', 'Woraiyur'],
    Tirunelveli: ['Melapalayam', 'Palayamkottai', 'Pettai', 'Town'],
    Vellore: ['Gandhi Nagar', 'Katpadi', 'Sathuvachari', 'Thorapadi'],
    Erode: ['Perundurai', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam'],
    Kanchipuram: ['Chengalpattu', 'Mahabalipuram', 'Sriperumbudur', 'Tambaram'],
    Thanjavur: ['Kumbakonam', 'Mayiladuthurai', 'Papanasam', 'Pattukkottai'],
    // Add more as needed
}

// Gender options
export const GENDERS = ['Male', 'Female', 'Other'] as const
export type Gender = typeof GENDERS[number]

// Residential status
export const RESIDENTIAL_STATUS = ['Hostel', 'Day Scholar'] as const
export type ResidentialStatus = typeof RESIDENTIAL_STATUS[number]
