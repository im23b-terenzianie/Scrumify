import apiClient from './api'
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from '../types'

export const authService = {
    // Login user
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const formData = new FormData()
        formData.append('username', credentials.username)
        formData.append('password', credentials.password)

        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        return response.data
    },

    // Register new user
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post('/auth/register', userData)
        return response.data
    },

    // Get current user profile
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get('/auth/me')
        return response.data
    },

    // Logout (client-side)
    logout() {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token')
    },

    // Save token
    saveToken(token: string) {
        localStorage.setItem('access_token', token)
    },
}
