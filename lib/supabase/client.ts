import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file.'
    )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Database types
export interface Database {
    public: {
        Tables: {
            activities: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    category: 'Regular Activities' | 'Special Camps'
                    date: string
                    location: string | null
                    participants: number
                    image_url: string | null
                    created_at: string
                    created_by: string | null
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['activities']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['activities']['Insert']>
            }
            gallery: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    image_url: string
                    category: string | null
                    uploaded_at: string
                    uploaded_by: string | null
                }
                Insert: Omit<Database['public']['Tables']['gallery']['Row'], 'id' | 'uploaded_at'>
                Update: Partial<Database['public']['Tables']['gallery']['Insert']>
            }
            statistics: {
                Row: {
                    id: string
                    volunteers_enrolled: number
                    hours_of_service: number
                    blood_units_donated: number
                    villages_adopted: number
                    last_updated: string
                    last_updated_by: string | null
                }
                Insert: Omit<Database['public']['Tables']['statistics']['Row'], 'id' | 'last_updated'>
                Update: Partial<Database['public']['Tables']['statistics']['Insert']>
            }
            updates: {
                Row: {
                    id: string
                    content: string
                    created_at: string
                    created_by: string | null
                }
                Insert: Omit<Database['public']['Tables']['updates']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['updates']['Insert']>
            }
            volunteers: {
                Row: {
                    id: string
                    name: string
                    email: string
                    roll_number: string
                    department: string | null
                    year: number | null
                    phone: string | null
                    role: 'volunteer' | 'supersenior' | 'admin'
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['volunteers']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['volunteers']['Insert']>
            }
            blood_donors: {
                Row: {
                    id: string
                    name: string
                    blood_group: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
                    phone: string
                    email: string | null
                    age: number | null
                    gender: 'Male' | 'Female' | 'Other' | null
                    address: string | null
                    last_donation_date: string | null
                    is_available: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['blood_donors']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['blood_donors']['Insert']>
            }
        }
    }
}

// Export typed client
export type SupabaseClient = typeof supabase
