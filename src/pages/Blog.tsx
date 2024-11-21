import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts } from '../services/blogService';
import ROUTES from '../routes';

interface BlogPost {
    id: string;
    title: string;
    summary: string;
}

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await fetchBlogPosts();
                setPosts(data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        getPosts();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Our Blog</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <Link to={ROUTES.BLOG.POST_DETAIL({ id: post.id })}>{post.title}</Link>
                        <p>{post.summary}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
