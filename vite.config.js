import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  base: './',
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate', // or 'prompt'
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
      name: 'Phenom Ventures ISP Manager',
      short_name: 'Phenom ISP',
      description: 'Comprehensive ISP management system by Phenom Ventures for efficient network operations and customer service',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'wifi.svg',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'wifi.svg',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),],
})
