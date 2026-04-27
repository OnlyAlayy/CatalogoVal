import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Asegura que no se generen mapas de código original
    minify: 'terser', // Usa terser para una mejor ofuscación
    terserOptions: {
      compress: {
        drop_console: true, // Elimina los console.log
        drop_debugger: true // Elimina los debugger
      }
    }
  }
})
