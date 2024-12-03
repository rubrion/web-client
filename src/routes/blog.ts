import { RouteObject, DynamicRoute } from './types';

const BLOG_ROUTES = {
  LIST: {
    path: '/blog',
    label: 'Blog',
    description: 'Read the latest updates and insights from Rubrion.',
  } as RouteObject,
  POST_DETAIL: ((params: { id: string }): string => {
    if (!params.id)
      throw new Error('ID is required to generate the blog post detail route');
    return `/blog/${params.id}`;
  }) as DynamicRoute<{ id: string }>,
  POST_DETAIL_STATIC: '/blog/:id',
};

export default BLOG_ROUTES;
