import apiClient from './api'
import type {
    Story,
    CreateStoryRequest,
    UpdateStoryRequest
} from '../types'

export const storyService = {
    // Get stories for a project
    async getStoriesByProject(projectId: string): Promise<Story[]> {
        const response = await apiClient.get<Story[]>(`/projects/${projectId}/stories`)
        return response.data
    },

    // Get stories for a sprint
    async getStoriesBySprint(sprintId: string): Promise<Story[]> {
        const response = await apiClient.get<Story[]>(`/sprints/${sprintId}/stories`)
        return response.data
    },

    // Get story by ID
    async getStory(id: string): Promise<Story> {
        const response = await apiClient.get<Story>(`/stories/${id}`)
        return response.data
    },

    // Create new story
    async createStory(storyData: CreateStoryRequest): Promise<Story> {
        const response = await apiClient.post<Story>('/stories/', storyData)
        return response.data
    },

    // Update story
    async updateStory(id: string, storyData: UpdateStoryRequest): Promise<Story> {
        const response = await apiClient.put<Story>(`/stories/${id}`, storyData)
        return response.data
    },

    // Delete story
    async deleteStory(id: string): Promise<void> {
        await apiClient.delete(`/stories/${id}`)
    },

    // Update story status (for drag & drop)
    async updateStoryStatus(id: string, status: Story['status']): Promise<Story> {
        const response = await apiClient.patch<Story>(`/stories/${id}/status`, { status })
        return response.data
    },
}
