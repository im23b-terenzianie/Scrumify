// Backend Connection Test
export async function testBackendConnection() {
    try {
        const response = await fetch('https://api.scrumify.site/health')
        const data = await response.json()

        console.log('✅ Backend Connection Successful!', data)
        return data.status === 'healthy'
    } catch (error) {
        console.error('❌ Backend Connection Failed!', error)
        return false
    }
}

// Test authentication endpoints
export async function testAuthEndpoints() {
    console.log('🧪 Testing Backend Auth Endpoints...')

    try {
        // Test docs endpoint
        const docsResponse = await fetch('https://api.scrumify.site/docs')
        console.log(docsResponse.ok ? '✅ Docs endpoint: OK' : '❌ Docs endpoint: FAILED')

        // Test auth endpoints structure (without actual auth)
        const endpoints = [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/auth/me'
        ]

        for (const endpoint of endpoints) {
            try {
                await fetch(`https://api.scrumify.site${endpoint}`, { method: 'OPTIONS' })
                console.log(`✅ ${endpoint}: Available`)
            } catch (error) {
                console.log(`❌ ${endpoint}: Not available`)
            }
        }

    } catch (error) {
        console.error('❌ Auth Endpoints Test Failed:', error)
    }
}
