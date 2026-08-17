import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'RB Clean — Limpeza & Higiene',
        short_name: 'RB Clean',
        description: 'Catálogo online de produtos de limpeza. Monte seu pedido e envie direto pelo WhatsApp.',
        theme_color: '#4a63d6',
        background_color: '#f7f9fd',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'pt-BR',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,ico,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    // Porta fixa e diferente de 5173 — evita colidir com o PWA "Listinha"
    // que ficou instalado no Chrome amarrado a localhost:5173.
    port: 5180,
    strictPort: true,
    // Abre automaticamente no navegador do sistema (não no preview do VS Code).
    // O navegador usado é controlado pela env BROWSER (ver .env).
    open: true,
  },
})
