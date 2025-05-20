import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ViteRestart from 'vite-plugin-restart'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteRestart({
      restart: [
        'tailwind.config.js',
        'postcss.config.js',
      ],
    }),
  ],
  server: {
    host: true, // or '0.0.0.0'
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5002', // Your Flask backend
        changeOrigin: true,
        // secure: false, // uncomment if your backend is not https
        // rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix if Flask doesn't expect it
      }
    }
  }
})