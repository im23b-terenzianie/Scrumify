import { useEffect, useState } from 'react'

export function useTheme() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check saved theme or system preference
        const saved = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const shouldBeDark = saved === 'dark' || (!saved && prefersDark)

        setIsDark(shouldBeDark)
        document.documentElement.classList.toggle('dark', shouldBeDark)
    }, [])

    const toggleTheme = () => {
        const newTheme = !isDark
        setIsDark(newTheme)
        localStorage.setItem('theme', newTheme ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', newTheme)
    }

    return { isDark, toggleTheme }
}
