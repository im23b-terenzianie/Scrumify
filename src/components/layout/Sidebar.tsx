import { Link, useLocation } from 'react-router-dom'

const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Projects', href: '/projects', icon: '📁' },
]

export default function Sidebar() {
    const location = useLocation()

    return (
        <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex-shrink-0 overflow-y-auto">
            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href

                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
