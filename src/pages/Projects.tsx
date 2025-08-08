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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
                    <p className="text-gray-600 dark:text-gray-300">Manage your SCRUM projects</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow border dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{project.key}</span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'Active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                {project.status}
                            </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{project.description}</p>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{project.members} members</span>
                            <button className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors">
                                View Board
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
