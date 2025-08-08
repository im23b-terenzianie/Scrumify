import { API_CONFIG } from '../api/config'

// Debug function to test API endpoints
export const testAPIEndpoints = async () => {
    const endpoints = [
        '/api/v1/auth/register',
        '/api/v1/auth/login',
        '/api/v1/auth/me',
        '/api/v1/projects/',
        '/api/v1/stories/'
    ]

    console.log('Testing API endpoints...')

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
                method: 'OPTIONS',
                headers: {
                    'Access-Control-Request-Method': 'GET',
                    'Access-Control-Request-Headers': 'Content-Type, Authorization'
                }
            })
            console.log(`✅ ${endpoint}: Available (${response.status})`)
        } catch (error: any) {
            console.log(`❌ ${endpoint}: ${error.message}`)
        }
    }
}
