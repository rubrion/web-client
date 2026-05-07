// Per-locale build-time constants. The PT clone overrides every value here.
// Everything else (seo.ts, SEO.astro, Navbar.tsx, Layout.astro) reads from this
// module so we never repeat the locale check in business logic.

export const LOCALE = 'en' as const;
export const HTML_LANG = 'en';
export const SITE_URL = 'https://rubrion.ai';
export const SITE_DOMAIN = 'rubrion.ai';

export const ALT_LOCALE = 'pt-BR' as const;
export const ALT_HTML_LANG = 'pt-BR';
export const ALT_URL = 'https://rubrion.com.br';

export const OG_LOCALE = 'en_US';
export const OG_LOCALE_ALT = 'pt_BR';

export const SUPPORT_EMAIL = 'hello@rubrion.ai';

export const LANG_LABEL = 'EN';
export const ALT_LANG_LABEL = 'PT';
export const ALT_LANG_ARIA = 'Switch to Portuguese (rubrion.com.br)';
