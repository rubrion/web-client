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
    category: 'Whitelabel newsletter platform',
    description:
      'Self-hostable newsletter platform — branded sender domain, audience segmentation, scheduled delivery. Ships as a managed deploy or a fork.',
    liveUrl: 'https://edgepress.rubrion.ai',
    repoUrl: 'https://github.com/rubrion/edgepress',
    tags: ['Newsletter', 'Whitelabel', 'Self-hostable'],
    iconName: 'Newspaper',
  },
  {
    slug: 'store',
    title: 'Rubrion Store',
    category: 'Whitelabel marketplace',
    description:
      'Whitelabel marketplace platform — multi-tenant storefronts, vendor onboarding, product catalog, transparent infra cost. Run it for your community or your customers.',
    liveUrl: 'https://rubrion.store',
    repoUrl: 'https://github.com/rubrion/store',
    tags: ['Marketplace', 'Multi-tenant', 'Whitelabel'],
    iconName: 'Store',
  },
  {
    slug: 'mondesa',
    title: 'Mondesa',
    category: 'IoT · WSN · Energy optimization',
    description:
      'Sister initiative focused on IoT solutions for critical energy systems — wireless sensor network architecture and robust hardware engineered for reliability in the field.',
    liveUrl: 'https://mondesa.org',
    repoUrl: 'https://github.com/mondesa',
    tags: ['IoT', 'WSN', 'Energy', 'Hardware'],
    iconName: 'Cpu',
    isSister: true,
  },
];
