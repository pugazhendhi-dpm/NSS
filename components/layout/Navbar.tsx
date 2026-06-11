'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/activities', label: 'Activities' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/resources', label: 'Resources' },
        { href: '/register-donor', label: 'Register as Donor' },
    ]

    useEffect(() => {
        // Check if volunteer is logged in
        const checkLoginStatus = () => {
            const volunteerData = sessionStorage.getItem('volunteer')
            setIsLoggedIn(!!volunteerData)
        }

        checkLoginStatus()

        // Listen for storage changes (in case user logs in/out in another tab)
        window.addEventListener('storage', checkLoginStatus)

        // Listen for custom login state change event (same tab)
        window.addEventListener('loginStateChanged', checkLoginStatus)

        return () => {
            window.removeEventListener('storage', checkLoginStatus)
            window.removeEventListener('loginStateChanged', checkLoginStatus)
        }
    }, [])

    const handleLogout = () => {
        sessionStorage.removeItem('volunteer')
        setIsLoggedIn(false)
        window.dispatchEvent(new Event('loginStateChanged'))
        router.push('/')
    }

    return (
        <nav className="bg-nss-blue text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform">
                            <Image
                                src="/images/nss-logo.png"
                                alt="NSS Logo"
                                width={56}
                                height={56}
                                className="object-contain"
                            />
                        </div>
                        <div className="hidden md:block">
                            <div className="text-xl font-bold">NSS KEC</div>
                            <div className="text-xs text-gray-200">Not Me But You</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks
                            .filter(link => {
                                // Hide "Register as Donor" when logged in
                                if (isLoggedIn && link.href === '/register-donor') return false
                                return true
                            })
                            .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="hover:text-nss-red transition-colors duration-200 font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        {!isLoggedIn && (
                            <Link
                                href="/join"
                                className="bg-nss-red hover:bg-nss-red-dark px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                Join NSS
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 border-white"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 border-white flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="border-2 border-white hover:bg-white hover:text-nss-blue px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-nss-blue-dark transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col space-y-3">
                            {navLinks
                                .filter(link => {
                                    // Hide "Register as Donor" when logged in
                                    if (isLoggedIn && link.href === '/register-donor') return false
                                    return true
                                })
                                .map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="hover:text-nss-red transition-colors duration-200 py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            {!isLoggedIn && (
                                <Link
                                    href="/join"
                                    className="bg-nss-red hover:bg-nss-red-dark px-4 py-2 rounded-lg font-semibold text-center transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Join NSS
                                </Link>
                            )}
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="border-2 border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold text-center transition-all duration-200"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout()
                                            setIsOpen(false)
                                        }}
                                        className="border-2 border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold text-center transition-all duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="border-2 border-gray-300 hover:bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-semibold text-center transition-all duration-200"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
