import { defineConfig } from 'vite'
import { react } from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Ensures paths don't break on GitHub Pages subdirectories
})
