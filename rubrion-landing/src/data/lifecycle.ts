export type LifecycleStage = {
  title: string;
  description: string;
  duration: string;
  iconName: 'Search' | 'Settings' | 'Package' | 'Palette' | 'TestTube' | 'Rocket';
};

export const lifecycle: LifecycleStage[] = [
  {
    title: 'Discovery & Planning',
    description: 'Requirements analysis and architecture design',
    duration: '1-2 weeks',
    iconName: 'Search',
  },
  {
    title: 'Infrastructure Setup',
    description: 'Kubernetes cluster and CI/CD pipeline deployment',
    duration: '1 week',
    iconName: 'Settings',
  },
  {
    title: 'Module Deployment',
    description: 'Core modules installation and configuration',
    duration: '1-2 weeks',
    iconName: 'Package',
  },
  {
    title: 'Customization',
    description: 'Branding, integrations, and custom features',
    duration: '2-4 weeks',
    iconName: 'Palette',
  },
  {
    title: 'Testing & QA',
    description: 'Comprehensive testing and performance optimization',
    duration: '1 week',
    iconName: 'TestTube',
  },
  {
    title: 'Go Live & Support',
    description: 'Production deployment and ongoing monitoring',
    duration: 'Ongoing',
    iconName: 'Rocket',
  },
];
