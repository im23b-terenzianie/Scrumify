// services/userStoryService.ts
import { API_CONFIG } from '../api/config';
import { authService } from './auth';
import type { UserStory, UserStoryCreate, UserStoryUpdate, StoryStatus } from '../types/userStory';
import { getPriorityNumber, getStatusString } from '../types/userStory';

export class UserStoryService {
    private static readonly API_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STORIES}`;

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
            console.error('🚨 API Error Response:', errorText);

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

    // ✅ STORY ERSTELLEN - KORREKTE IMPLEMENTATION
    static async createStory(storyData: UserStoryCreate, boardId: number | string): Promise<UserStory> {
        // Validierung vor API-Call
        if (!storyData.title?.trim()) {
            throw new Error('Story Title ist erforderlich!');
        }
        if (storyData.title.length > 200) {
            throw new Error('Story Title zu lang (max 200 Zeichen)!');
        }

        // Korrekte Datenstruktur für Backend mit richtigen Enum-Werten
        const requestBody = {
            title: storyData.title,
            description: storyData.description || "",
            priority: getPriorityNumber(storyData.priority || "MEDIUM"),  // ← Zahl (1-5)
            status: getStatusString(storyData.status || "TODO"),          // ← lowercase string
            story_points: storyData.story_points || null,
            user_type: storyData.user_type || null,
            user_action: storyData.user_action || null,
            user_benefit: storyData.user_benefit || null,
            acceptance_criteria: storyData.acceptance_criteria || null,
            assignee_id: storyData.assignee_id || null
        };

        console.log('📤 Sending story creation request:', requestBody);
        console.log('📤 Request Body JSON:', JSON.stringify(requestBody, null, 2));
        console.log('🎯 API Endpoint:', `${this.API_BASE}/?board_id=${boardId}`);

        return await this.apiCall(`/?board_id=${boardId}`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
        });
    }

    // ✅ ALLE STORIES EINES BOARDS LADEN
    static async getStoriesForBoard(boardId: number | string): Promise<UserStory[]> {
        return await this.apiCall(`/board/${boardId}`);
    }

    // ✅ STORY-STATUS ÄNDERN (KANBAN)
    static async moveStoryStatus(storyId: number, newStatus: StoryStatus): Promise<UserStory> {
        return await this.apiCall(`/${storyId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: newStatus }),
        });
    }

    // ✅ STORY EINEM USER ZUWEISEN
    static async assignStory(storyId: number, assigneeId: number | null): Promise<UserStory> {
        return await this.apiCall(`/${storyId}/assign`, {
            method: 'PATCH',
            body: JSON.stringify({ assignee_id: assigneeId }),
        });
    }

    // ✅ STORY AKTUALISIEREN
    static async updateStory(storyId: number, updateData: UserStoryUpdate): Promise<UserStory> {
        return await this.apiCall(`/${storyId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData),
        });
    }

    // ✅ STORY LÖSCHEN
    static async deleteStory(storyId: number): Promise<void> {
        await this.apiCall(`/${storyId}`, { method: 'DELETE' });
    }
}