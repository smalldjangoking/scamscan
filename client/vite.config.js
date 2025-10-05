import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/auth': 'http://localhost:8000',
            '/user': 'http://localhost:8000',
            '/reports': 'http://localhost:8000'
        }
    },

    plugins: [
        react(),
        tailwindcss()
    ],
})
