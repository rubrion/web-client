import { RouteObject } from './types';

const PUBLIC_ROUTES: Record<string, RouteObject> = {
  HOME: { path: '/', label: 'Home' },
  ABOUT: { path: '/about', label: 'About Us' },
  CONTACT: { path: '/contact', label: 'Contact' },
};

export default PUBLIC_ROUTES;
