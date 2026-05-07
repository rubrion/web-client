export type Segment = {
  title: string;
  description: string;
  iconName: 'Rocket' | 'GraduationCap' | 'Building2';
  features: string[];
};

export const segments: Segment[] = [
  {
    title: 'SMBs & Startups',
    description: 'Fast deployment, predictable costs, scale as you grow',
    iconName: 'Rocket',
    features: ['Quick time-to-market', 'Transparent pricing', 'Scalable architecture'],
  },
  {
    title: 'Schools & Nonprofits',
    description: 'Educational and mission-driven organizations',
    iconName: 'GraduationCap',
    features: ['Cost-effective solutions', 'Community focus', 'Educational discounts'],
  },
  {
    title: 'Enterprises',
    description: 'Custom deployments with enterprise-grade security',
    iconName: 'Building2',
    features: ['Custom integrations', 'Enterprise security', 'Dedicated support'],
  },
];
