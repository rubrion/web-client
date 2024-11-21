import { http, HttpResponse } from 'msw';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
}

export const handlers = [
  http.get('/posts', () => {
    const mockPosts: BlogPost[] = [
      { id: '1', title: 'First Post', summary: 'This is the first post.' },
      { id: '2', title: 'Second Post', summary: 'This is the second post.' },
    ];

    return HttpResponse.json(mockPosts, { status: 200 });
  }),

  http.get('/posts/:id', ({ params }) => {
    const { id } = params;
    const mockPost: BlogPost = {
      id: id as string,
      title: `Post ${id}`,
      summary: `Summary of post ${id}.`,
    };

    return HttpResponse.json(mockPost, { status: 200 });
  }),
];
