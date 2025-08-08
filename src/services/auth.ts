import { API_CONFIG } from '../api/config'
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from '../types'

export const authService = {
    // Login user with FormData (OAuth2PasswordRequestForm)
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const formData = new FormData()
        formData.append('username', credentials.username)
        formData.append('password', credentials.password)

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/login`, {
            method: 'POST',
            body: formData, // WICHTIG: FormData für OAuth2PasswordRequestForm
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.detail || 'Login failed')
        }

        const data = await response.json()

        // Token speichern
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        return data
    },

    // Register new user with JSON - dann automatisch einloggen
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        // Schritt 1: Benutzer registrieren
        const registerResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                full_name: userData.full_name
            }),
        })

        if (!registerResponse.ok) {
            const error = await registerResponse.json()
            throw new Error(error.detail || 'Registration failed')
        }

        const registeredUser = await registerResponse.json()
        console.log('✅ User registered:', registeredUser)

        // Schritt 2: Automatisch einloggen nach erfolgreicher Registrierung
        const loginData = await this.login({
            username: userData.username,
            password: userData.password
        })

        return loginData
    },    // Get current user profile
    async getCurrentUser(): Promise<User> {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }

        console.log('🔍 Fetching current user with token:', token.substring(0, 20) + '...')

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })

        console.log('📡 /me response status:', response.status)

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
                throw new Error('401 - Invalid token')
            }
            throw new Error(`HTTP ${response.status} - Failed to get current user`)
        }

        const userData = await response.json()
        console.log('✅ Current user data:', userData)
        return userData
    },

    // Logout (client-side)
    logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
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

    // Get token
    getToken(): string | null {
        return localStorage.getItem('access_token')
    }
}
