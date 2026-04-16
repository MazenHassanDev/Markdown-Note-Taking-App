import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    allowedHosts : ['enchanting-connection-production-97b4.up.railway.app'],
    host: true,
    port: 5173,
  }
})
