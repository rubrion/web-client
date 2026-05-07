import { HTML_LANG, SITE_URL, SUPPORT_EMAIL } from './locale';

export { SITE_URL, SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';
export const DEFAULT_TITLE =
  'Rubrion — Infraestrutura gerenciada e SaaS white-label';
export const DEFAULT_DESCRIPTION =
  'A Rubrion entrega módulos SaaS white-label gerenciados — CMS, e-commerce, LMS, base de conhecimento, comunicação, analytics — em Kubernetes e Terraform. Implantação em 6-10 semanas com custo de infraestrutura transparente, taxa fixa de serviço gerenciado, sem vendor lock-in e acesso ao código sob solicitação.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo_rubrion_ver4.png`;

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://linkedin.com/company/rubrion',
  'https://twitter.com/rubrion',
];

// Atomic Answers de 40-60 palavras, uma por seção. As mesmas strings alimentam
// <meta name="description">, descrições JSON-LD e os parágrafos BLUF visíveis.
export const BLUF = {
  hero: DEFAULT_DESCRIPTION,
  whoWeServe:
    'A Rubrion atende três segmentos: PMEs e startups que precisam de implantação rápida com custos previsíveis; escolas e organizações sem fins lucrativos que precisam de soluções acessíveis e voltadas à comunidade; e empresas que precisam de integrações personalizadas com segurança de nível corporativo e suporte dedicado.',
  whatWeDeliver:
    'A Rubrion entrega seis módulos prontos — Gestão de Conteúdo, E-Commerce, Gestão de Aprendizagem, Base de Conhecimento, Hub de Comunicação e Analytics — como deploys white-label, multi-tenant e isolados. Cada módulo roda na mesma plataforma Kubernetes, com infraestrutura provisionada via Terraform, suporte multilíngue e arquitetura API-first.',
  serviceLines:
    'Oferecemos SaaS Gerenciado (white-label) para deploys com sua marca, Gestão de Infraestrutura para times que querem nossa stack Kubernetes sem os módulos, e Desenvolvimento Sob Medida para integrações específicas sobre a plataforma.',
  deliveryLifecycle:
    'Todo projeto Rubrion segue o mesmo ciclo de seis etapas: Descoberta, Setup de Infraestrutura, Deploy de Módulos, Customização, Testes e Go-Live. Prazo típico ponta-a-ponta: 6-10 semanas. Deploys em produção incluem testes de carga, revisão de segurança e monitoramento contínuo após o handoff.',
  contact:
    'Para iniciar um projeto, envie um briefing com seu caso de uso, público-alvo e prazo. Resposta em até um dia útil pelo endereço ola@rubrion.com.br.',
} as const;

export const FAQ: { question: string; answer: string }[] = [
  {
    question: 'O que a Rubrion faz?',
    answer:
      'A Rubrion entrega módulos SaaS white-label gerenciados — CMS, e-commerce, LMS, base de conhecimento, comunicação, analytics — em Kubernetes e Terraform. Cada projeto vai ao ar em 6-10 semanas com custo de infraestrutura transparente e taxa fixa de serviço gerenciado. O acesso ao código-fonte é concedido sob solicitação e não há vendor lock-in.',
  },
  {
    question: 'Quão rápido a Rubrion implanta um novo tenant?',
    answer:
      'Implantações padrão levam de 6 a 10 semanas, ponta a ponta. Descoberta e arquitetura ocupam 1-2 semanas, o provisionamento de infraestrutura é automatizado e leva 1 semana, o deploy dos módulos leva 1-2 semanas, customização e integrações somam 2-4 semanas, e a fase final de QA + go-live adiciona 1 semana antes da entrega em produção.',
  },
  {
    question: 'Os clientes mantêm controle dos dados e da infraestrutura?',
    answer:
      'Sim. Cada tenant roda em infraestrutura isolada provisionada via Terraform na conta cloud do cliente ou em uma conta dedicada gerenciada pela Rubrion. Dados, configuração e código-fonte são de propriedade do cliente. A Rubrion oferece operação contínua, mas nunca detém controle exclusivo de um tenant.',
  },
  {
    question: 'Qual é o modelo de preço?',
    answer:
      'A Rubrion cobra o custo de infraestrutura como repasse direto mais uma taxa fixa de serviço gerenciado. Não há cobrança por usuário, não há licenciamento proprietário e não há multa por offboarding. O preço escala com o uso de infraestrutura — quando o uso cresce, só a conta de cloud subjacente cresce junto.',
  },
  {
    question: 'Quais tecnologias a Rubrion usa?',
    answer:
      'A plataforma roda em Kubernetes com Terraform para infraestrutura como código. Os módulos são construídos sobre fundações open-source e expostos via interfaces API-first. Os deploys rodam em qualquer cloud provider relevante (AWS, GCP, Azure) e integram com ferramentas padrão de observabilidade, identidade e CI/CD.',
  },
  {
    question: 'Existe vendor lock-in?',
    answer:
      'Não. Toda implantação Rubrion é construída em módulos open-source rodando na conta cloud do cliente. O código-fonte é fornecido sob solicitação, a infraestrutura é descrita em Terraform, e camadas de banco de dados, identidade e armazenamento usam padrões portáveis. O cliente pode internalizar a operação a qualquer momento.',
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
    'Gestão de Infraestrutura',
    'Software White-Label',
    'Operação de Kubernetes',
    'Automação com Terraform',
    'Arquitetura SaaS Multi-Tenant',
    'CMS Headless',
    'Plataformas de E-Commerce',
    'Sistemas de Gestão de Aprendizagem',
    'Software de Base de Conhecimento',
    'Comunicação em Tempo Real',
    'Business Intelligence',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Infraestrutura Gerenciada (Kubernetes + Terraform)',
      category: 'Gestão de Infraestrutura',
      description:
        'Clusters Kubernetes em nível de produção e infraestrutura gerenciada via Terraform, implantados e operados pela Rubrion. Inclui monitoramento, hardening de segurança e resposta on-call.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Módulos SaaS White-Label',
      category: 'Software White-Label',
      description:
        'Módulos prontos de CMS, E-Commerce, Gestão de Aprendizagem, Base de Conhecimento, Comunicação e Analytics, implantados como instâncias multi-tenant isoladas sob a marca do cliente.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Desenvolvimento e Integração Sob Medida',
      category: 'Engenharia de Software',
      description:
        'Desenvolvimento de módulos sob medida, integrações com terceiros, customização de API e otimização de performance sobre a plataforma Rubrion.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'Software como Serviço',
    'Soluções White-Label',
    'Infraestrutura em Nuvem',
    'Desenvolvimento Sob Medida',
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
