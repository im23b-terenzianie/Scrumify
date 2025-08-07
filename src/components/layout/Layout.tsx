import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.tsx'
import Header from './Header.tsx'

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}