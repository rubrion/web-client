export type Service = {
  title: string;
  description: string;
  features: string[];
  cta: string;
  iconName: 'Rocket' | 'Settings' | 'Hammer';
};

export const services: Service[] = [
  {
    title: 'SaaS Gerenciado (White-Label)',
    description: 'Deploy SaaS white-label completo com a sua marca',
    features: [
      'Domínio e marca personalizados',
      'Instâncias isoladas por tenant',
      'Escalabilidade e monitoramento automatizados',
      'Suporte de infraestrutura 24/7',
    ],
    cta: 'Iniciar minha instância',
    iconName: 'Rocket',
  },
  {
    title: 'Desenvolvimento Sob Medida',
    description: 'Módulos e integrações sob medida para suas necessidades',
    features: [
      'Desenvolvimento de módulos customizados',
      'Integrações com terceiros',
      'Customização de API',
      'Otimização de performance',
    ],
    cta: 'Discutir requisitos',
    iconName: 'Settings',
  },
  {
    title: 'Suporte e Manutenção',
    description: 'Suporte contínuo e melhorias evolutivas',
    features: [
      'Suporte técnico',
      'Atualizações de segurança',
      'Monitoramento de performance',
      'Evolução de funcionalidades',
    ],
    cta: 'Solicitar suporte',
    iconName: 'Hammer',
  },
];
