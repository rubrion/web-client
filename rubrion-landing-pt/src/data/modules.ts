export type ModuleCard = {
  title: string;
  description: string;
  iconName:
    | 'FileText'
    | 'ShoppingCart'
    | 'Target'
    | 'BookOpen'
    | 'MessageSquare'
    | 'BarChart3';
  features: string[];
};

export const modules: ModuleCard[] = [
  {
    title: 'Gestão de Conteúdo',
    description: 'CMS headless com arquitetura multi-tenant',
    iconName: 'FileText',
    features: ['Suporte multilíngue', 'Controle de versão', 'Arquitetura API-first'],
  },
  {
    title: 'Plataforma de E-commerce',
    description: 'Loja online completa com processamento de pagamento',
    iconName: 'ShoppingCart',
    features: ['Gateways de pagamento', 'Gestão de estoque', 'Acompanhamento de pedidos'],
  },
  {
    title: 'Gestão de Aprendizagem',
    description: 'Plataforma educacional com acompanhamento de progresso',
    iconName: 'Target',
    features: ['Criação de cursos', 'Analytics de alunos', 'Sistema de certificados'],
  },
  {
    title: 'Base de Conhecimento',
    description: 'Sistema de documentação e FAQ pesquisável',
    iconName: 'BookOpen',
    features: ['Busca full-text', 'Organização por categorias', 'Feedback de usuários'],
  },
  {
    title: 'Hub de Comunicação',
    description: 'Mensageria em tempo real e ferramentas de colaboração',
    iconName: 'MessageSquare',
    features: ['Chat em tempo real', 'Compartilhamento de arquivos', 'Canais de equipe'],
  },
  {
    title: 'Painel de Analytics',
    description: 'Business intelligence e ferramentas de relatório',
    iconName: 'BarChart3',
    features: ['Relatórios customizados', 'Visualização de dados', 'Exportação flexível'],
  },
];
