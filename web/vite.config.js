import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  server: {
    proxy: {
      '/api': { // เพิ่มตรงนี้เข้ามา
        target: 'https://641f-2405-9800-b660-3c9b-a0a3-c201-d002-a5a3.ngrok-free.app/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      }
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})