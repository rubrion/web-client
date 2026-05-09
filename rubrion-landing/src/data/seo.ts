import { HTML_LANG, SITE_URL, SUPPORT_EMAIL } from './locale';

export { SITE_URL, SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';
export const DEFAULT_TITLE =
  'Rubrion — IT consulting · Whitelabel & bespoke software for SMBs';
export const DEFAULT_DESCRIPTION =
  'IT consulting for SMBs. Whitelabel products (EdgePress, Rubrion Store) and bespoke software on Kubernetes and Terraform.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo_rubrion_ver4.png`;

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://linkedin.com/company/rubrion',
  'https://twitter.com/rubrion',
];

// 40-60 word Atomic Answers, one per landing section.
// Same strings serve <meta name="description">, JSON-LD descriptions, and the
// visible BLUF paragraphs.
export const BLUF = {
  hero: 'Whitelabel and bespoke software for SMBs. Cheap, fast, transparent.',
  whoWeServe: 'SMBs, startups, schools, nonprofits, enterprises.',
  projects: 'What we ship — live URLs and source.',
  contact: 'Brief us. Reply within 24 hours.',
} as const;

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'What does Rubrion do?',
    answer:
      'IT consulting that builds, ships, and operates software for SMBs. Engagements blend whitelabel products (EdgePress newsletter, Rubrion Store marketplace) with bespoke integrations, delivered on Kubernetes and Terraform. SaaS deployment available when clients want it.',
  },
  {
    question: 'How fast can Rubrion deliver?',
    answer:
      'Standard consulting engagements ship in 6-10 weeks end to end. Discovery and architecture take 1-2 weeks, infrastructure provisioning is automated and runs in 1 week, product setup and integration take 2-4 weeks, customization extends 2-4 weeks more, and final QA + go-live adds 1 week before production handover.',
  },
  {
    question: 'What is the pricing model?',
    answer:
      'Rubrion charges a fixed-fee consulting engagement plus infrastructure passthrough. There are no per-seat fees, no proprietary licensing, and no penalty for offboarding. Pricing scales with infrastructure footprint — when usage grows, only the underlying cloud bill grows with it.',
  },
  {
    question: 'Do clients get source access?',
    answer:
      'Yes. Most Rubrion projects ship as open repositories under github.com/rubrion (EdgePress, Rubrion Store, etc.). Bespoke work is delivered with full source ownership to the client. Clients can fork, self-host, or migrate operations in-house at any time.',
  },
  {
    question: 'What kinds of projects does Rubrion take on?',
    answer:
      'Whitelabel newsletters, whitelabel marketplaces, custom web platforms, third-party integrations, and managed Kubernetes operations. IoT and wireless sensor network work goes through sister org Mondesa (mondesa.org).',
  },
  {
    question: 'Which technologies does Rubrion use?',
    answer:
      'The platform runs on Kubernetes with Terraform for infrastructure-as-code. Products are built on mature, community-driven foundations and exposed via API-first interfaces. Deployments run on any major cloud provider (AWS, GCP, Azure) and integrate with standard observability, identity, and CI/CD tooling.',
  },
];

export type SEOProps = {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
  extraJsonLd?: Record<string, unknown>[];
};

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  name: SITE_NAME,
  alternateName: 'Rubrion AI',
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
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
    'IT Consulting',
    'Whitelabel Software',
    'Newsletter Platforms',
    'Marketplace Software',
    'Bespoke Integrations',
    'Kubernetes Operations',
    'Terraform Automation',
    'SMB Software Delivery',
    'Multi-Tenant Architecture',
    'IoT Architecture',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Whitelabel Product Deployment',
      category: 'Whitelabel Software',
      description:
        'Branded deployments of Rubrion shipped products — EdgePress (newsletter), Rubrion Store (marketplace). Self-hosted by default; SaaS deployment available on request.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Bespoke Software Development',
      category: 'Engineering Services',
      description:
        'Custom web platforms, third-party integrations, and API customization. Fixed-fee consulting engagements with full source ownership delivered to the client.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Managed Infrastructure & Operations',
      category: 'Infrastructure Management',
      description:
        'Production-grade Kubernetes clusters and Terraform-managed infrastructure operated by Rubrion. Includes monitoring, security hardening, and on-call response.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'IT Consulting',
    'Whitelabel Solutions',
    'Custom Software Development',
    'Cloud Infrastructure',
  ],
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Mondesa',
      url: 'https://mondesa.org',
      description:
        'Sister organization focused on IoT solutions for critical energy systems and wireless sensor network architecture.',
    },
  ],
});

export const buildWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  inLanguage: HTML_LANG,
  publisher: {
    '@type': 'Corporation',
    name: SITE_NAME,
    url: SITE_URL,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const buildFaqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((entry) => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: entry.answer,
    },
  })),
});
