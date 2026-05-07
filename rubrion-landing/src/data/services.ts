export type Service = {
  title: string;
  description: string;
  features: string[];
  cta: string;
  iconName: 'Rocket' | 'Settings' | 'Hammer';
};

export const services: Service[] = [
  {
    title: 'Managed SaaS (White-Label)',
    description: 'Complete white-label SaaS deployment with your branding',
    features: [
      'Custom domain and branding',
      'Isolated tenant instances',
      'Automated scaling and monitoring',
      '24/7 infrastructure support',
    ],
    cta: 'Start Your Instance',
    iconName: 'Rocket',
  },
  {
    title: 'Custom Development',
    description: 'Tailored modules and integrations for your specific needs',
    features: [
      'Custom module development',
      'Third-party integrations',
      'API customization',
      'Performance optimization',
    ],
    cta: 'Discuss Requirements',
    iconName: 'Settings',
  },
  {
    title: 'Support & Maintenance',
    description: 'Ongoing support and continuous improvement services',
    features: [
      'Technical support',
      'Security updates',
      'Performance monitoring',
      'Feature enhancements',
    ],
    cta: 'Get Support',
    iconName: 'Hammer',
  },
];
