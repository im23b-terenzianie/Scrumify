import { API_CONFIG } from '../api/config'
import { authService } from './auth'

class ApiClient {
    private baseURL = API_CONFIG.BASE_URL

    async request(endpoint: string, options: RequestInit = {}) {
        const token = authService.getToken()

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, config)

        if (!response.ok) {
            if (response.status === 401) {
                authService.logout()
                window.location.href = '/login'
            }
            const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
            throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
    }

    // Boards API
    async getBoards() {
        return this.request('/api/v1/boards/')
    }

    async createBoard(boardData: any) {
        return this.request('/api/v1/boards/', {
            method: 'POST',
            body: JSON.stringify(boardData),
        })
    }

    // Stories API
    async getBoardStories(boardId: number) {
        return this.request(`/api/v1/stories/board/${boardId}`)
    }

    async createStory(storyData: any, boardId: number) {
        return this.request(`/api/v1/stories/?board_id=${boardId}`, {
            method: 'POST',
            body: JSON.stringify(storyData),
        })
    }

    async updateStoryStatus(storyId: number, status: string) {
        return this.request(`/api/v1/stories/${storyId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        })
    }
}

export const apiClient = new ApiClient()
export default apiClient
