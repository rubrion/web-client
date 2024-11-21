const mockPostContent = `
    <div>
        <p>Welcome to our latest blog post! In this article, we will explore <strong>the best practices for web development</strong> in 2024.</p>
        <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg" alt="Web Development" style="max-width:100%; height:auto;" />
        <h2>Why Stay Updated?</h2>
        <p>Technology evolves rapidly, and staying informed ensures you're using the most efficient tools and methods.</p>
        <blockquote>
            "Innovation distinguishes between a leader and a follower." - Steve Jobs
        </blockquote>
        <h3>Key Topics Covered</h3>
        <ul>
            <li>React best practices</li>
            <li>Performance optimization</li>
            <li>Accessibility standards</li>
            <li>Emerging tools and frameworks</li>
        </ul>
        <p>We hope you find this post insightful and valuable. Don't forget to leave a comment below!</p>
    </div>
`;

interface MockedBlogPost {
    id: string;
    title: string;
    summary: string;
    content: string;
  }

  export const generateBlogPost = (id: string) => { return { id: id, title: `Post ${id}`, summary: `This is the post ${id}.`, content: mockPostContent,}};

  export const mockBlogPosts: MockedBlogPost[] = Array.from({length: 10}, (_, i) => {
    const id = (i + 1).toString();
    return generateBlogPost(id);
});
