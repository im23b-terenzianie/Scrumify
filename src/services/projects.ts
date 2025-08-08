import { apiClient } from './api'
import type {
    Project,
    CreateProjectRequest
} from '../types'

export const projectService = {
    // Get all projects
    async getProjects(): Promise<Project[]> {
        return await apiClient.request('/api/v1/projects/')
    },

    // Get project by ID
    async getProject(id: string): Promise<Project> {
        return await apiClient.request(`/api/v1/projects/${id}`)
    },

    // Create new project
    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        return await apiClient.request('/api/v1/projects/', {
            method: 'POST',
            body: JSON.stringify(projectData),
        })
    },

    // Update project
    async updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> {
        return await apiClient.request(`/api/v1/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(projectData),
        })
    },

    // Delete project
    async deleteProject(id: string): Promise<void> {
        await apiClient.request(`/api/v1/projects/${id}`, {
            method: 'DELETE',
        })
    },

    // Get project members
    async getProjectMembers(id: string): Promise<any[]> {
        return await apiClient.request(`/api/v1/projects/${id}/members`)
    },
}
