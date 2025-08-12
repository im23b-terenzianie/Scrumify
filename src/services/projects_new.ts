import { apiClient } from './api'
import type {
    Project,
    CreateProjectRequest
} from '../types'

export const projectService = {
    // Get all projects (actually boards in the API)
    async getProjects(): Promise<Project[]> {
        return await apiClient.request('/api/v1/boards/all')
    },

    // Get project by ID
    async getProject(id: string): Promise<Project> {
        return await apiClient.request(`/api/v1/boards/${id}`)
    },

    // Create new project (actually a board)
    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        return await apiClient.request('/api/v1/boards/', {
            method: 'POST',
            body: JSON.stringify({
                title: projectData.title,
                description: projectData.description || ''
            }),
        })
    },

    // Update project
    async updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> {
        return await apiClient.request(`/api/v1/boards/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                title: projectData.title,
                description: projectData.description || ''
            }),
        })
    },

    // Delete project
    async deleteProject(id: string): Promise<void> {
        await apiClient.request(`/api/v1/boards/${id}`, {
            method: 'DELETE',
        })
    },
}
