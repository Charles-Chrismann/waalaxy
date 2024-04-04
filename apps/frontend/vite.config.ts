import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "../../dist/frontend"
  },
  server: {
    host: 'localhost',
    proxy: {
      "/api": {
        "target": "http://localhost:3000",
        "changeOrigin": true
      },
      "/socket.io": {
        "target": "ws://localhost:3000",
        "ws": true
      }
    }
  },

  plugins: [react()],
})
