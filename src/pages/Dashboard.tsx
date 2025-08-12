import { useDashboard } from '../hooks/useDashboard';
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const { stats, loading, error, refreshStats } = useDashboard();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg text-gray-600 dark:text-gray-400">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Welcome to your SCRUM management dashboard</p>
                </div>
                <button
                    onClick={refreshStats}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                    <TrendingUp className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Main Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Boards</h3>
                            <p className="text-3xl font-bold text-purple-600">
                                {stats ? stats.active_boards : '-'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                of {stats ? stats.total_boards : '-'} total
                            </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Total Stories</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {stats ? stats.total_stories : '-'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Across all boards
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Completed</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {stats ? stats.completed_stories : '-'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stats ? `${stats.overall_completion_percentage.toFixed(1)}%` : '-'} completion rate
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story Points</h3>
                            <p className="text-3xl font-bold text-orange-600">
                                {stats ? stats.completed_story_points : '-'}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                of {stats ? stats.total_story_points : '-'} total
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                </div>
            </div>

            {/* Board Statistics */}
            {stats && stats.boards && stats.boards.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Board Performance</h2>
                        <p className="text-gray-600 dark:text-gray-400">Detailed statistics for each of your boards</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.boards.map((board) => (
                                <div key={board.board_id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {board.board_title}
                                        </h3>
                                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                            {board.completion_percentage.toFixed(1)}% Complete
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${board.completion_percentage}%` }}
                                        ></div>
                                    </div>

                                    {/* Board Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400">Total Stories</p>
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                {board.total_stories}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400">In Progress</p>
                                            <p className="text-lg font-semibold text-blue-600">
                                                {board.in_progress_stories}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400">Done</p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {board.done_stories}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500 dark:text-gray-400">Story Points</p>
                                            <p className="text-lg font-semibold text-orange-600">
                                                {board.completed_story_points}/{board.total_story_points}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Breakdown */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                            📝 TODO: {board.todo_stories}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            ⚡ In Progress: {board.in_progress_stories}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                            👀 In Review: {board.in_review_stories}
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                            ✅ Done: {board.done_stories}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {stats && stats.boards && stats.boards.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-8">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">No boards found</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                Create your first board to see statistics here
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
