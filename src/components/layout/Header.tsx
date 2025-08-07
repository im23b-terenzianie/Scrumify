import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Header() {
    const [isDark, setIsDark] = useState(false)

    const toggleTheme = () => {
        setIsDark(!isDark)
        document.documentElement.classList.toggle('dark')
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-purple-600">
                        Scrumify
                    </Link>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isDark ? '🌞' : '🌙'}
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Welcome back!</span>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">U</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
