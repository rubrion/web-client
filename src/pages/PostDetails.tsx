import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogPostById } from '../api/blogService';

interface BlogPost {
    id: string;
    title: string;
    content: string;
}

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getPost = async () => {
            try {
                if (id) {
                    const data = await fetchBlogPostById(id);
                    setPost(data);
                }
            } catch (error) {
                console.error(`Failed to fetch post with ID ${id}:`, error);
            } finally {
                setLoading(false);
            }
        };

        getPost();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!post) {
        return <p>Post not found</p>;
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
};

export default PostDetail;
