export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Welcome to your SCRUM management dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
                    <p className="text-3xl font-bold text-purple-600">3</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sprints</h3>
                    <p className="text-3xl font-bold text-green-500">2</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Stories</h3>
                    <p className="text-3xl font-bold text-purple-600">15</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Tasks</h3>
                    <p className="text-3xl font-bold text-green-500">42</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-white">Story "User Login" completed</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">2 hours ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-white">New sprint "Sprint 3" started</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">1 day ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-900 dark:text-white">Task "API Integration" in progress</span>
                            <span className="text-xs text-gray-600 dark:text-gray-300">2 days ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
