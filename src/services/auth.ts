import { API_CONFIG } from '../api/config'
import type {
    User,
    LoginRequest,
    RegisterRequest,
    AuthResponse
} from '../types'

export const authService = {
    // Token expiration check
    isTokenExpired(token?: string): boolean {
        const tokenToCheck = token || this.getToken()
        if (!tokenToCheck) return true

        try {
            // JWT payload is base64 encoded in the middle part
            const payload = JSON.parse(atob(tokenToCheck.split('.')[1]))
            const currentTime = Math.floor(Date.now() / 1000)

            // Check if token expires in the next 5 minutes (300 seconds)
            // This gives us time to refresh before it actually expires
            return payload.exp < (currentTime + 300)
        } catch (error) {
            console.error('Error checking token expiration:', error)
            return true // Assume expired if we can't parse it
        }
    },

    // Improved token validation
    isValidToken(token?: string): boolean {
        const tokenToCheck = token || this.getToken()
        if (!tokenToCheck) return false

        // Check if token has correct JWT format
        const parts = tokenToCheck.split('.')
        if (parts.length !== 3) return false

        // Check if token is not expired
        return !this.isTokenExpired(tokenToCheck)
    },

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
    },

    // Refresh token if needed
    async refreshTokenIfNeeded(): Promise<boolean> {
        const token = this.getToken()
        if (!token) return false

        if (this.isTokenExpired(token)) {
            console.log('🔄 Token expired, attempting refresh...')

            try {
                // Try to get a new token by calling /me endpoint
                // If it fails, it will automatically logout
                await this.getCurrentUser()
                return true
            } catch (error) {
                console.error('❌ Token refresh failed:', error)
                this.logout()
                return false
            }
        }

        return true // Token is still valid
    },

    // Get current user profile
    async getCurrentUser(): Promise<User> {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }

        // Check if token is still valid before making the request
        if (this.isTokenExpired(token)) {
            this.logout()
            throw new Error('401 - Token expired')
        }

        console.log('🔍 Fetching current user with token:', token.substring(0, 20) + '...')

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })

            console.log('📡 /me response status:', response.status)

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.log('🚪 Received 401/403 from /me endpoint')
                    this.logout()
                    throw new Error('401 - Invalid or expired token')
                }

                const errorData = await response.json().catch(() => ({}))
                throw new Error(`HTTP ${response.status} - ${errorData.detail || 'Failed to get current user'}`)
            }

            const userData = await response.json()
            console.log('✅ Current user data:', userData)

            // Update stored user data
            localStorage.setItem('user', JSON.stringify(userData))

            return userData
        } catch (error) {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Network error - please check your connection')
            }
            throw error
        }
    },

    // Logout (client-side)
    logout() {
        console.log('🚪 Logging out user...')
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        localStorage.removeItem('token_received_at')

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    },

    // Check if user is authenticated with valid token
    isAuthenticated(): boolean {
        const token = this.getToken()
        return token ? this.isValidToken(token) : false
    },

    // Save token with extended expiration
    saveToken(token: string) {
        localStorage.setItem('access_token', token)
        // Also save the timestamp when we received the token
        localStorage.setItem('token_received_at', Date.now().toString())
    },

    // Get token
    getToken(): string | null {
        return localStorage.getItem('access_token')
    }
}
