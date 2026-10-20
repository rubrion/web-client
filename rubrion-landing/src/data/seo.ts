// SEO / GEO data + JSON-LD builders. Locale-specific URLs/email come from
// locale.ts and copy from site.ts, so both sites share this file.
import { LANG, SITE_URL, SUPPORT_EMAIL, HTML_LANG, l } from './locale';
import { c } from './site';

export { SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = c.tagline;

export const DEFAULT_DESCRIPTION = l({
  en: 'Rubrion is a software studio for small and mid-sized businesses: web platforms and portals, AI agents, data and optimisation, websites, and white-label products. High quality on lean infrastructure, at a fair price, and the code is yours.',
  pt: 'A Rubrion é um estúdio de software para pequenas e médias empresas: plataformas e portais, agentes de IA, dados e otimização, sites e produtos white-label. Alta qualidade em infraestrutura enxuta, por um preço justo, e o código é seu.',
});

export const OG_IMAGE_PATH = LANG === 'pt' ? '/images/og-pt.png' : '/images/og.png';

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://www.linkedin.com/company/rubrion',
  'https://www.instagram.com/rubrion',
  'https://x.com/rubrion_tech',
];

// Single source of truth for the FAQ — used by the visible accordion and the
// FAQPage JSON-LD so the two never drift.
export const FAQS: { q: string; a: string }[] = c.faq.items.map(([q, a]) => ({ q, a }));

export type JsonLd = Record<string, unknown>;

const services = Object.values(c.services.items);

export const buildOrganizationSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  alternateName: 'Rubrion AI',
  url: SITE_URL,
  logo: `${SITE_URL}${OG_IMAGE_PATH}`,
  description: DEFAULT_DESCRIPTION,
  slogan: SITE_TAGLINE,
  foundingDate: '2024',
  sameAs: SOCIALS,
  contactPoint: {
    '@type': 'ContactPoint',
    email: SUPPORT_EMAIL,
    contactType: 'customer service',
    availableLanguage: ['English', 'Portuguese'],
    areaServed: 'Worldwide',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressRegion: 'Brazil',
  },
  knowsAbout: [...services.map(([name]) => name), l({ en: 'Managed hosting', pt: 'Hospedagem gerenciada' })],
  makesOffer: services.map(([name, text]) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name, description: text },
    availability: 'https://schema.org/InStock',
  })),
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Mondesa',
      url: 'https://mondesa.org',
      description: l({
        en: 'Sister organization focused on IoT for critical energy systems and wireless sensor network architecture.',
        pt: 'Organização irmã focada em IoT para sistemas críticos de energia e arquitetura de redes de sensores sem fio.',
      }),
    },
  ],
});

export const buildWebSiteSchema = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: HTML_LANG,
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const buildFaqSchema = (faqs: { q: string; a: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((entry) => ({
    '@type': 'Question',
    name: entry.q,
    acceptedAnswer: { '@type': 'Answer', text: entry.a },
  })),
});

export const buildBreadcrumbSchema = (trail: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: `${SITE_URL}${t.path}`,
  })),
});
