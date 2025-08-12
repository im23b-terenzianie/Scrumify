// types/dashboard.ts
export interface BoardWithStats {
    id: number;
    title: string;
    description: string | null;
    owner_id: number;
    created_at: string;
    updated_at: string;
    story_counts: {
        TODO: number;           // For "Backlog Stories"
        IN_PROGRESS: number;    // For "Active Stories"  
        IN_REVIEW: number;      // For "In Review"
        DONE: number;          // For "Completed Stories"
    };
    total_stories: number;    // Total count across all statuses
    total_story_points: number; // Sum of all story points
}

export interface DashboardStats {
    activeBoards: number;
    totalStories: number;
    completedStories: number;
    completionRate: number;
    totalStoryPoints: number;
    inProgressStories: number;
    myAssignedStories: number;
    averageStoryPoints: number;
    statusDistribution: {
        TODO: number;
        IN_PROGRESS: number;
        IN_REVIEW: number;
        DONE: number;
    };
}

export interface ChartData {
    statusDistribution: { name: string; value: number; color: string }[];
    boardPerformance: { name: string; total: number; completed: number; points: number }[];
    weeklyTrend: { date: string; stories: number; completed: number }[];
}
