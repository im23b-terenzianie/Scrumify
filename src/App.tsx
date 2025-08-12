import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Dashboard from './pages/DashboardNew'
import Projects from './pages/Projects'
import Board from './pages/Board'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
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
                    <Route path="projects/:projectId/board" element={<Board />} />
                    <Route path="profile" element={<UserProfile />} />
                </Route>
            </Routes>
            {/* <Toaster /> */}
        </AuthProvider>
    )
}

export default App
