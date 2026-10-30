import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            return 'vendor-react';
          }
          if (id.includes('/src/components/calculators/') || id.includes('/src/services/')) {
            return 'tcvn-calculators';
          }
        },
      },
    },
  },
})
