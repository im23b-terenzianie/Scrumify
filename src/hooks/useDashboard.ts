// hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { BoardService, type DashboardStats } from '../services/boardService';

interface DashboardState {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
}

export function useDashboard() {
    const [state, setState] = useState<DashboardState>({
        stats: null,
        loading: true,
        error: null,
    });

    const loadDashboardStats = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }));
            

            const stats = await BoardService.getDashboardStats();
            

            setState({
                stats,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error('❌ Failed to load dashboard stats:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to load dashboard statistics',
            }));
        }
    };

    const refreshStats = () => {
        loadDashboardStats();
    };

    useEffect(() => {
        loadDashboardStats();
    }, []);

    return {
        stats: state.stats,
        loading: state.loading,
        error: state.error,
        refreshStats,
    };
}
