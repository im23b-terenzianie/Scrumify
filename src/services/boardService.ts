// services/boardService.ts
import { API_CONFIG } from '../api/config';
import { authService } from './auth';

export interface Board {
    id: number;
    title: string;
    description?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface BoardStats {
    board_id: number;
    board_title: string;
    total_stories: number;
    todo_stories: number;
    in_progress_stories: number;
    in_review_stories: number;
    done_stories: number;
    total_story_points: number;
    completed_story_points: number;
    average_story_points: number;
    completion_percentage: number;
}

export interface DashboardStats {
    total_boards: number;
    active_boards: number;
    total_stories: number;
    completed_stories: number;
    total_story_points: number;
    completed_story_points: number;
    overall_completion_percentage: number;
    boards: BoardStats[];
}

export class BoardService {
    private static readonly API_BASE = `${API_CONFIG.BASE_URL}/api/v1/boards`;

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
            console.error('🚨 Board API Error Response:', errorText);

            try {
                const errorData = JSON.parse(errorText);
                console.error('🚨 Parsed Error Data:', errorData);
                throw new Error(JSON.stringify(errorData, null, 2));
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }

        if (response.status === 204) return null;
        return await response.json();
    }

    // ✅ ALLE BOARDS LADEN
    static async getAllBoards(): Promise<Board[]> {
        console.log('📋 Loading all boards...');
        return await this.apiCall('');
    }

    // ✅ EINZELNES BOARD LADEN
    static async getBoard(boardId: number): Promise<Board> {
        console.log(`📋 Loading board ${boardId}...`);
        return await this.apiCall(`/${boardId}`);
    }

    // ✅ BOARD ERSTELLEN
    static async createBoard(boardData: Omit<Board, 'id' | 'created_at' | 'updated_at' | 'owner_id'>): Promise<Board> {
        console.log('📋 Creating new board:', boardData);

        return await this.apiCall('', {
            method: 'POST',
            body: JSON.stringify(boardData),
        });
    }

    // ✅ BOARD AKTUALISIEREN
    static async updateBoard(boardId: number, boardData: Partial<Omit<Board, 'id' | 'created_at' | 'updated_at' | 'owner_id'>>): Promise<Board> {
        console.log(`📋 Updating board ${boardId}:`, boardData);

        return await this.apiCall(`/${boardId}`, {
            method: 'PUT',
            body: JSON.stringify(boardData),
        });
    }

    // ✅ BOARD LÖSCHEN
    static async deleteBoard(boardId: number): Promise<void> {
        console.log(`📋 Deleting board ${boardId}`);

        await this.apiCall(`/${boardId}`, {
            method: 'DELETE',
        });
    }

    // ✅ BOARD STATISTIKEN LADEN
    static async getBoardStats(boardId: number): Promise<BoardStats> {
        console.log(`📊 Loading stats for board ${boardId}...`);
        return await this.apiCall(`/${boardId}/stats`);
    }

    // ✅ DASHBOARD STATISTIKEN LADEN (alle Boards des Users)
    static async getDashboardStats(): Promise<DashboardStats> {
        console.log('📊 Loading dashboard statistics...');
        return await this.apiCall('/stats');
    }

    // ✅ USER'S BOARDS LADEN
    static async getUserBoards(): Promise<Board[]> {
        console.log('📋 Loading user boards...');
        return await this.apiCall('/my-boards');
    }
}
