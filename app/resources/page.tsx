import { Download, FileText, Music, Award } from 'lucide-react'

const resources = [
    {
        icon: FileText,
        title: 'NSS Rules & Regulations',
        description: 'Official Rules & Regulations for National Service Scheme at Kongu Engineering College',
        fileSize: '1.2 MB',
        fileType: 'PDF',
        downloadUrl: '/assets/docs/nss-rules-regulations-kec.pdf',
    },
]

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
                    <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                        Download essential documents and materials for NSS volunteers
                    </p>
                </div>
            </section>

            {/* Downloads Section */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-heading text-center">Downloads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {resources.map((resource, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-nss-blue rounded-lg flex items-center justify-center flex-shrink-0">
                                        <resource.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-nss-blue mb-2">{resource.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-xs text-gray-500">
                                                <span className="font-semibold">{resource.fileType}</span> • {resource.fileSize}
                                            </div>
                                            <div className="flex space-x-3">
                                                <a
                                                    href={resource.downloadUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-nss-blue px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    <span>View</span>
                                                </a>
                                                <a
                                                    href={resource.downloadUrl}
                                                    download
                                                    className="inline-flex items-center space-x-2 bg-nss-red hover:bg-nss-red-dark text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact for More Resources */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-r from-nss-blue to-nss-blue-dark text-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">Need More Resources?</h2>
                        <p className="text-gray-100 mb-6">
                            Contact our Programme Officer for additional materials, training resources, or any queries.
                        </p>
                        <a
                            href="mailto:nsskec@kongu.ac.in"
                            className="inline-block bg-white text-nss-blue hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                            Contact Programme Officer
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
