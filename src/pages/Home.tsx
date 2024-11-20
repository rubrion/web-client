import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../routes';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Rubrion</h1>
            <p>Discover our portfolio and blog posts.</p>
            <Link to={ROUTES.BLOG.LIST.path}>Go to Blog</Link>
        </div>
    );
};

export default Home;
