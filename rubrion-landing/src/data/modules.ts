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
    title: 'Content Management',
    description: 'Headless CMS with multi-tenant architecture',
    iconName: 'FileText',
    features: ['Multi-language support', 'Version control', 'API-first design'],
  },
  {
    title: 'E-commerce Platform',
    description: 'Complete online store with payment processing',
    iconName: 'ShoppingCart',
    features: ['Payment gateways', 'Inventory management', 'Order tracking'],
  },
  {
    title: 'Learning Management',
    description: 'Educational platform with progress tracking',
    iconName: 'Target',
    features: ['Course creation', 'Student analytics', 'Certification system'],
  },
  {
    title: 'Knowledge Base',
    description: 'Searchable documentation and FAQ system',
    iconName: 'BookOpen',
    features: ['Full-text search', 'Category organization', 'User feedback'],
  },
  {
    title: 'Communication Hub',
    description: 'Real-time messaging and collaboration tools',
    iconName: 'MessageSquare',
    features: ['Real-time chat', 'File sharing', 'Team channels'],
  },
  {
    title: 'Analytics Dashboard',
    description: 'Business intelligence and reporting tools',
    iconName: 'BarChart3',
    features: ['Custom reports', 'Data visualization', 'Export capabilities'],
  },
];
