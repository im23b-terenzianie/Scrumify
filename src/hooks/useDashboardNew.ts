// hooks/useDashboard.ts - BACKEND INTEGRATION
import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import type { DashboardStats, ChartData } from '../types/dashboard';

export const useDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            
            const [dashboardStats, charts] = await Promise.all([
                DashboardService.getDashboardStats(),
                DashboardService.getChartData()
            ]);

            setStats(dashboardStats);
            setChartData(charts);
            
        } catch (err) {
            console.error('❌ Dashboard loading error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const refreshDashboard = async () => {
        
        await loadDashboardData();
    };

    useEffect(() => {
        loadDashboardData();

        // Refresh dashboard when window regains focus (user returns to tab)
        const handleFocus = () => {
            
            loadDashboardData();
        };

        window.addEventListener('focus', handleFocus);

        // Auto-refresh every 60 seconds (less aggressive)
        const interval = setInterval(() => {
            
            loadDashboardData();
        }, 60000);

        return () => {
            window.removeEventListener('focus', handleFocus);
            clearInterval(interval);
        };
    }, []);

    return {
        stats,
        chartData,
        loading,
        error,
        refreshDashboard
    };
};
