import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/api/auth': 'http://localhost:8000',
            '/api/user': 'http://localhost:8000',
            '/api/reports': 'http://localhost:8000',
            '/api/scan': 'http://localhost:8000',
            '/api/report/comments': 'http://localhost:8000'
        }
    },

    plugins: [
        react(),
        tailwindcss()
    ],
})
