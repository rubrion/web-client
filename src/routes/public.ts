import { RouteObject } from './types';

const PUBLIC_ROUTES: Record<string, RouteObject> = {
  HOME: { path: '/', label: 'Home', description: 'Welcome to the Rubrion homepage!' },
  ABOUT: { path: '/about', label: 'About Us', description: 'Learn more about Rubrion and our mission.' },
  CONTACT: { path: '/contact', label: 'Contact', description: 'Get in touch with Rubrion for inquiries or support.' },
};

export default PUBLIC_ROUTES;
