
export const API_CONFIG = {
    BASE_URL: import.meta.env.MODE === 'development'
        ? '' // Verwende Vite Proxy in Development
        : (import.meta.env.VITE_API_BASE_URL || 'https://api.scrumify.site'),
    ENDPOINTS: {
        AUTH: '/api/v1/auth',
        BOARDS: '/api/v1/boards',
        STORIES: '/api/v1/stories',
        PROJECTS: '/api/v1/projects'
    }
}
