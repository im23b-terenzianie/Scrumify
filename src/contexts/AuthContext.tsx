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

    const isAuthenticated = authService.isAuthenticated()

    useEffect(() => {
        const initAuth = async () => {
            if (isAuthenticated) {
                try {
                    console.log('🔍 Attempting to load current user...')
                    const currentUser = await authService.getCurrentUser()
                    console.log('✅ Current user loaded:', currentUser)
                    setUser(currentUser)
                } catch (error) {
                    console.error('❌ Failed to get current user:', error)
                    // NUR ausloggen wenn es ein echter Auth-Fehler ist (401/403), nicht bei Netzwerkfehlern
                    if (error instanceof Error && error.message.includes('401')) {
                        console.log('🚪 Logging out due to invalid token')
                        authService.logout()
                    } else {
                        console.log('🔧 Network error, keeping user logged in')
                    }
                }
            }
            setIsLoading(false)
        }

        initAuth()
    }, [isAuthenticated])

    const login = async (credentials: LoginRequest) => {
        try {
            console.log('🔐 Attempting login for:', credentials.username)
            const response = await authService.login(credentials)
            authService.saveToken(response.access_token)

            console.log('✅ Login successful, setting user:', response.user)
            setUser(response.user)

            // Redirect to dashboard
            window.location.href = '/dashboard'
        } catch (error) {
            console.error('❌ Login failed:', error)
            throw error
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            console.log('📝 Attempting registration for:', userData.username)
            const response = await authService.register(userData)
            authService.saveToken(response.access_token)

            console.log('✅ Registration successful, setting user:', response.user)
            setUser(response.user)

            // Redirect to dashboard
            window.location.href = '/dashboard'
        } catch (error) {
            console.error('❌ Registration failed:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        authService.logout()
    }

    const refreshUser = async () => {
        try {
            if (isAuthenticated) {
                console.log('🔄 Refreshing user data...')
                const userData = await authService.getCurrentUser()
                setUser(userData)
                console.log('✅ User data refreshed:', userData)
            }
        } catch (error) {
            console.error('❌ Failed to refresh user data:', error)
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
