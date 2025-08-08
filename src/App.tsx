import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
// import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Board from './pages/Board'
import Login from './pages/Login'
import Register from './pages/Register'
import { testBackendConnection, testAuthEndpoints } from './utils/backendTest'

function App() {
    useEffect(() => {
        // Test Backend Connection on App Start
        testBackendConnection().then(isHealthy => {
            if (isHealthy) {
                console.log('🚀 Backend is ready! Using live API.')
                testAuthEndpoints()
            } else {
                console.warn('⚠️ Backend connection issues detected.')
            }
        })
    }, [])

    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="board/:projectId" element={<Board />} />
                </Route>
            </Routes>
            {/* <Toaster /> */}
        </AuthProvider>
    )
}

export default App
