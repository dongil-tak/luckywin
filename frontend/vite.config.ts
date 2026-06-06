import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-lotto-store': {
        target: 'https://api.odcloud.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-lotto-store/, '')
      }
    }
  }
})
