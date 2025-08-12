// services/dashboardService.ts - NEW FILE nach Backend Copilot Spec
import { API_CONFIG } from '../api/config';
import { authService } from './auth';
import type { BoardWithStats, DashboardStats, ChartData } from '../types/dashboard';

export class DashboardService {
    private static readonly API_BASE = `${API_CONFIG.BASE_URL}/api/v1`;

    private static async apiCall(endpoint: string, options: RequestInit = {}) {
        const token = authService.getToken();
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        };

        const response = await fetch(`${this.API_BASE}${endpoint}`, config);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🚨 Dashboard API Error Response:', errorText);

            try {
                const errorData = JSON.parse(errorText);
                console.error('🚨 Parsed Error Data:', errorData);
                throw new Error(errorData.detail || `HTTP ${response.status}`);
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }

        if (response.status === 204) return null;
        return await response.json();
    }

    // 📊 GET ALL BOARDS WITH STATISTICS
    static async getAllBoardsWithStats(): Promise<BoardWithStats[]> {
        try {
            console.log('📋 Loading all boards...');
            const boards = await this.apiCall('/boards/');
            console.log('📋 Raw boards response:', boards);

            if (!Array.isArray(boards)) {
                console.warn('⚠️ Boards response is not an array:', boards);
                return [];
            }

            // Get detailed stats for each board
            const boardsWithStats = await Promise.all(
                boards.map(async (board: any) => {
                    try {
                        console.log(`📊 Loading stats for board ${board.id}...`);
                        const statsResponse = await this.apiCall(`/boards/${Number(board.id)}/stats`);
                        console.log(`📊 Stats for board ${board.id}:`, statsResponse);
                        return statsResponse;
                    } catch (error) {
                        console.warn(`Failed to get stats for board ${board.id}:`, error);

                        // Return board with empty stats as fallback
                        return {
                            ...board,
                            story_counts: { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 },
                            total_stories: 0,
                            total_story_points: 0
                        };
                    }
                })
            );

            console.log('✅ All boards with stats:', boardsWithStats);
            return boardsWithStats;

        } catch (error) {
            console.error('❌ Failed to load boards:', error);
            return []; // Return empty array as fallback
        }
    }

    // 📈 GET COMPLETE DASHBOARD STATISTICS
    static async getDashboardStats(): Promise<DashboardStats> {
        try {
            console.log('📊 Loading complete dashboard statistics...');

            // Get all boards with statistics
            const boards = await this.getAllBoardsWithStats();
            console.log('📋 Raw boards data:', boards);

            // Get user's assigned stories with error handling
            let assignedStories = [];
            try {
                assignedStories = await this.apiCall('/stories/assigned');
                console.log('👤 Assigned stories:', assignedStories);
            } catch (error) {
                console.warn('⚠️ Failed to get assigned stories:', error);
                assignedStories = [];
            }

            // Ensure boards is an array and has valid data
            const validBoards = Array.isArray(boards) ? boards : [];
            console.log('✅ Valid boards count:', validBoards.length);

            // Calculate aggregated metrics with proper null checks
            const totalStories = validBoards.reduce((sum, board) => {
                const stories = Number(board?.total_stories) || 0;
                return sum + stories;
            }, 0);

            const completedStories = validBoards.reduce((sum, board) => {
                const done = Number(board?.story_counts?.DONE) || 0;
                return sum + done;
            }, 0);

            const totalStoryPoints = validBoards.reduce((sum, board) => {
                const points = Number(board?.total_story_points) || 0;
                return sum + points;
            }, 0);

            const inProgressStories = validBoards.reduce((sum, board) => {
                const inProgress = Number(board?.story_counts?.IN_PROGRESS) || 0;
                return sum + inProgress;
            }, 0);

            // Calculate status distribution with safe defaults
            const statusDistribution = {
                TODO: validBoards.reduce((sum, board) => sum + (Number(board?.story_counts?.TODO) || 0), 0),
                IN_PROGRESS: validBoards.reduce((sum, board) => sum + (Number(board?.story_counts?.IN_PROGRESS) || 0), 0),
                IN_REVIEW: validBoards.reduce((sum, board) => sum + (Number(board?.story_counts?.IN_REVIEW) || 0), 0),
                DONE: validBoards.reduce((sum, board) => sum + (Number(board?.story_counts?.DONE) || 0), 0),
            };

            // Calculate rates with safe math
            const completionRate = totalStories > 0 ? Number((completedStories / totalStories * 100).toFixed(1)) : 0;
            const averageStoryPoints = totalStories > 0 ? Number((totalStoryPoints / totalStories).toFixed(1)) : 0;

            const stats = {
                activeBoards: validBoards.length || 0,
                totalStories: totalStories || 0,
                completedStories: completedStories || 0,
                completionRate: isNaN(completionRate) ? 0 : completionRate,
                totalStoryPoints: totalStoryPoints || 0,
                inProgressStories: inProgressStories || 0,
                myAssignedStories: Array.isArray(assignedStories) ? assignedStories.length : 0,
                averageStoryPoints: isNaN(averageStoryPoints) ? 0 : averageStoryPoints,
                statusDistribution
            };

            console.log('✅ Dashboard stats calculated:', stats);
            console.log('🔍 Stats validation:', {
                totalStoriesValid: !isNaN(stats.totalStories),
                completionRateValid: !isNaN(stats.completionRate),
                averagePointsValid: !isNaN(stats.averageStoryPoints)
            });

            return stats;

        } catch (error) {
            console.error('❌ Dashboard stats error:', error);

            // Return safe fallback data instead of throwing
            return {
                activeBoards: 0,
                totalStories: 0,
                completedStories: 0,
                completionRate: 0,
                totalStoryPoints: 0,
                inProgressStories: 0,
                myAssignedStories: 0,
                averageStoryPoints: 0,
                statusDistribution: {
                    TODO: 0,
                    IN_PROGRESS: 0,
                    IN_REVIEW: 0,
                    DONE: 0,
                }
            };
        }
    }

    // 📊 GET CHART DATA
    static async getChartData(): Promise<ChartData> {
        try {
            console.log('📊 Loading chart data...');
            const boards = await this.getAllBoardsWithStats();

            // Ensure boards is a valid array
            const validBoards = Array.isArray(boards) ? boards : [];
            console.log('📊 Valid boards for charts:', validBoards.length);

            // Status Distribution for Pie/Donut Chart with safe access
            const statusCounts = {
                TODO: validBoards.reduce((sum, b) => sum + (Number(b?.story_counts?.TODO) || 0), 0),
                IN_PROGRESS: validBoards.reduce((sum, b) => sum + (Number(b?.story_counts?.IN_PROGRESS) || 0), 0),
                IN_REVIEW: validBoards.reduce((sum, b) => sum + (Number(b?.story_counts?.IN_REVIEW) || 0), 0),
                DONE: validBoards.reduce((sum, b) => sum + (Number(b?.story_counts?.DONE) || 0), 0),
            };

            const statusDistribution = [
                { name: 'To Do', value: statusCounts.TODO, color: '#64748b' },
                { name: 'In Progress', value: statusCounts.IN_PROGRESS, color: '#3b82f6' },
                { name: 'In Review', value: statusCounts.IN_REVIEW, color: '#f59e0b' },
                { name: 'Done', value: statusCounts.DONE, color: '#10b981' },
            ].filter(item => item.value > 0);

            // Board Performance for Bar Chart with safe data handling
            const boardPerformance = validBoards.map(board => {
                const title = board?.title || 'Unknown Board';
                const total = Number(board?.total_stories) || 0;
                const completed = Number(board?.story_counts?.DONE) || 0;
                const points = Number(board?.total_story_points) || 0;

                return {
                    name: title.length > 15 ? title.substring(0, 15) + '...' : title,
                    total,
                    completed,
                    points
                };
            });

            // Generate weekly trend with safe data
            const weeklyTrend = this.generateWeeklyTrend(validBoards);

            console.log('✅ Chart data generated:', { statusDistribution, boardPerformance, weeklyTrend });

            return {
                statusDistribution,
                boardPerformance,
                weeklyTrend
            };

        } catch (error) {
            console.error('❌ Chart data error:', error);

            // Return safe fallback chart data
            return {
                statusDistribution: [],
                boardPerformance: [],
                weeklyTrend: []
            };
        }
    }

    // 📅 GENERATE WEEKLY TREND DATA
    private static generateWeeklyTrend(boards: BoardWithStats[]) {
        const today = new Date();
        const weeklyData = [];

        // Ensure boards is valid array
        const validBoards = Array.isArray(boards) ? boards : [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Calculate totals with safe math
            const totalStories = validBoards.reduce((sum, board) => {
                return sum + (Number(board?.total_stories) || 0);
            }, 0);

            const completedStories = validBoards.reduce((sum, board) => {
                return sum + (Number(board?.story_counts?.DONE) || 0);
            }, 0);

            // Generate mock trend data based on actual numbers
            const baseStories = Math.max(1, totalStories);
            const baseCompleted = Math.max(0, completedStories);

            weeklyData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                stories: Math.floor(baseStories * (0.7 + Math.random() * 0.3)),
                completed: Math.floor(baseCompleted * (0.8 + Math.random() * 0.2))
            });
        }

        return weeklyData;
    }

    // 🔄 REFRESH DASHBOARD DATA
    static async refreshDashboard(): Promise<DashboardStats> {
        console.log('🔄 Refreshing dashboard data...');
        return await this.getDashboardStats();
    }
}
