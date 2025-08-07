// API Types
export interface User {
    id: string
    email: string
    username: string
    full_name?: string
    avatar_url?: string
    created_at: string
    updated_at: string
}

export interface Project {
    id: string
    name: string
    description?: string
    key: string
    owner_id: string
    created_at: string
    updated_at: string
    owner?: User
    members?: User[]
}

export interface Sprint {
    id: string
    name: string
    description?: string
    project_id: string
    start_date: string
    end_date: string
    status: 'planning' | 'active' | 'completed'
    created_at: string
    updated_at: string
    project?: Project
}

export interface Story {
    id: string
    title: string
    description?: string
    story_points?: number
    priority: 'low' | 'medium' | 'high' | 'critical'
    status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'
    project_id: string
    sprint_id?: string
    assignee_id?: string
    created_at: string
    updated_at: string
    project?: Project
    sprint?: Sprint
    assignee?: User
}

export interface Task {
    id: string
    title: string
    description?: string
    status: 'todo' | 'in_progress' | 'done'
    story_id: string
    assignee_id?: string
    created_at: string
    updated_at: string
    story?: Story
    assignee?: User
}

// Auth Types
export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    email: string
    username: string
    password: string
    full_name?: string
}

export interface AuthResponse {
    access_token: string
    token_type: string
    user: User
}

// API Response Types
export interface ApiResponse<T> {
    data: T
    message?: string
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    per_page: number
    pages: number
}

// Form Types
export interface CreateProjectRequest {
    name: string
    description?: string
    key: string
}

export interface CreateSprintRequest {
    name: string
    description?: string
    project_id: string
    start_date: string
    end_date: string
}

export interface CreateStoryRequest {
    title: string
    description?: string
    story_points?: number
    priority: Story['priority']
    project_id: string
    sprint_id?: string
}

export interface UpdateStoryRequest {
    title?: string
    description?: string
    story_points?: number
    priority?: Story['priority']
    status?: Story['status']
    sprint_id?: string
    assignee_id?: string
}

// UI Types
export interface BoardColumn {
    id: string
    title: string
    status: Story['status']
    stories: Story[]
}

export interface KanbanBoard {
    columns: BoardColumn[]
}
