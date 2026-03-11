import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['56b2-2401-4900-7c7d-449d-58e-2586-42c6-a542.ngrok-free.app'],
    proxy: {
      '/api': 'http://prepify-production-c18f.up.railway.app/'  // ← add this
    }
  },
})  