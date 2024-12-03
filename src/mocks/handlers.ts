import { http, HttpResponse } from 'msw';
import { mockBlogPosts as mockPosts, generateBlogPost } from './mockBlogPosts';
export const handlers = [
  http.get('/posts', () => {
    return HttpResponse.json(mockPosts, { status: 200 });
  }),

  http.get('/posts/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json(generateBlogPost(id as string), { status: 200 });
  }),
];
