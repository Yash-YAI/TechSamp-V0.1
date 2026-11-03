import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const targetBackend = env.API_BASE_URL || env.VITE_API_BASE_URL || 'https://localhost:5003'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: targetBackend,
          changeOrigin: true,
          secure: false, // Accepts self-signed / mkcert certificates
        },
      },
    },
  }
})
