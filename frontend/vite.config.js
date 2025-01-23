import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Accetta connessioni esterne
    port: 5173,       // Deve corrispondere alla porta esposta in docker-compose
    watch: {
      usePolling: true, // Utile su Docker/WSL per evitare problemi di hot-reload
    }
  }
})
