import { HTML_LANG, SITE_URL, SUPPORT_EMAIL } from './locale';

export { SITE_URL, SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';
export const DEFAULT_TITLE =
  'Rubrion — Managed Infrastructure & White-Label SaaS';
export const DEFAULT_DESCRIPTION =
  'Rubrion delivers managed white-label SaaS modules — CMS, e-commerce, LMS, knowledge base, comms, analytics — on Kubernetes and Terraform. Deploy in 6-10 weeks with transparent infrastructure cost plus a flat service fee, no vendor lock-in, full source access on request.';
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
  hero: DEFAULT_DESCRIPTION,
  whoWeServe:
    'Rubrion serves three segments: SMBs and startups that need fast deployment with predictable costs, schools and nonprofits that need cost-effective community-focused tooling, and enterprises that need custom integrations with enterprise-grade security and dedicated support.',
  whatWeDeliver:
    'Rubrion delivers six pre-built modules — Content Management, E-Commerce, Learning Management, Knowledge Base, Communication Hub, Analytics — as isolated, multi-tenant white-label deployments. Each module ships on the same Kubernetes platform, with Terraform-managed infrastructure, multi-language support, and API-first design.',
  serviceLines:
    'We offer Managed SaaS (white-label) for turnkey branded deployments, Infrastructure Management for teams who want our Kubernetes stack without the modules, and Custom Build for bespoke integrations on top of the platform.',
  deliveryLifecycle:
    'Every Rubrion engagement runs the same six-stage lifecycle: Discovery, Infrastructure Setup, Module Deployment, Customization, Testing, and Go-Live. Typical end-to-end timeline is 6-10 weeks. Production deployments include load testing, security review, and ongoing monitoring after handover.',
  contact:
    'To start a project, send a brief about your use case, target users, and timeline. Responses arrive within one business day from hello@rubrion.ai.',
} as const;

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'What does Rubrion do?',
    answer:
      'Rubrion delivers managed white-label SaaS modules — CMS, e-commerce, LMS, knowledge base, comms, analytics — on Kubernetes and Terraform. Each engagement ships in 6-10 weeks with transparent infrastructure cost plus a flat managed-service fee. Source access is granted on request and there is no vendor lock-in.',
  },
  {
    question: 'How fast can Rubrion deploy a new tenant?',
    answer:
      'Standard deployments take 6-10 weeks end to end. Discovery and architecture take 1-2 weeks, infrastructure provisioning is automated and runs in 1 week, module deployment is 1-2 weeks, customization and integrations take 2-4 weeks, and the final QA + go-live phase adds 1 week before production handover.',
  },
  {
    question: 'Do clients own their data and infrastructure?',
    answer:
      'Yes. Each tenant runs on isolated infrastructure provisioned through Terraform on the client account or a dedicated Rubrion-managed account. Data, configuration, and source code are owned by the client. Rubrion provides operational support but never holds exclusive control over a tenant.',
  },
  {
    question: 'What is the pricing model?',
    answer:
      'Rubrion charges infrastructure cost as a passthrough plus a flat managed-service fee. There are no per-seat fees, no proprietary licensing fees, and no penalty for offboarding. Pricing scales with infrastructure footprint — when usage grows, only the underlying cloud bill grows with it.',
  },
  {
    question: 'Which technologies does Rubrion use?',
    answer:
      'The platform runs on Kubernetes with Terraform for infrastructure-as-code. Modules are built on open-source foundations and exposed via API-first interfaces. Deployments run on any major cloud provider (AWS, GCP, Azure) and integrate with standard observability, identity, and CI/CD tooling.',
  },
  {
    question: 'Is there vendor lock-in?',
    answer:
      'No. Every Rubrion deployment is built on open-source modules running on the client cloud account. Source code is granted on request, infrastructure is described in Terraform, and the database, identity provider, and storage layers use portable standards. Clients can offboard to in-house operations at any time.',
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
    'Infrastructure Management',
    'White-Label Software',
    'Kubernetes Operations',
    'Terraform Automation',
    'Multi-Tenant SaaS Architecture',
    'Headless CMS',
    'E-Commerce Platforms',
    'Learning Management Systems',
    'Knowledge Base Software',
    'Real-Time Communication',
    'Business Intelligence',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Managed Infrastructure (Kubernetes + Terraform)',
      category: 'Infrastructure Management',
      description:
        'Production-grade Kubernetes clusters and Terraform-managed infrastructure deployed and operated by Rubrion. Includes monitoring, security hardening, and on-call response.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'White-Label SaaS Modules',
      category: 'White-Label Software',
      description:
        'Pre-built CMS, E-Commerce, Learning Management, Knowledge Base, Communication, and Analytics modules deployed as isolated multi-tenant instances under client branding.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Custom Build & Integration',
      category: 'Engineering Services',
      description:
        'Bespoke module development, third-party integrations, API customization, and performance optimization on top of the Rubrion platform.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'Software as a Service',
    'White-Label Solutions',
    'Cloud Infrastructure',
    'Custom Development',
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
