import { API_CONFIG } from '../api/config'
import { authService } from './auth'

class ApiClient {
    private baseURL = API_CONFIG.BASE_URL

    async request(endpoint: string, options: RequestInit = {}) {
        // Check and refresh token if needed before making the request
        const tokenValid = await authService.refreshTokenIfNeeded()
        if (!tokenValid) {
            throw new Error('Authentication required')
        }

        const token = authService.getToken()

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config)

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    authService.logout()
                    throw new Error('Authentication failed - please login again')
                }
                const error = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }))
                throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            // Handle network errors gracefully
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Network error - please check your connection')
            }
            throw error
        }
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
