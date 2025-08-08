import { apiClient } from './api'
import type {
    Story,
    CreateStoryRequest,
    UpdateStoryRequest
} from '../types'

export const storyService = {
    // Get stories for a project
    async getStoriesByProject(projectId: string): Promise<Story[]> {
        return await apiClient.request(`/api/v1/projects/${projectId}/stories`)
    },

    // Get stories for a sprint
    async getStoriesBySprint(sprintId: string): Promise<Story[]> {
        return await apiClient.request(`/api/v1/sprints/${sprintId}/stories`)
    },

    // Get story by ID
    async getStory(id: string): Promise<Story> {
        return await apiClient.request(`/api/v1/stories/${id}`)
    },

    // Create new story
    async createStory(storyData: CreateStoryRequest): Promise<Story> {
        return await apiClient.request('/api/v1/stories/', {
            method: 'POST',
            body: JSON.stringify(storyData),
        })
    },

    // Update story
    async updateStory(id: string, storyData: UpdateStoryRequest): Promise<Story> {
        return await apiClient.request(`/api/v1/stories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(storyData),
        })
    },

    // Delete story
    async deleteStory(id: string): Promise<void> {
        await apiClient.request(`/api/v1/stories/${id}`, {
            method: 'DELETE',
        })
    },

    // Update story status (for drag & drop)
    async updateStoryStatus(id: string, status: Story['status']): Promise<Story> {
        return await apiClient.request(`/api/v1/stories/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        })
    },
}
