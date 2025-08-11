import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.tsx'
import Header from './Header.tsx'

export default function Layout() {
    return (
        <div className="h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col">
            {/* Fixed Header */}
            <Header />
            
            {/* Main Content Area with Sidebar and Scrollable Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Fixed Sidebar */}
                <Sidebar />
                
                {/* Scrollable Main Content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}