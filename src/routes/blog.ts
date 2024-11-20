import { RouteObject, DynamicRoute } from './types';

const BLOG_ROUTES = {
  LIST: { path: '/blog', label: 'Blog' } as RouteObject,
  POST_DETAIL: ((params: { id: string }): string => `/blog/${params.id}`) as DynamicRoute<{ id: string }>,
};

export default BLOG_ROUTES;
