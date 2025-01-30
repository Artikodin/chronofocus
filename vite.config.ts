import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import type { VitePWAOptions } from 'vite-plugin-pwa';

const PWA_CONFIG: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true, // Enable PWA in development
  },
  manifest: {
    name: 'Chrono Focus',
    short_name: 'Chrono Focus',
    start_url: '.',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: '/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
  },
};

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [react(), VitePWA(PWA_CONFIG)],
});
