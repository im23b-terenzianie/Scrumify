/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./index.html"
    ],
    theme: {
        extend: {
            colors: {
                // 🎨 Deine Chat-Farben direkt als Tailwind Colors
                scrumify: {
                    // Dark Mode
                    'dark-bg': '#1E1E2E',
                    'dark-bg-secondary': '#2A2A3C',
                    'dark-chat-own': '#4C4C6D',
                    'dark-text': '#FFFFFF',
                    'dark-text-secondary': '#B0B0C3',
                    'dark-input': '#2A2A3C',
                    'dark-input-text': '#EAEAEA',
                    'dark-online': '#2ECC71',
                    'dark-error': '#FF5F5F',

                    // Light Mode
                    'light-bg': '#F4F4F9',
                    'light-bg-secondary': '#E4E4EE',
                    'light-chat-own': '#D2D2E0',
                    'light-text': '#1C1C1E',
                    'light-text-secondary': '#707080',
                    'light-input': '#FFFFFF',
                    'light-input-text': '#2B2B2D',
                    'light-online': '#27AE60',
                    'light-error': '#D93C3C',

                    // Shared
                    'accent': '#7F5AF0'
                }
            }
        }
    },
    plugins: []
}
