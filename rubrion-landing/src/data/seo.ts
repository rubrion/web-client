// SEO / GEO data + JSON-LD builders. Content follows the outcome-first
// positioning (no tool names); locale-specific URLs/email come from locale.ts
// so this layer is reusable across the EN and PT trees.
import { SITE_URL, SUPPORT_EMAIL, HTML_LANG } from './locale';

export { SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';

export const DEFAULT_DESCRIPTION =
  'Rubrion is a software studio for small and mid-sized businesses. Launch a ready-made product under your brand, add an AI agent, or commission a custom build. Fast, fixed-fee, and yours to keep.';

export const OG_IMAGE_PATH = '/images/og.png';

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://www.linkedin.com/company/rubrion',
];

// Single source of truth for the FAQ — used by the visible accordion and the
// FAQPage JSON-LD so the two never drift.
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'How fast can you ship?',
    a: 'Standard projects go live in six to ten weeks, from first call to production.',
  },
  {
    q: 'How does pricing work?',
    a: 'Fixed-fee work, plus your own infrastructure cost. No per-seat fees, no lock-in, and no offboarding penalty.',
  },
  {
    q: 'Do we own what you build?',
    a: 'Yes. We deliver the source. Fork it, self-host it, or take it in-house anytime.',
  },
  {
    q: 'Where do you host?',
    a: 'We run managed hosting in Brazil, Europe-West, and US-East. Pick the region for your latency and data residency, or let us host across all three. We also cover network and infrastructure support and security across your systems.',
  },
  {
    q: 'Can we launch a product under our own brand?',
    a: 'Yes. Our ready-made products run under your brand: newsletters, a marketplace, and AI agents. See the products page for the full lineup.',
  },
  {
    q: 'Can you build something custom?',
    a: 'Yes. Fullstack web and mobile, on a fixed fee and a fixed timeline, with the source delivered to you.',
  },
];

export type JsonLd = Record<string, unknown>;

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
  knowsAbout: [
    'White-label software',
    'Newsletter and publishing platforms',
    'Marketplace software',
    'AI agents',
    'Custom software development',
    'Mobile app development',
    'Managed hosting',
    'Network and infrastructure support',
    'Application security',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Launch a product under your brand',
      category: 'White-label software',
      description:
        'Ready-made products you run as your own — newsletters and publishing, a multi-vendor marketplace, and more. Self-host or let us run it.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Add an AI agent',
      category: 'AI agents',
      description:
        'Brand-aware assistants for marketing, customer chat, and document and CV review, deployed under your brand.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Commission a custom build',
      category: 'Software development',
      description:
        'Fullstack web and mobile, fixed fee and fixed timeline, with the source delivered to you.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Managed hosting & infrastructure',
      category: 'Infrastructure management',
      description:
        'Hosting, operation, and security in Brazil, Europe-West, and US-East, with network and infrastructure support across your systems.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'White-label software',
    'AI agents',
    'Custom software development',
    'Managed hosting and infrastructure',
  ],
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Mondesa',
      url: 'https://mondesa.org',
      description:
        'Sister organization focused on IoT for critical energy systems and wireless sensor network architecture.',
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
