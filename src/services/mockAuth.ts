import type { User, LoginRequest, RegisterRequest, AuthResponse } from '../types'

// Mock users database
const mockUsers: User[] = [
    {
        id: '1',
        email: 'admin@scrumify.site',
        username: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: '2',
        email: 'enzo.terenziani@gmx.ch',
        username: 'Enzo',
        full_name: 'Enzo Terenziani',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

// Mock authentication service for development
export const mockAuthService = {
    // Mock login
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

        const user = mockUsers.find(u =>
            u.username === credentials.username || u.email === credentials.username
        )

        if (!user || credentials.password !== 'admin123') {
            throw new Error('Invalid credentials')
        }

        const token = 'mock-jwt-token-' + Date.now()

        return {
            access_token: token,
            token_type: 'bearer',
            user
        }
    },

    // Mock register
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay

        // Check if user already exists
        const existingUser = mockUsers.find(u =>
            u.email === userData.email || u.username === userData.username
        )

        if (existingUser) {
            throw new Error('User already exists')
        }

        // Create new user
        const newUser: User = {
            id: String(mockUsers.length + 1),
            email: userData.email,
            username: userData.username,
            full_name: userData.full_name || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        mockUsers.push(newUser)

        const token = 'mock-jwt-token-' + Date.now()

        return {
            access_token: token,
            token_type: 'bearer',
            user: newUser
        }
    },

    // Mock get current user
    async getCurrentUser(): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const token = localStorage.getItem('access_token')
        if (!token || !token.startsWith('mock-jwt-token-')) {
            throw new Error('Invalid token')
        }

        // Return first user as current user for mock
        return mockUsers[1] // Enzo's account
    },

    // Mock logout
    logout() {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem('access_token')
        return !!token && token.startsWith('mock-jwt-token-')
    },

    // Save token
    saveToken(token: string) {
        localStorage.setItem('access_token', token)
    }
}
