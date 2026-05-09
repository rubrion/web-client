// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://rubrion.ai',
  output: 'static',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // Astro defaults Vite's envPrefix to `PUBLIC_`. Keep `VITE_` working too so
    // `VITE_SUPPORT_WORKER_URL` and `VITE_TURNSTILE_SITE_KEY` reach the client.
    envPrefix: ['PUBLIC_', 'VITE_'],
  },
});
