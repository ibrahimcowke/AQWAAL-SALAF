import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-icon-192.png', 'pwa-icon-512.png', 'screenshot-mobile.png', 'screenshot-desktop.png'],
      manifest: {
        name: 'نور السلف - Noor Al-Salaf',
        short_name: 'نور السلف',
        description: 'منصة أقوال السلف الصالح والقصص والحكم',
        theme_color: '#1E3A34',
        background_color: '#F5F3EF',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: '/',
        lang: 'ar',
        dir: 'rtl',
        categories: ['education', 'lifestyle', 'books'],
        prefer_related_applications: false,
        iarc_rating_id: 'e6a8e6e8-2e8e-4e8e-8e8e-8e8e8e8e8e8e', // Placeholder IARC ID
        icons: [
          { 
            src: 'pwa-icon-192.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'any' 
          },
          { 
            src: 'pwa-icon-512.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable' 
          },
        ],
        screenshots: [
          {
            src: 'screenshot-mobile.png',
            sizes: '1024x1024',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Home Screen on Mobile'
          },
          {
            src: 'screenshot-desktop.png',
            sizes: '1024x1024',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Dashboard on Desktop'
          }
        ],
        shortcuts: [
          {
            name: 'البحث في الأقوال',
            short_name: 'بحث',
            description: 'ابحث في مكنونات علم السلف',
            url: '/search',
            icons: [{ src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'القصص والسير',
            short_name: 'قصص',
            description: 'عبر ومواقف من حياة سلفنا',
            url: '/qisas',
            icons: [{ src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'المفضلة',
            short_name: 'المفضلة',
            description: 'الأقوال التي حفظتها',
            url: '/favorites',
            icons: [{ src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ],
        launch_handler: {
          client_mode: ['focus-existing', 'navigate-existing']
        }
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { 
                cacheName: 'google-fonts-cache', 
                expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] }
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { 
                cacheName: 'gstatic-fonts-cache', 
                expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
                cacheableResponse: { statuses: [0, 200] }
            },
          },
        ],
      },
    }),
  ],
});
