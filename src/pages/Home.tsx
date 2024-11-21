import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../routes';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Rubrion</h1>
            <p><Link to={ROUTES.PUBLIC.Home.path}>Home</Link>.</p>
            <p><Link to={ROUTES.PUBLIC.About.path}>About</Link>.</p>
            <p><Link to={ROUTES.PUBLIC.Contact.path}>Contact Us</Link>.</p>
            <Link to={ROUTES.BLOG.LIST.path}>Go to Blog</Link>
        </div>
    );
};

export default Home;
