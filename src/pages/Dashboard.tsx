export default function Dashboard() {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Welcome to your SCRUM management dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Projects</h3>
                    <p className="text-3xl font-bold text-purple-600">-</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sprints</h3>
                    <p className="text-3xl font-bold text-green-500">-</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Stories</h3>
                    <p className="text-3xl font-bold text-purple-600">-</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed Tasks</h3>
                    <p className="text-3xl font-bold text-green-500">-</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No recent activity to display</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Activity will appear here as you work with your projects</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
