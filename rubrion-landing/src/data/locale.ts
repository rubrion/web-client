// Per-build locale. `SITE_LOCALE` (astro.config.mjs) picks which of the two
// sites this build is: English on rubrion.ai or Portuguese on rubrion.com.br.
// Everything locale-specific (SEO, copy, the language switch) reads from here.

export type Lang = 'en' | 'pt';
export const LANG: Lang = import.meta.env.SITE_LOCALE === 'pt' ? 'pt' : 'en';
const pt = LANG === 'pt';

export const LOCALE = pt ? ('pt-BR' as const) : ('en' as const);
export const HTML_LANG = pt ? 'pt-BR' : 'en';
export const SITE_URL = pt ? 'https://rubrion.com.br' : 'https://rubrion.ai';
export const SITE_DOMAIN = pt ? 'rubrion.com.br' : 'rubrion.ai';
export const OG_LOCALE = pt ? 'pt_BR' : 'en_US';

export const ALT_LOCALE = pt ? ('en' as const) : ('pt-BR' as const);
export const ALT_HTML_LANG = pt ? 'en' : 'pt-BR';
export const ALT_URL = pt ? 'https://rubrion.ai' : 'https://rubrion.com.br';
export const OG_LOCALE_ALT = pt ? 'en_US' : 'pt_BR';

// The canonical EN URL — used for hreflang x-default regardless of current locale.
export const EN_URL = 'https://rubrion.ai';

export const SUPPORT_EMAIL = pt ? 'ola@rubrion.com.br' : 'hello@rubrion.ai';
export const LANG_LABEL = pt ? 'PT' : 'EN';
export const ALT_LANG_LABEL = pt ? 'EN' : 'PT';

/** A value in both languages; `l()` picks this build's. */
export type L<T = string> = Record<Lang, T>;
export const l = <T,>(v: L<T>): T => v[LANG];

/** Page path without the `.html` that `build.format: 'file'` puts in Astro.url. */
export const cleanPath = (p: string) => p.replace(/(\/index)?\.html$/, '').replace(/(.)\/$/, '$1') || '/';
