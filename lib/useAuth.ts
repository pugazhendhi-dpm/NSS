'use client'

import { useSession } from 'next-auth/react'

export interface AuthUser {
    name: string
    email: string
    role: 'admin' | 'supersenior'
    dbId: string
    image?: string | null
}

export function useAuth() {
    const { data: session, status } = useSession()

    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated' && !!session?.user

    const user: AuthUser | null = isAuthenticated
        ? {
              name: session!.user!.name || 'Unknown',
              email: session!.user!.email || '',
              role: (session!.user as any)?.role || 'supersenior',
              dbId: (session!.user as any)?.dbId || '',
              image: session!.user!.image,
          }
        : null

    return {
        user,
        isLoading,
        isAuthenticated,
        role: user?.role || null,
        session,
    }
}
