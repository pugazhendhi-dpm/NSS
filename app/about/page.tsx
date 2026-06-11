'use client'

import { useState } from 'react'
import { Target, Users, Flag, Award, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'

const volunteers = [
    { name: "Sabari", dept: "ECE", phone: "9361358813" },
    { name: "Kabil", dept: "EEE", phone: "9361090547" },
    { name: "Manoj", dept: "EEE", phone: "8903026773" },
    { name: "Hari Prasanna", dept: "EIE", phone: "8940374065" },
    { name: "Santhosh", dept: "AIML", phone: "7502833715" }
];

export default function AboutPage() {
    const [showVolunteers, setShowVolunteers] = useState(false)
    const milestones = [
        'To achieve greater heights of success in educating and uplifting the standard of society to a considerable extent around the area of Erode.',
        'To raise up for the best NSS team for social service',
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About NSS</h1>
                    <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                        Serving the nation through community service since 1969
                    </p>
                </div>
            </section>

            {/* About NSS Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-heading text-center">About NSS</h2>
                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
                        <p>
                            The National Service Scheme is an Indian government – sponsored public service program conducted by the Ministry of Youth Affairs and Sports of the Government of India. National Service Scheme (NSS) in Kongu Engineering College was started in the academic year <strong>1985-1986</strong>. The scheme was started with an intension to seed the nature of helping tendency within the youth society. Started with the strength of few volunteers, now the tree of NSS has reached to about <strong>1800 volunteers</strong> in the current academic year 2026-2027. The roots of service have spread its extent to a larger space and cherished the needy.
                        </p>
                        <p>
                            The NSS has been organizing many activities like campus cleaning, awareness programs, blood camp, health check-up and rally on different issues. Added to it, we have been conducting a national level technical symposium "Prasidhi" to reveal the technical issues that could solve social issues. Apart from it, we also conduct special camps in which we adept a village in and around Erode and help them with their basic needs. We educate school student in streams like abacus, computer usage, making craft works, yoga and games. A few awareness programs are also conducted for the villager as well as school children.
                        </p>
                        <p className="bg-gray-50 border-l-4 border-nss-blue p-4 rounded">
                            The role of N.S.S. becomes very important in this context as constitution of India also envisages that it is fundamental duty of every citizen to protect and improve the natural environment. NSS benefits both students as well as the society. It shapes the students for a better youth society. It seeds the nature of humanity in the young minds and enriches the nature of environment around them.
                        </p>
                    </div>
                </div>
            </section>

            {/* The Badge Section */}
            <section className="pt-4 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-heading text-center">The NSS Badge</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="flex justify-center">
                            <div className="w-[480px] h-[480px] relative bg-white rounded-full p-8 shadow-2xl">
                                <Image
                                    src="/images/nss-logo.png"
                                    alt="NSS Badge"
                                    width={480}
                                    height={480}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-nss-blue mb-6">The Konark Wheel</h3>
                            <div className="space-y-4 text-gray-700 text-lg">
                                <p>
                                    The NSS badge is based on the <strong>Rath Wheel of the Konark Sun Temple</strong>
                                    located in Odisha, India. The wheel signifies the progressive cycle of life, creation,
                                    and movement.
                                </p>
                                <div className="bg-nss-blue/10 border-l-4 border-nss-blue p-4 rounded">
                                    <p className="font-semibold text-nss-blue mb-2">The 8 Bars</p>
                                    <p>
                                        The wheel has 8 bars which represent the 24 hours of the day. This signifies that
                                        an NSS volunteer is ready for service at any time - morning, afternoon, or night.
                                    </p>
                                </div>
                                <div className="bg-nss-red/10 border-l-4 border-nss-red p-4 rounded">
                                    <p className="font-semibold text-nss-red mb-2">The Colors</p>
                                    <p>
                                        <strong>Red:</strong> Symbolizes the lively blood of youth and their high spirit.<br />
                                        <strong>Blue:</strong> Represents the cosmos, of which the NSS is a tiny part,
                                        ready to contribute its share for the welfare of mankind.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Organizational Structure */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-heading text-center">Our Team</h2>
                    <div className="bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg shadow-lg p-8">
                        <div className="space-y-6">
                            <div className="text-center pb-6 border-b border-blue-200">
                                <div className="flex justify-center mb-4">
                                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-nss-blue shadow-lg bg-white">
                                        <Image
                                            src="/images/principal.jpg"
                                            alt="Dr. Parameshwaran R"
                                            width={192}
                                            height={192}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-nss-blue">Principal</h3>
                                <p className="text-gray-700 font-semibold mt-2">Dr. Parameshwaran R</p>
                                <p className="text-gray-600 text-sm">Chief Patron</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-nss-blue text-center mb-4">Programme Officers</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-center mb-3">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-nss-blue shadow-lg bg-white">
                                                <Image
                                                    src="/images/officer-unit1.jpg"
                                                    alt="Dr. A. Manimaran"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover object-top w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-nss-red">Unit I</h4>
                                        <p className="text-gray-700 font-semibold mt-2">Dr. A. Manimaran</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-center mb-3">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-nss-blue shadow-lg bg-white">
                                                <Image
                                                    src="/images/officer-unit2.jpg"
                                                    alt="Dr. K.S. Navaneethan"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover object-top w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-nss-red">Unit II</h4>
                                        <p className="text-gray-700 font-semibold mt-2">Dr. K.S. Navaneethan</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <div className="flex justify-center mb-3">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-nss-blue shadow-lg bg-white">
                                                <Image
                                                    src="/images/officer-unit3.jpg"
                                                    alt="Ms. K. Suvalakshmi"
                                                    width={96}
                                                    height={96}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="text-lg font-bold text-nss-red">Unit III (SFU)</h4>
                                        <p className="text-gray-700 font-semibold mt-2">Ms. K. Suvalakshmi</p>
                                    </div>
                                </div>
                            </div>

                            {/* Volunteers Accordion */}
                            <div className="mt-12 border-t border-blue-300/50 pt-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-nss-blue mb-6">NSS Student Volunteers</h3>
                                    <button
                                        onClick={() => setShowVolunteers(!showVolunteers)}
                                        className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg ${showVolunteers ? 'bg-gray-600 hover:bg-gray-700' : 'bg-nss-blue hover:bg-nss-blue-dark'}`}
                                    >
                                        <span>{showVolunteers ? 'Hide Volunteers' : `Show All Volunteers (+${volunteers.length})`}</span>
                                        {showVolunteers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showVolunteers ? 'max-h-[2000px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                                        {volunteers.map((vol, idx) => (
                                            <div key={idx} className="bg-white rounded-lg p-5 shadow-sm border-l-4 border-nss-blue hover:shadow-md transition-shadow">
                                                <h4 className="font-bold text-gray-800 text-lg mb-1">{vol.name}</h4>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Student Coordinator</p>
                                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                    <span className="bg-blue-50 text-nss-blue text-xs font-bold px-2.5 py-1 rounded-md border border-blue-100">{vol.dept}</span>
                                                    <a href={`tel:+91${vol.phone}`} className="text-sm font-semibold text-gray-600 hover:text-nss-red transition-colors">
                                                        +91 {vol.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="card">
                            <h2 className="text-3xl font-bold text-nss-blue mb-4">Vision</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                The vision is to build the youth with the mind and spirit to serve the society and work for the social uplift of the down-trodden masses of our nation as a movement.
                            </p>
                        </div>
                        <div className="card">
                            <h2 className="text-3xl font-bold text-nss-red mb-4">Mission</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                The programme aims to inculcate social welfare in students, and to provide service to society without bias. NSS volunteers work to ensure that everyone who is needy gets help to enhance their standard of living and lead a life of dignity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Objective & Milestones Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="section-heading">Objective</h2>
                            <div className="card">
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    The objective of the NSS team of Kongu Engineering College is to work united and brings powerful changes in the sustaining world and to show tremendous growth in the society.
                                </p>
                            </div>
                        </div>
                        <div>
                            <h2 className="section-heading">Milestones</h2>
                            <div className="space-y-4">
                                {milestones.map((milestone, index) => (
                                    <div key={index} className="card">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-8 h-8 bg-nss-red rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700 text-lg leading-relaxed">
                                                {milestone}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
