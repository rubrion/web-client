export type Segment = {
  title: string;
  description: string;
  iconName: 'Rocket' | 'GraduationCap' | 'Building2';
  features: string[];
};

export const segments: Segment[] = [
  {
    title: 'PMEs e Startups',
    description: 'Implantação rápida, custos previsíveis, escala conforme você cresce',
    iconName: 'Rocket',
    features: ['Time-to-market acelerado', 'Preço transparente', 'Arquitetura escalável'],
  },
  {
    title: 'Escolas e ONGs',
    description: 'Organizações educacionais e de impacto social',
    iconName: 'GraduationCap',
    features: ['Soluções de baixo custo', 'Foco em comunidade', 'Descontos educacionais'],
  },
  {
    title: 'Empresas',
    description: 'Deploys customizados com segurança de nível corporativo',
    iconName: 'Building2',
    features: ['Integrações sob medida', 'Segurança corporativa', 'Suporte dedicado'],
  },
];
