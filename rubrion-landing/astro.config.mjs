// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// One codebase, two sites: `SITE_LOCALE=en` builds rubrion.ai, `SITE_LOCALE=pt`
// builds rubrion.com.br (see package.json). Each output is a whole site in one
// language, with hreflang pointing at its twin on the other domain.
const locale = process.env.SITE_LOCALE === 'pt' ? 'pt' : 'en';

// https://astro.build/config
export default defineConfig({
  site: locale === 'pt' ? 'https://rubrion.com.br' : 'https://rubrion.ai',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  adapter: cloudflare({
    imageService: 'compile',
    // Each site has its own Worker; the build bakes the matching config into
    // dist/server/wrangler.json, so a plain `wrangler deploy` targets it.
    configPath: locale === 'pt' ? 'wrangler.pt.jsonc' : 'wrangler.jsonc',
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // VITE_* are non-secret build-time vars baked into the client bundle.
    envPrefix: ['PUBLIC_', 'VITE_'],
    define: { 'import.meta.env.SITE_LOCALE': JSON.stringify(locale) },
  },
});
