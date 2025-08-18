import { useDashboard } from '../hooks/useDashboardNew';
import { StatsCard } from '../components/ui/StatsCard';
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">Welcome to your SCRUM management dashboard</p>
                    </div>
                </div>
                <button
                    onClick={refreshDashboard}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <TrendingUp className="w-4 h-4" />
                    Refresh Data
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
                </div>
            )}

            {/* Main Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Active Boards"
                    value={stats?.activeBoards || 0}
                    subtitle="Project boards"
                    icon={<BarChart3 className="w-6 h-6" />}
                    gradient="from-blue-500 to-indigo-500"
                />

                <StatsCard
                    title="Total Stories"
                    value={stats?.totalStories || 0}
                    subtitle="Across all boards"
                    icon={<Clock className="w-6 h-6" />}
                    gradient="from-blue-500 to-cyan-500"
                />

                <StatsCard
                    title="Completed"
                    value={stats?.completedStories || 0}
                    subtitle={`${stats?.completionRate || 0}% completion rate`}
                    icon={<CheckCircle className="w-6 h-6" />}
                    gradient="from-green-500 to-emerald-500"
                />

                <StatsCard
                    title="Story Points"
                    value={stats?.totalStoryPoints || 0}
                    subtitle={`Avg ${stats?.averageStoryPoints || 0} per story`}
                    icon={<Target className="w-6 h-6" />}
                    gradient="from-orange-500 to-red-500"
                />
            </div>

            {/* Secondary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard
                    title="My Assigned Stories"
                    value={stats?.myAssignedStories || 0}
                    subtitle="Stories assigned to me"
                    icon={<Users className="w-6 h-6" />}
                    gradient="from-indigo-500 to-purple-500"
                />

                <StatsCard
                    title="In Progress"
                    value={stats?.inProgressStories || 0}
                    subtitle="Currently active"
                    icon={<Clock className="w-6 h-6" />}
                    gradient="from-yellow-500 to-orange-500"
                />
            </div>

            {/* Status Distribution */}
            {stats?.statusDistribution && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-2xl">
                    <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <PieChart className="w-5 h-5 text-white" />
                            </div>
                            Status Distribution
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl backdrop-blur-sm">
                                <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">
                                    {stats.statusDistribution.TODO || 0}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">📝 To Do</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl backdrop-blur-sm">
                                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                    {stats.statusDistribution.IN_PROGRESS || 0}
                                </p>
                                <p className="text-sm text-blue-500 mt-2">⚡ In Progress</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-xl backdrop-blur-sm">
                                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent">
                                    {stats.statusDistribution.IN_REVIEW || 0}
                                </p>
                                <p className="text-sm text-yellow-500 mt-2">👀 In Review</p>
                            </div>
                            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 rounded-xl backdrop-blur-sm">
                                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                                    {stats.statusDistribution.DONE || 0}
                                </p>
                                <p className="text-sm text-green-500 mt-2">✅ Done</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Board Performance Chart */}
            {chartData?.boardPerformance && chartData.boardPerformance.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-2xl">
                    <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            Board Performance
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Story completion by board</p>
                    </div>
                    <div className="p-8">
                        <div className="space-y-6">
                            {chartData.boardPerformance.map((board, index) => {
                                // Safe number conversion
                                const total = Number(board.total) || 0;
                                const completed = Number(board.completed) || 0;
                                const points = Number(board.points) || 0;

                                // Safe percentage calculation
                                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                                const progressWidth = total > 0 ? (completed / total) * 100 : 0;

                                return (
                                    <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-700/30 dark:to-blue-900/10 rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{board.name}</h3>
                                            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-lg">Total: {total}</span>
                                                <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-lg">Completed: {completed}</span>
                                                <span className="bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-lg">Points: {points}</span>
                                            </div>
                                            {/* Progress bar */}
                                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mt-4 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(0, progressWidth))}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="ml-6 text-right">
                                            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 hover:shadow-2xl">
                    <div className="p-8 border-b border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            Weekly Trend
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-7 gap-4">
                            {chartData.weeklyTrend.map((day, index) => {
                                // Safe calculation for trend heights
                                const maxStories = Math.max(...chartData.weeklyTrend.map(d => Number(d.stories) || 0), 1);
                                const maxCompleted = Math.max(...chartData.weeklyTrend.map(d => Number(d.completed) || 0), 1);

                                const storiesHeight = maxStories > 0 ? ((Number(day.stories) || 0) / maxStories) * 100 : 0;
                                const completedHeight = maxCompleted > 0 ? ((Number(day.completed) || 0) / maxCompleted) * 100 : 0;

                                return (
                                    <div key={index} className="text-center">
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{day.date}</p>
                                        <div className="space-y-2">
                                            <div className="h-20 bg-gradient-to-t from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl relative overflow-hidden shadow-inner">
                                                {/* Total Stories Bar (Background) */}
                                                <div
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-400 to-blue-300 transition-all duration-500 rounded-xl"
                                                    style={{
                                                        height: `${Math.min(100, Math.max(0, storiesHeight))}%`
                                                    }}
                                                />
                                                {/* Completed Stories Bar (Foreground) */}
                                                <div
                                                    className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500 rounded-xl shadow-sm"
                                                    style={{
                                                        height: `${Math.min(100, Math.max(0, completedHeight))}%`
                                                    }}
                                                />
                                            </div>
                                            <div className="text-xs space-y-1">
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {Number(day.stories) || 0} total
                                                </p>
                                                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {Number(day.completed) || 0} done
                                                </p>
                                            </div>
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
