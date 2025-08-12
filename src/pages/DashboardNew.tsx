import { useDashboard } from '../hooks/useDashboardNew';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Target, PieChart } from 'lucide-react';

export default function Dashboard() {
    const { stats, chartData, loading, error, refreshDashboard } = useDashboard();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Welcome to your SCRUM management dashboard</p>
                </div>
                <button
                    onClick={refreshDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                    <TrendingUp className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Debug Info</h3>
                    <details className="text-xs text-yellow-700 dark:text-yellow-300">
                        <summary className="cursor-pointer mb-2">Click to see raw data</summary>
                        <pre className="bg-yellow-100 dark:bg-yellow-900/40 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify({ stats, chartData, loading, error }, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Main Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Boards */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Boards</h3>
                            <p className="text-3xl font-bold text-purple-600">
                                {stats?.activeBoards || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Project boards
                            </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                {/* Total Stories */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Stories</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {stats?.totalStories || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Across all boards
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                {/* Completed Stories */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {stats?.completedStories || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stats?.completionRate || 0}% completion rate
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                {/* Story Points */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story Points</h3>
                            <p className="text-3xl font-bold text-orange-600">
                                {stats?.totalStoryPoints || 0}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Avg {stats?.averageStoryPoints || 0} per story
                            </p>
                        </div>
                        <Target className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Secondary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* My Assigned Stories */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Assigned Stories</h3>
                            <p className="text-3xl font-bold text-indigo-600">
                                {stats?.myAssignedStories || 0}
                            </p>
                        </div>
                        <Users className="w-8 h-8 text-indigo-600" />
                    </div>
                </div>

                {/* In Progress */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">In Progress</h3>
                            <p className="text-3xl font-bold text-yellow-600">
                                {stats?.inProgressStories || 0}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Status Distribution */}
            {stats?.statusDistribution && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <PieChart className="w-5 h-5" />
                            Status Distribution
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <p className="text-2xl font-bold text-gray-600">
                                    {stats.statusDistribution.TODO || 0}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">📝 To Do</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">
                                    {stats.statusDistribution.IN_PROGRESS || 0}
                                </p>
                                <p className="text-sm text-blue-500">⚡ In Progress</p>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">
                                    {stats.statusDistribution.IN_REVIEW || 0}
                                </p>
                                <p className="text-sm text-yellow-500">👀 In Review</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.statusDistribution.DONE || 0}
                                </p>
                                <p className="text-sm text-green-500">✅ Done</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Board Performance Chart */}
            {chartData?.boardPerformance && chartData.boardPerformance.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Board Performance
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Story completion by board</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {chartData.boardPerformance.map((board, index) => {
                                // Safe number conversion
                                const total = Number(board.total) || 0;
                                const completed = Number(board.completed) || 0;
                                const points = Number(board.points) || 0;

                                // Safe percentage calculation
                                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                                const progressWidth = total > 0 ? (completed / total) * 100 : 0;

                                return (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 dark:text-white">{board.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>Total: {total}</span>
                                                <span>Completed: {completed}</span>
                                                <span>Points: {points}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, progressWidth))}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="text-lg font-bold text-purple-600">
                                                {isNaN(percentage) ? 0 : percentage}%
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Weekly Trend */}
            {chartData?.weeklyTrend && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Weekly Trend
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-7 gap-2">
                            {chartData.weeklyTrend.map((day, index) => {
                                // Safe calculation for trend heights
                                const maxStories = Math.max(...chartData.weeklyTrend.map(d => Number(d.stories) || 0), 1);
                                const maxCompleted = Math.max(...chartData.weeklyTrend.map(d => Number(d.completed) || 0), 1);

                                const storiesHeight = maxStories > 0 ? ((Number(day.stories) || 0) / maxStories) * 100 : 0;
                                const completedHeight = maxCompleted > 0 ? ((Number(day.completed) || 0) / maxCompleted) * 100 : 0;

                                return (
                                    <div key={index} className="text-center">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{day.date}</p>
                                        <div className="space-y-1">
                                            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                                                <div
                                                    className="absolute bottom-0 w-full bg-blue-500 transition-all duration-300"
                                                    style={{
                                                        height: `${Math.min(100, Math.max(0, storiesHeight))}%`
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                                                {Number(day.stories) || 0}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!stats && !loading && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-8 text-center">
                        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Data Available</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Create your first board and stories to see dashboard statistics
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
