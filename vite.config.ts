import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": "/src",
        },
    },
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': {
                target: 'https://api.scrumify.site',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path
            }
        }
    },
    build: {
        outDir: 'dist',
    },
})
