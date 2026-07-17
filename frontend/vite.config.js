import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxies API calls to the Flask backend during development so the
    // backend needs zero changes (no CORS setup required on app.py).
    // Set the backend URL/port via VITE_BACKEND_URL if it's not the Flask default.
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
