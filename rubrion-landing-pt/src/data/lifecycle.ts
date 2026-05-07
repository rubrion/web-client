export type LifecycleStage = {
  title: string;
  description: string;
  duration: string;
  iconName: 'Search' | 'Settings' | 'Package' | 'Palette' | 'TestTube' | 'Rocket';
};

export const lifecycle: LifecycleStage[] = [
  {
    title: 'Descoberta e Planejamento',
    description: 'Análise de requisitos e desenho de arquitetura',
    duration: '1-2 semanas',
    iconName: 'Search',
  },
  {
    title: 'Setup de Infraestrutura',
    description: 'Provisionamento do cluster Kubernetes e pipeline CI/CD',
    duration: '1 semana',
    iconName: 'Settings',
  },
  {
    title: 'Deploy dos Módulos',
    description: 'Instalação e configuração dos módulos principais',
    duration: '1-2 semanas',
    iconName: 'Package',
  },
  {
    title: 'Customização',
    description: 'Marca, integrações e funcionalidades específicas',
    duration: '2-4 semanas',
    iconName: 'Palette',
  },
  {
    title: 'Testes e QA',
    description: 'Testes abrangentes e otimização de performance',
    duration: '1 semana',
    iconName: 'TestTube',
  },
  {
    title: 'Go Live e Suporte',
    description: 'Deploy em produção e monitoramento contínuo',
    duration: 'Contínuo',
    iconName: 'Rocket',
  },
];
