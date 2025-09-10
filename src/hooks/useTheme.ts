import { useEffect, useState } from 'react'

export function useTheme() {
    // Initialize with the current DOM state to avoid flash
    const [isDark, setIsDark] = useState(() => {
        // Check if we're on the client side and if dark class is already set
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark')
        }
        return false
    })
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        // Sync with the actual DOM state on mount
        try {
            const hasClass = document.documentElement.classList.contains('dark')
            setIsDark(hasClass)
            setIsInitialized(true)
        } catch {
            setIsDark(false)
            setIsInitialized(true)
        }
    }, [])

    useEffect(() => {
        // Only save to localStorage after initialization to avoid hydration issues
        if (isInitialized) {
            document.documentElement.classList.toggle('dark', isDark)
            localStorage.setItem('theme', isDark ? 'dark' : 'light')
        }
    }, [isDark, isInitialized])

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    return { isDark, toggleTheme }
}
