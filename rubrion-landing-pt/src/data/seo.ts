import { HTML_LANG, SITE_URL, SUPPORT_EMAIL } from './locale';

export { SITE_URL, SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';
export const DEFAULT_TITLE =
  'Rubrion — Consultoria de TI · Whitelabel e software sob medida para PMEs';
export const DEFAULT_DESCRIPTION =
  'Consultoria de TI para PMEs. Produtos whitelabel (EdgePress, Rubrion Store) e software sob medida em Kubernetes e Terraform.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo_rubrion_ver4.png`;

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://linkedin.com/company/rubrion',
  'https://twitter.com/rubrion',
];

// Atomic Answers de 40-60 palavras, uma por seção. As mesmas strings alimentam
// <meta name="description">, descrições JSON-LD e os parágrafos BLUF visíveis.
export const BLUF = {
  hero: 'Whitelabel e software sob medida para PMEs. Barato, rápido, transparente.',
  whoWeServe: 'PMEs, startups, escolas, ONGs, empresas.',
  projects: 'O que entregamos — sites ao vivo e código aberto.',
  contact: 'Mande um briefing. Resposta em até 24 horas.',
} as const;

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'O que a Rubrion faz?',
    answer:
      'Consultoria de TI que constrói, entrega e opera software para PMEs. Projetos combinam produtos whitelabel (newsletter EdgePress, marketplace Rubrion Store) com integrações sob medida, entregues em Kubernetes e Terraform. Deploy SaaS disponível quando o cliente desejar.',
  },
  {
    question: 'Quão rápido a Rubrion entrega?',
    answer:
      'Projetos padrão vão ao ar em 6 a 10 semanas, ponta a ponta. Descoberta e arquitetura ocupam 1-2 semanas, o provisionamento de infraestrutura é automatizado e leva 1 semana, setup do produto e integrações levam 2-4 semanas, customização adiciona mais 2-4 semanas, e a fase final de QA + go-live soma 1 semana antes da entrega em produção.',
  },
  {
    question: 'Qual é o modelo de preço?',
    answer:
      'A Rubrion cobra uma taxa fixa de consultoria mais o custo de infraestrutura como repasse direto. Não há cobrança por usuário, não há licenciamento proprietário e não há multa por offboarding. O preço escala com o uso de infraestrutura — quando o uso cresce, só a conta de cloud subjacente cresce junto.',
  },
  {
    question: 'Os clientes têm acesso ao código-fonte?',
    answer:
      'Sim. A maioria dos projetos Rubrion é entregue como repositórios abertos em github.com/rubrion (EdgePress, Rubrion Store etc.). Trabalhos sob medida são entregues com a propriedade total do código ao cliente. O cliente pode fazer fork, auto-hospedar ou internalizar a operação a qualquer momento.',
  },
  {
    question: 'Que tipos de projetos a Rubrion aceita?',
    answer:
      'Newsletters whitelabel, marketplaces whitelabel, plataformas web sob medida, integrações com terceiros e operação gerenciada de Kubernetes. IoT e redes de sensores sem fio são entregues pela organização irmã Mondesa (mondesa.org).',
  },
  {
    question: 'Quais tecnologias a Rubrion usa?',
    answer:
      'A plataforma roda em Kubernetes com Terraform para infraestrutura como código. Os produtos são construídos sobre fundações maduras dirigidas pela comunidade e expostos via interfaces API-first. Os deploys rodam em qualquer cloud provider relevante (AWS, GCP, Azure) e integram com ferramentas padrão de observabilidade, identidade e CI/CD.',
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
  // Organization is a single entity. Both locale sites point at the canonical
  // EN URL for org-level identity. Localized content lives in description.
  url: 'https://rubrion.ai',
  logo: 'https://rubrion.ai/logo_rubrion_ver4.png',
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
    'Consultoria de TI',
    'Software Whitelabel',
    'Plataformas de Newsletter',
    'Software de Marketplace',
    'Integrações Sob Medida',
    'Operação de Kubernetes',
    'Automação com Terraform',
    'Entrega de Software para PMEs',
    'Arquitetura Multi-Tenant',
    'Arquitetura IoT',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Implantação de Produto Whitelabel',
      category: 'Software Whitelabel',
      description:
        'Deploys com sua marca dos produtos Rubrion — EdgePress (newsletter), Rubrion Store (marketplace). Auto-hospedado por padrão; deploy SaaS disponível sob solicitação.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Desenvolvimento Sob Medida',
      category: 'Engenharia de Software',
      description:
        'Plataformas web sob medida, integrações com terceiros e customização de APIs. Projetos de consultoria com taxa fixa e propriedade total do código entregue ao cliente.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Infraestrutura Gerenciada e Operações',
      category: 'Gestão de Infraestrutura',
      description:
        'Clusters Kubernetes em nível de produção e infraestrutura gerenciada via Terraform, operados pela Rubrion. Inclui monitoramento, hardening de segurança e resposta on-call.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'Consultoria de TI',
    'Soluções Whitelabel',
    'Desenvolvimento de Software Sob Medida',
    'Infraestrutura em Nuvem',
  ],
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Mondesa',
      url: 'https://mondesa.org',
      description:
        'Organização irmã focada em soluções IoT para sistemas críticos de energia e arquitetura de redes de sensores sem fio.',
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
    url: 'https://rubrion.ai',
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
