import { Mail, Phone } from 'lucide-react'

export default function FeedbackSection() {
    return (
        <div className="bg-gradient-to-r from-nss-blue to-nss-blue-dark rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Have Feedback or Suggestions?</h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                Help us improve the Blood Command Center! Share your experience, report issues, or suggest new features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                    href="mailto:pugazhendhir.24cse@kongu.edu"
                    className="inline-flex items-center justify-center space-x-2 bg-white text-nss-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    <Mail className="w-5 h-5" />
                    <span>Send Feedback via Email</span>
                </a>
                <a
                    href="tel:9965398712"
                    className="inline-flex items-center justify-center space-x-2 bg-nss-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-nss-red-dark transition-colors"
                >
                    <Phone className="w-5 h-5" />
                    <span>Call Programme Officer</span>
                </a>
            </div>
            <p className="text-sm text-gray-300 mt-4">
                Your feedback helps us serve the community better. Thank you for being part of NSS!
            </p>
        </div>
    )
}
