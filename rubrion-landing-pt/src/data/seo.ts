// SEO / GEO data + JSON-LD builders (PT-BR). Locale-specific URLs/email come
// from locale.ts so this layer mirrors the EN tree.
import { SITE_URL, SUPPORT_EMAIL, HTML_LANG } from './locale';

export { SUPPORT_EMAIL };

export const SITE_NAME = 'Rubrion';
export const SITE_TAGLINE = 'Code-free, cloud-fee.';

export const DEFAULT_DESCRIPTION =
  'A Rubrion é um estúdio de software para pequenas e médias empresas. Lance um produto pronto com a sua marca, adicione um agente de IA ou encomende um projeto sob medida. Rápido, preço fixo e o código é seu.';

export const OG_IMAGE_PATH = '/images/og.png';

export const SOCIALS = [
  'https://github.com/rubrion',
  'https://www.linkedin.com/company/rubrion',
];

// Single source of truth for the FAQ — used by the visible accordion and the
// FAQPage JSON-LD so the two never drift.
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Em quanto tempo vocês entregam?',
    a: 'Projetos padrão entram no ar em seis a dez semanas, da primeira conversa até a produção.',
  },
  {
    q: 'Como funciona o preço?',
    a: 'Trabalho com preço fixo, mais o custo da sua própria infraestrutura. Sem cobrança por usuário, sem aprisionamento e sem multa de saída.',
  },
  {
    q: 'O que vocês constroem é nosso?',
    a: 'Sim. Entregamos o código-fonte. Faça um fork, hospede você mesmo ou leve para dentro de casa quando quiser.',
  },
  {
    q: 'Onde vocês hospedam?',
    a: 'Mantemos hospedagem gerenciada no Brasil, Europa-Oeste e EUA-Leste. Escolha a região pela latência e residência de dados, ou deixe que hospedemos nas três. Também cobrimos suporte de rede e infraestrutura e segurança em seus sistemas.',
  },
  {
    q: 'Podemos lançar um produto com a nossa marca?',
    a: 'Sim. Nossos produtos prontos rodam com a sua marca: newsletters, um marketplace e agentes de IA. Veja a página de produtos para a lista completa.',
  },
  {
    q: 'Vocês fazem algo sob medida?',
    a: 'Sim. Web e mobile fullstack, com preço fixo e prazo fixo, e o código-fonte entregue a você.',
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
    availableLanguage: ['Portuguese', 'English'],
    areaServed: 'Worldwide',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressRegion: 'Brazil',
  },
  knowsAbout: [
    'Software white-label',
    'Plataformas de newsletter e publicação',
    'Software de marketplace',
    'Agentes de IA',
    'Desenvolvimento de software sob medida',
    'Desenvolvimento de apps mobile',
    'Hospedagem gerenciada',
    'Suporte de rede e infraestrutura',
    'Segurança de aplicações',
  ],
  offers: [
    {
      '@type': 'Offer',
      name: 'Lance um produto com a sua marca',
      category: 'Software white-label',
      description:
        'Produtos prontos que você roda como seus — newsletters e publicação, um marketplace multivendedor e mais. Hospede você mesmo ou deixe que rodemos para você.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Adicione um agente de IA',
      category: 'Agentes de IA',
      description:
        'Assistentes que conhecem a sua marca para marketing, atendimento e análise de documentos e currículos, implantados com a sua marca.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Encomende um projeto sob medida',
      category: 'Desenvolvimento de software',
      description:
        'Web e mobile fullstack, preço fixo e prazo fixo, com o código-fonte entregue a você.',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Hospedagem e infraestrutura gerenciadas',
      category: 'Gestão de infraestrutura',
      description:
        'Hospedagem, operação e segurança no Brasil, Europa-Oeste e EUA-Leste, com suporte de rede e infraestrutura em seus sistemas.',
      availability: 'https://schema.org/InStock',
    },
  ],
  serviceType: [
    'Software white-label',
    'Agentes de IA',
    'Desenvolvimento de software sob medida',
    'Hospedagem e infraestrutura gerenciadas',
  ],
  subOrganization: [
    {
      '@type': 'Organization',
      name: 'Mondesa',
      url: 'https://mondesa.org',
      description:
        'Organização irmã focada em IoT para sistemas críticos de energia e arquitetura de redes de sensores sem fio.',
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
