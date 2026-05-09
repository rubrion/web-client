export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  liveUrl: string;
  repoUrl?: string;
  tags: string[];
  iconName: 'Newspaper' | 'Store' | 'Cpu';
  isSister?: boolean;
};

export const PROJECTS: Project[] = [
  {
    slug: 'edgepress',
    title: 'EdgePress',
    category: 'Plataforma whitelabel de newsletter',
    description:
      'Plataforma de newsletter auto-hospedável — domínio de envio com sua marca, segmentação de público e envio agendado. Disponível como deploy gerenciado ou fork.',
    liveUrl: 'https://edgepress.rubrion.ai',
    repoUrl: 'https://github.com/rubrion/edgepress',
    tags: ['Newsletter', 'Whitelabel', 'Auto-hospedável'],
    iconName: 'Newspaper',
  },
  {
    slug: 'store',
    title: 'Rubrion Store',
    category: 'Marketplace whitelabel',
    description:
      'Plataforma whitelabel de marketplace — vitrines multi-tenant, onboarding de vendedores, catálogo de produtos e custo de infraestrutura transparente. Para sua comunidade ou seus clientes.',
    liveUrl: 'https://rubrion.store',
    repoUrl: 'https://github.com/rubrion/store',
    tags: ['Marketplace', 'Multi-tenant', 'Whitelabel'],
    iconName: 'Store',
  },
  {
    slug: 'mondesa',
    title: 'Mondesa',
    category: 'IoT · WSN · Otimização de energia',
    description:
      'Iniciativa irmã focada em soluções IoT para sistemas críticos de energia — arquitetura de redes de sensores sem fio (WSN) e hardware robusto, projetado para confiabilidade em campo.',
    liveUrl: 'https://mondesa.org',
    repoUrl: 'https://github.com/mondesa',
    tags: ['IoT', 'WSN', 'Energia', 'Hardware'],
    iconName: 'Cpu',
    isSister: true,
  },
];
