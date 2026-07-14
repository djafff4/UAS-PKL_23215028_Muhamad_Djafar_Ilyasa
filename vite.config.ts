import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: parseInt(env.VITE_PORT || '3001'),
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:9000',
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2018',
      outDir: 'dist',
    },
  }
})
