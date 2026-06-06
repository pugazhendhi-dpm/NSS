import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
    title: string
    description: string
    href: string
    icon: LucideIcon
    color: string
}

export default function DashboardCard({ title, description, href, icon: Icon, color }: DashboardCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-nss-blue mb-4">{title}</h2>
            <p className="text-gray-600 mb-6">{description}</p>
            <Link
                href={href}
                className={`inline-flex items-center space-x-2 ${color} text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
                <Icon className="w-5 h-5" />
                <span>{title}</span>
            </Link>
        </div>
    )
}
