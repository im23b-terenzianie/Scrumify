import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
    const [isDark, setIsDark] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const { user, logout } = useAuth()

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }

    const handleLogout = () => {
        logout()
        setShowDropdown(false)
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0 z-10">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/dashboard" className="text-2xl font-bold text-purple-600">
                        Scrumify
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDark ? '🌞' : '🌙'}
                        </button>

                        {user && (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Welcome back, {user.full_name || user.username}!
                                </span>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                                    >
                                        <span className="text-white text-sm font-medium">
                                            {(user.full_name || user.username).charAt(0).toUpperCase()}
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                                            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                                <div className="font-medium">{user.full_name || user.username}</div>
                                                <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowDropdown(false)}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                👤 Profile Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                🚪 Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
