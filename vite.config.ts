import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // Essencial para o Render
    port: 10000 // Essencial para o Render
  }
})