import { Volunteer } from './types'

// Permission definitions
export const PERMISSIONS = {
    // Attendance
    VIEW_ALL_ATTENDANCE: ['admin', 'supersenior'],
    MANAGE_ATTENDANCE: ['admin'],

    // Volunteers
    VIEW_ALL_VOLUNTEERS: ['admin', 'supersenior'],
    APPROVE_VOLUNTEERS: ['admin'],

    // Campaigns
    VIEW_CAMPAIGNS: ['admin', 'supersenior'],
    MANAGE_CAMPAIGNS: ['admin'],

    // Blood Donors (accessible to all)
    ACCESS_BLOOD_DONORS: ['admin', 'supersenior', 'volunteer'],

    // Statistics
    EDIT_STATISTICS: ['admin'],

    // Activities & Gallery
    MANAGE_ACTIVITIES: ['admin'],
    MANAGE_GALLERY: ['admin'],
} as const

// Type for permission keys
export type PermissionKey = keyof typeof PERMISSIONS

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(
    userRole: Volunteer['role'],
    permissionKey: PermissionKey
): boolean {
    const allowedRoles = PERMISSIONS[permissionKey] as readonly string[]
    return allowedRoles.includes(userRole as string)
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: Volunteer['role'], route: string): boolean {
    // Remove leading slash and query params
    const cleanRoute = route.replace(/^\//, '').split('?')[0]

    // Route permission mapping
    const routePermissions: Record<string, PermissionKey> = {
        'dashboard/attendance': 'VIEW_ALL_ATTENDANCE',
        'dashboard/volunteers': 'VIEW_ALL_VOLUNTEERS',
        'dashboard/volunteers/approve': 'APPROVE_VOLUNTEERS',
        'dashboard/campaigns': 'VIEW_CAMPAIGNS',
        'dashboard/campaigns/new': 'MANAGE_CAMPAIGNS',
        'dashboard/blood-donors': 'ACCESS_BLOOD_DONORS',
        'dashboard/activities': 'MANAGE_ACTIVITIES',
        'dashboard/gallery': 'MANAGE_GALLERY',
        'dashboard/statistics': 'EDIT_STATISTICS',
    }

    const permissionKey = routePermissions[cleanRoute]
    if (!permissionKey) {
        // If route is not in the map, allow access (e.g., dashboard home)
        return true
    }

    return hasPermission(userRole, permissionKey)
}

/**
 * Get user-friendly role name
 */
export function getRoleName(role: Volunteer['role']): string {
    const roleNames: Record<Volunteer['role'], string> = {
        admin: 'Administrator',
        supersenior: 'Super Senior',
        volunteer: 'Volunteer',
    }
    return roleNames[role] || 'Unknown'
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: Volunteer['role']): string {
    const colors: Record<Volunteer['role'], string> = {
        admin: 'bg-purple-600 text-white border-purple-700',
        supersenior: 'bg-blue-600 text-white border-blue-700',
        volunteer: 'bg-green-600 text-white border-green-700',
    }
    return colors[role] || 'bg-gray-600 text-white border-gray-700'
}

/**
 * Check if user is admin
 */
export function isAdmin(role: Volunteer['role']): boolean {
    return role === 'admin'
}

/**
 * Check if user is admin or supersenior
 */
export function isSenior(role: Volunteer['role']): boolean {
    return role === 'admin' || role === 'supersenior'
}

/**
 * Get accessible menu items based on role
 */
export function getAccessibleMenuItems(role: Volunteer['role']) {
    const allMenuItems = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: 'Home',
            permission: null, // Always accessible
        },
        {
            name: 'Blood Donors',
            path: '/dashboard/blood-donors',
            icon: 'Droplet',
            permission: 'ACCESS_BLOOD_DONORS' as PermissionKey,
        },
        {
            name: 'Attendance',
            path: '/dashboard/attendance',
            icon: 'Calendar',
            permission: 'VIEW_ALL_ATTENDANCE' as PermissionKey,
        },
        {
            name: 'Volunteers',
            path: '/dashboard/volunteers',
            icon: 'Users',
            permission: 'VIEW_ALL_VOLUNTEERS' as PermissionKey,
        },
        {
            name: 'Campaigns',
            path: '/dashboard/campaigns',
            icon: 'Megaphone',
            permission: 'VIEW_CAMPAIGNS' as PermissionKey,
        },
        {
            name: 'Activities',
            path: '/dashboard/activities',
            icon: 'Activity',
            permission: 'MANAGE_ACTIVITIES' as PermissionKey,
        },
        {
            name: 'Gallery',
            path: '/dashboard/gallery',
            icon: 'Image',
            permission: 'MANAGE_GALLERY' as PermissionKey,
        },
        {
            name: 'Statistics',
            path: '/dashboard/statistics',
            icon: 'BarChart',
            permission: 'EDIT_STATISTICS' as PermissionKey,
        },
    ]

    return allMenuItems.filter(item => {
        if (!item.permission) return true
        return hasPermission(role, item.permission)
    })
}
