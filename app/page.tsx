import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import ImpactCounter from '@/components/home/ImpactCounter'
import UpdatesMarquee from '@/components/home/UpdatesMarquee'
import BloodDonationImpact from '@/components/home/BloodDonationImpact'
import TodaySpecialDay from '@/components/home/TodaySpecialDay'
import RecentDonorsTicker from '@/components/home/RecentDonorsTicker'

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Today's Special Day Banner */}
            <TodaySpecialDay />

            {/* Recent Donors Recognition Ticker */}
            <RecentDonorsTicker />

            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-nss-blue/90 to-nss-blue/70 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2000')] bg-cover bg-center" />

                {/* Left Logo - Kongu Engineering College */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block animate-fade-in">
                    <div className="w-64 h-64 rounded-full bg-white border-4 border-amber-400 flex items-center justify-center p-4 shadow-2xl hover:scale-105 transition-transform duration-300 overflow-hidden">
                        <Image
                            src="/images/kongu-logo.png"
                            alt="Kongu Engineering College"
                            width={220}
                            height={220}
                            quality={100}
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>

                {/* Right Logo - NSS */}
                <div className="absolute right-20 top-1/2 -translate-y-1/2 z-20 hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="w-56 h-56 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center p-6 shadow-2xl hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/images/nss-logo.png"
                            alt="National Service Scheme"
                            width={170}
                            height={170}
                            className="object-contain"
                        />
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
                        NOT ME BUT YOU
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        National Service Scheme - Serving Society Since 1969
                    </p>
                    <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '400ms' }}>
                        Join us in our mission to develop personality through community service.
                        Be the change you want to see in the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '600ms' }}>
                        <Link
                            href="/join"
                            className="bg-nss-red hover:bg-nss-red-dark text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                        >
                            <span>Join NSS Today</span>
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/about"
                            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 border-2 border-white"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                {/* Konark Wheel Decoration */}
                <div className="absolute bottom-10 right-10 w-32 h-32 opacity-20 konark-wheel-spin hidden lg:block">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
                        {[...Array(8)].map((_, i) => (
                            <line
                                key={i}
                                x1="50"
                                y1="50"
                                x2={50 + 40 * Math.cos((i * Math.PI) / 4)}
                                y2={50 + 40 * Math.sin((i * Math.PI) / 4)}
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        ))}
                    </svg>
                </div>
            </section>

            {/* Updates Marquee */}
            <UpdatesMarquee />

            {/* Impact Counter */}
            <ImpactCounter />

            {/* Blood Donation Impact */}
            <BloodDonationImpact />

            {/* About Preview */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="section-heading">About NSS</h2>
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                The National Service Scheme (NSS) was launched in 1969, during the Gandhi Centenary year,
                                with the primary objective of developing the personality of students through community service.
                            </p>
                            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                                Our motto, <span className="font-bold text-nss-red">"NOT ME BUT YOU"</span>, reflects the
                                essence of democratic living and upholds the need for selfless service and appreciation of
                                the other person's point of view.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center space-x-2 text-nss-blue hover:text-nss-red font-semibold transition-colors"
                            >
                                <span>Read Our Full Story</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                            <Image
                                src="/images/nss-hands.jpg"
                                alt="NSS Badge - National Service Scheme"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Make a Difference?
                    </h2>
                    <p className="text-xl mb-8 text-gray-100">
                        Join our community of dedicated volunteers and contribute to nation-building through service.
                    </p>
                    <Link
                        href="/join"
                        className="bg-nss-red hover:bg-nss-red-dark text-white font-bold py-4 px-10 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
                    >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
