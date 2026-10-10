import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/THE_SEOUL_FOOD_REACT/',   // 👈 importante para GitHub Pages
})
