import { Routes, Route } from 'react-router-dom'
// import { Toaster } from './components/ui/toaster'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Board from './pages/Board'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="board/:projectId" element={<Board />} />
                </Route>
            </Routes>
            {/* <Toaster /> */}
        </>
    )
}

export default App
