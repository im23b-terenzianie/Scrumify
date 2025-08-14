import { Link, useLocation } from 'react-router-dom'
import { BarChart3, FolderOpen } from 'lucide-react'

const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <div className="w-48 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 shadow-xl border-r border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 overflow-y-auto backdrop-blur-sm">
            <div className="p-3">
                <nav className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href || (item.href === '/' && location.pathname === '/dashboard')
                        const IconComponent = item.icon

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-white/30'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${isActive
                                    ? 'bg-white/20'
                                    : 'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                                    }`}>
                                    <IconComponent className="w-4 h-4" />
                                </div>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
