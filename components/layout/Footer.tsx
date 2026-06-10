import Link from 'next/link'
import { Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-nss-blue text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">NSS KEC</h3>
                        <p className="text-gray-200 mb-4">
                            National Service Scheme - A flagship public service program by the Government of India.
                            Launched in 1969 during Gandhi Centenary Year.
                        </p>
                        <p className="text-xl font-semibold text-nss-red mb-5">
                            "NOT ME BUT YOU"
                        </p>
                        {/* Social Icons */}
                        <div className="flex items-center gap-3 leading-none">
                            <a href="https://x.com/nss_kec1?s=09" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                                className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                                <svg className="w-7 h-7 shrink-0" fill="white" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/nsskec/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                                className="w-14 h-14 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                                style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
                                <svg className="w-7 h-7 shrink-0" fill="white" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="http://www.youtube.com/@NSSKEC" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                                className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                                <svg className="w-7 h-7 shrink-0" fill="white" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-200 hover:text-nss-red transition-colors">
                                    About NSS
                                </Link>
                            </li>
                            <li>
                                <Link href="/activities" className="text-gray-200 hover:text-nss-red transition-colors">
                                    Our Activities
                                </Link>
                            </li>
                            <li>
                                <Link href="/join" className="text-gray-200 hover:text-nss-red transition-colors">
                                    Join Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="text-gray-200 hover:text-nss-red transition-colors">
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex flex-col space-y-2">
                                <div className="flex items-start space-x-2">
                                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                                    <span className="text-gray-200">
                                        Kongu Engineering College,<br />
                                        Perundurai, Erode - 638052,<br />
                                        Tamil Nadu, India
                                    </span>
                                </div>
                                <div className="w-full h-32 rounded-lg overflow-hidden mt-2 border border-white/10 shadow-inner">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.188737525381!2d77.60447331533261!3d11.27218699198642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba96d7810fe32d5%3A0x85cf49c5b26fb72e!2sKongu%20Engineering%20College!5e0!3m2!1sen!2sin!4v1689311651859!5m2!1sen!2sin"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </li>
                            <li className="flex items-start space-x-2">
                                <ExternalLink className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <a
                                    href="https://kongu.ac.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-200 hover:text-nss-red transition-colors"
                                >
                                    kongu.ac.in
                                </a>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <a href="mailto:nsskec@kongu.ac.in" className="text-gray-200 hover:text-nss-red transition-colors">
                                    nsskec@kongu.ac.in
                                </a>
                            </li>
                            <li className="flex items-start space-x-2">
                                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-200 space-y-1">
                                    <p className="font-semibold text-white">Program Officers:</p>
                                    <p>Unit I: Dr. A. Manimaran<br />
                                        <a href="tel:+919965398712" className="hover:text-nss-red transition-colors">9965398712</a></p>
                                    <p>Unit II: Dr. K.S. Navaneethan<br />
                                        <a href="tel:+918056554879" className="hover:text-nss-red transition-colors">8056554879</a></p>
                                    <p>Unit III (SFU): Ms. K. Suvalakshmi<br />
                                        <a href="tel:+919384538700" className="hover:text-nss-red transition-colors">9384538700</a></p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Feedback Section */}
                    <div className="col-span-1 md:col-span-4 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                            <h4 className="text-sm font-semibold mb-2">Have Feedback?</h4>
                            <p className="text-xs text-gray-300 mb-3">Help us improve! Share suggestions or report issues.</p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <a
                                    href="mailto:nsskec@kongu.ac.in?subject=NSS%20Website%20Feedback"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center space-x-1 bg-white text-nss-blue px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    <Mail className="w-3 h-3" />
                                    <span>Email Feedback</span>
                                </a>
                                <a
                                    href="tel:+919965398712"
                                    className="inline-flex items-center justify-center space-x-1 bg-nss-red text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-nss-red-dark transition-colors"
                                >
                                    <Phone className="w-3 h-3" />
                                    <span>Call Officer</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-600 mt-8 pt-8">
                    <div className="flex justify-center">
                        <div className="text-center md:text-right">
                            <p className="text-gray-200 text-sm">
                                © {currentYear} National Service Scheme - Kongu Engineering College. All Rights Reserved.
                            </p>
                            <p className="text-gray-300 text-xs mt-1">
                                Affiliated to Anna University, Chennai | Accredited with NAAC A++
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
