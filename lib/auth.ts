import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import prisma from '@/lib/db'

// Lookup user in authorized_users table
async function getAuthorizedUser(email: string) {
    try {
        const user = await prisma.authorizedUser.findUnique({
            where: { email: email.toLowerCase() }
        })
        return user
    } catch (error) {
        console.error('Error fetching authorized user:', error)
        return null
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/access-denied',
    },
    callbacks: {
        async signIn({ user }) {
            const email = user.email
            if (!email) return false

            // Must be a @kongu.edu email
            if (!email.toLowerCase().endsWith('@kongu.edu')) {
                return '/access-denied?error=domain'
            }

            // Must exist in authorized_users and be active
            const authorizedUser = await getAuthorizedUser(email)
            if (!authorizedUser) {
                return '/access-denied?error=not_authorized'
            }
            if (!authorizedUser.isActive) {
                return '/access-denied?error=inactive'
            }

            return true
        },
        async jwt({ token, user }) {
            if (user?.email) {
                const authorizedUser = await getAuthorizedUser(user.email)
                if (authorizedUser) {
                    token.role = authorizedUser.role
                    token.dbId = authorizedUser.id
                    token.dbName = authorizedUser.name
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role as string
                (session.user as any).dbId = token.dbId as string
                // Use the name from authorized_users table if available
                if (token.dbName) {
                    session.user.name = token.dbName as string
                }
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
