import { http, HttpResponse } from 'msw';
import { generateBlogPost, mockBlogPosts } from './mockBlogPosts';

export const handlers = [
  http.get('/posts', () => HttpResponse.json(mockBlogPosts, { status: 200 })),

  http.get('/posts/:id', ({ params }) => {
    const { id } = params;
    if (!id) {
      return HttpResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }
    const post = generateBlogPost(id as string);
    return HttpResponse.json(post, { status: 200 });
  }),
];
