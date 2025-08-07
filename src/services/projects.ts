import apiClient from './api'
import type {
    Project,
    CreateProjectRequest
} from '../types'

export const projectService = {
    // Get all projects
    async getProjects(): Promise<Project[]> {
        const response = await apiClient.get<Project[]>('/projects/')
        return response.data
    },

    // Get project by ID
    async getProject(id: string): Promise<Project> {
        const response = await apiClient.get<Project>(`/projects/${id}`)
        return response.data
    },

    // Create new project
    async createProject(projectData: CreateProjectRequest): Promise<Project> {
        const response = await apiClient.post<Project>('/projects/', projectData)
        return response.data
    },

    // Update project
    async updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> {
        const response = await apiClient.put<Project>(`/projects/${id}`, projectData)
        return response.data
    },

    // Delete project
    async deleteProject(id: string): Promise<void> {
        await apiClient.delete(`/projects/${id}`)
    },

    // Get project members
    async getProjectMembers(id: string): Promise<any[]> {
        const response = await apiClient.get(`/projects/${id}/members`)
        return response.data
    },
}
