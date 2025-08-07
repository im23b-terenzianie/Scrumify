export default function Projects() {
    const projects = [
        {
            id: '1',
            name: 'E-Commerce Platform',
            key: 'ECP',
            description: 'Modern e-commerce platform with React and Node.js',
            status: 'Active',
            members: 5,
        },
        {
            id: '2',
            name: 'Mobile App',
            key: 'MOB',
            description: 'React Native mobile application',
            status: 'Planning',
            members: 3,
        },
        {
            id: '3',
            name: 'Analytics Dashboard',
            key: 'ANA',
            description: 'Business intelligence dashboard',
            status: 'Active',
            members: 4,
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                    <p className="text-gray-600">Manage your SCRUM projects</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                                <span className="text-sm text-gray-500">{project.key}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'Active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{project.members} members</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View Board
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
