// Per-locale constants. This is the ONLY file a translated clone needs to
// override (plus astro.config `site` + wrangler `name`/KV). Everything in
// seo.ts / Seo.astro / Layout.astro reads from here, so the SEO + GEO layer is
// reusable across the EN (rubrion.ai) and PT (rubrion.com.br) trees.

export const LOCALE = 'en' as const;
export const HTML_LANG = 'en';
export const SITE_URL = 'https://rubrion.ai';
export const SITE_DOMAIN = 'rubrion.ai';
export const OG_LOCALE = 'en_US';

export const ALT_LOCALE = 'pt-BR' as const;
export const ALT_HTML_LANG = 'pt-BR';
export const ALT_URL = 'https://rubrion.com.br';
export const OG_LOCALE_ALT = 'pt_BR';

// The canonical EN URL — used for hreflang x-default regardless of current locale.
export const EN_URL = 'https://rubrion.ai';

export const SUPPORT_EMAIL = 'hello@rubrion.ai';
export const LANG_LABEL = 'EN';
export const ALT_LANG_LABEL = 'PT';
