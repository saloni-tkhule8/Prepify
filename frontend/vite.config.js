import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: 'all',
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['miraculous-reprieve-production.up.railway.app']
  }
})
