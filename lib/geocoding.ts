/**
 * Geocoding and Location Services
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'
const USER_AGENT = 'NSS-Blood-Donor-Platform/1.0'

// Rate limiting: Nominatim allows 1 request per second
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1000 // 1 second

/**
 * Sleep function for rate limiting
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Ensure rate limit compliance
 */
async function enforceRateLimit(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
    }

    lastRequestTime = Date.now()
}

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(address: string): Promise<{
    lat: number
    lon: number
    displayName: string
} | null> {
    try {
        await enforceRateLimit()

        const params = new URLSearchParams({
            q: address,
            format: 'json',
            limit: '1',
            countrycodes: 'in', // Restrict to India
        })

        const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
            headers: {
                'User-Agent': USER_AGENT,
            },
        })

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            }
        }

        return null
    } catch (error) {
        console.error('Geocoding error:', error)
        return null
    }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lon: number): Promise<{
    address: string
    city?: string
    state?: string
    country?: string
} | null> {
    try {
        await enforceRateLimit()

        const params = new URLSearchParams({
            lat: lat.toString(),
            lon: lon.toString(),
            format: 'json',
        })

        const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
            headers: {
                'User-Agent': USER_AGENT,
            },
        })

        if (!response.ok) {
            throw new Error(`Reverse geocoding failed: ${response.statusText}`)
        }

        const data = await response.json()

        if (data && data.display_name) {
            return {
                address: data.display_name,
                city: data.address?.city || data.address?.town || data.address?.village,
                state: data.address?.state,
                country: data.address?.country,
            }
        }

        return null
    } catch (error) {
        console.error('Reverse geocoding error:', error)
        return null
    }
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371 // Earth's radius in kilometers

    const toRad = (degrees: number) => degrees * (Math.PI / 180)

    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

/**
 * Filter donors within a radius from a center point
 */
export function filterDonorsInRadius<T extends { latitude?: number | null; longitude?: number | null }>(
    donors: T[],
    centerLat: number,
    centerLon: number,
    radiusKm: number
): (T & { distance: number })[] {
    return donors
        .filter(donor => donor.latitude != null && donor.longitude != null)
        .map(donor => ({
            ...donor,
            distance: calculateDistance(
                centerLat,
                centerLon,
                donor.latitude!,
                donor.longitude!
            ),
        }))
        .filter(donor => donor.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance)
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} meters`
    }
    return `${km.toFixed(1)} km`
}

/**
 * Get Google Maps directions URL
 */
export function getDirectionsUrl(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
): string {
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLon}&destination=${toLat},${toLon}`
}

/**
 * Batch geocode multiple addresses with rate limiting
 */
export async function batchGeocode(
    addresses: { id: string; address: string }[],
    onProgress?: (completed: number, total: number) => void
): Promise<Map<string, { lat: number; lon: number }>> {
    const results = new Map<string, { lat: number; lon: number }>()

    for (let i = 0; i < addresses.length; i++) {
        const { id, address } = addresses[i]
        const coords = await geocodeAddress(address)

        if (coords) {
            results.set(id, { lat: coords.lat, lon: coords.lon })
        }

        if (onProgress) {
            onProgress(i + 1, addresses.length)
        }
    }

    return results
}
