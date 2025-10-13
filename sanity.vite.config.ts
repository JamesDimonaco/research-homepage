import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    dedupe: ['@sanity/ui', '@sanity/icons', 'react', 'react-dom', 'styled-components'],
  },
  optimizeDeps: {
    include: ['@sanity/ui', '@sanity/icons'],
  },
})
