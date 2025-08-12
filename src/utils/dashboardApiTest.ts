// Test the Dashboard Service API calls
import { DashboardService } from '../services/dashboardService';
import { authService } from '../services/auth';

// Test function to verify API integration
export async function testDashboardAPI() {
    try {
        console.log('🧪 Testing Dashboard API integration...');
        console.log('🔑 Current token:', authService.getToken() ? 'Token exists' : 'No token');

        // Test 1: Get all boards with stats
        console.log('📋 Testing getAllBoardsWithStats...');
        const boards = await DashboardService.getAllBoardsWithStats();
        console.log('✅ Boards loaded:', boards);

        // Test 2: Get dashboard stats
        console.log('📊 Testing getDashboardStats...');
        const stats = await DashboardService.getDashboardStats();
        console.log('✅ Dashboard stats:', stats);

        // Test 3: Get chart data
        console.log('📈 Testing getChartData...');
        const chartData = await DashboardService.getChartData();
        console.log('✅ Chart data:', chartData);

        return {
            success: true,
            data: { boards, stats, chartData }
        };

    } catch (error) {
        console.error('❌ Dashboard API test failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// Test individual API endpoints
export async function testRawAPI() {
    try {
        const token = authService.getToken();
        console.log('🔍 Testing raw API endpoints...');

        // Test boards endpoint
        const boardsResponse = await fetch('https://api.scrumify.site/api/v1/boards/', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📋 Boards response status:', boardsResponse.status);
        const boardsData = await boardsResponse.json();
        console.log('📋 Boards data:', boardsData);

        // Test assigned stories endpoint
        const storiesResponse = await fetch('https://api.scrumify.site/api/v1/stories/assigned', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('👤 Stories response status:', storiesResponse.status);
        const storiesData = await storiesResponse.json();
        console.log('👤 Stories data:', storiesData);

        return { boardsData, storiesData };

    } catch (error) {
        console.error('❌ Raw API test failed:', error);
        return { error };
    }
}

// Export for testing in browser console
(window as any).testDashboardAPI = testDashboardAPI;
(window as any).testRawAPI = testRawAPI;

// Additional debug function
export async function debugNaN() {
    try {
        console.log('🔍 Debugging NaN values...');

        const stats = await DashboardService.getDashboardStats();
        const chartData = await DashboardService.getChartData();

        console.log('📊 Stats Analysis:');
        Object.entries(stats).forEach(([key, value]) => {
            if (typeof value === 'number' && isNaN(value)) {
                console.error(`❌ NaN found in stats.${key}:`, value);
            } else {
                console.log(`✅ stats.${key}:`, value, typeof value);
            }
        });

        console.log('📈 Chart Data Analysis:');
        chartData.boardPerformance.forEach((board, index) => {
            console.log(`Board ${index}:`, board);
            if (isNaN(board.total) || isNaN(board.completed) || isNaN(board.points)) {
                console.error(`❌ NaN in board performance:`, board);
            }
        });

        return { stats, chartData };

    } catch (error) {
        console.error('❌ Debug failed:', error);
        return { error };
    }
}

(window as any).debugNaN = debugNaN;
