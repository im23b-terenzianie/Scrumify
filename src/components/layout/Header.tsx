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
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0 z-10">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Scrumify
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
                            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform duration-200 block">
                                {isDark ? '🌞' : '🌙'}
                            </span>
                        </button>

                        {user && (
                            <>
                                <div className="hidden md:block">
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            Welcome back, {user.full_name || user.username}! 👋
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <span className="text-white text-lg font-bold">
                                            {(user.full_name || user.username).charAt(0).toUpperCase()}
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-2xl shadow-2xl py-2 z-50 border border-gray-200/50 dark:border-gray-700/50">
                                            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                        <span className="text-white font-bold">
                                                            {(user.full_name || user.username).charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-white">
                                                            {user.full_name || user.username}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                to="/profile"
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-xl mx-2"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <span>👤</span>
                                                </div>
                                                Profile Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-xl mx-2"
                                            >
                                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                                    <span>🚪</span>
                                                </div>
                                                Sign out
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
