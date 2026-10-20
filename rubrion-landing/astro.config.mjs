// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// One codebase, two sites: `SITE_LOCALE=en` builds rubrion.ai, `SITE_LOCALE=pt`
// builds rubrion.com.br (see package.json). Each output is a whole site in one
// language, with hreflang pointing at its twin on the other domain; `npm run
// build` merges both for the one Worker that serves them (worker/index.ts).
const locale = process.env.SITE_LOCALE === 'pt' ? 'pt' : 'en';

// https://astro.build/config
export default defineConfig({
  site: locale === 'pt' ? 'https://rubrion.com.br' : 'https://rubrion.ai',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // VITE_* are non-secret build-time vars baked into the client bundle.
    envPrefix: ['PUBLIC_', 'VITE_'],
    define: { 'import.meta.env.SITE_LOCALE': JSON.stringify(locale) },
  },
});
