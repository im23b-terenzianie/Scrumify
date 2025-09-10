import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/auth'
import type { User, LoginRequest, RegisterRequest } from '../types'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (credentials: LoginRequest) => Promise<void>
    register: (userData: RegisterRequest) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check if user is authenticated with valid token
    const isAuthenticated = authService.isAuthenticated()

    useEffect(() => {
        const initAuth = async () => {
            if (isAuthenticated) {
                try {

                    // Check if token needs refresh
                    const tokenValid = await authService.refreshTokenIfNeeded()
                    if (!tokenValid) {
                        setIsLoading(false)
                        return
                    }

                    const currentUser = await authService.getCurrentUser()
                    setUser(currentUser)
                } catch (error) {
                    console.error('Failed to get current user:', error)

                    // If it's an auth error, logout. Otherwise keep trying
                    if (error instanceof Error &&
                        (error.message.includes('401') ||
                            error.message.includes('403') ||
                            error.message.includes('Authentication'))) {
                        authService.logout()
                    }
                }
            }
            setIsLoading(false)
        }

        initAuth()

        // Set up periodic token validation (every 5 minutes)
        const tokenCheckInterval = setInterval(async () => {
            if (authService.isAuthenticated()) {
                const tokenValid = await authService.refreshTokenIfNeeded()
                if (!tokenValid) {
                    setUser(null)
                }
            }
        }, 5 * 60 * 1000) // Check every 5 minutes

        return () => clearInterval(tokenCheckInterval)
    }, [isAuthenticated])

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials)
            authService.saveToken(response.access_token)


            setUser(response.user)

            // Redirect to dashboard
            window.location.href = '/app/dashboard'
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            const response = await authService.register(userData)
            authService.saveToken(response.access_token)

            setUser(response.user)

            // Redirect to dashboard
            window.location.href = '/app/dashboard'
        } catch (error) {
            console.error('Registration failed:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        authService.logout()
    }

    const refreshUser = async () => {
        try {
            if (authService.isAuthenticated()) {

                // Ensure token is still valid before refreshing
                const tokenValid = await authService.refreshTokenIfNeeded()
                if (!tokenValid) {
                    setUser(null)
                    return
                }

                const userData = await authService.getCurrentUser()
                setUser(userData)

            }
        } catch (error) {
            console.error('Failed to refresh user data:', error)

            // If refresh fails due to auth issues, logout
            if (error instanceof Error &&
                (error.message.includes('401') ||
                    error.message.includes('403') ||
                    error.message.includes('Authentication'))) {
                logout()
            }
        }
    }

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
