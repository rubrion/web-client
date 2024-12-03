import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../routes';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Rubrion</h1>
      <p>
        <Link to={ROUTES.PUBLIC.HOME.path}>Home</Link>.
      </p>
      <p>
        <Link to={ROUTES.PUBLIC.ABOUT.path}>About</Link>.
      </p>
      <p>
        <Link to={ROUTES.PUBLIC.CONTACT.path}>Contact Us</Link>.
      </p>
      <Link to={ROUTES.BLOG.LIST.path}>Go to Blog</Link>
    </div>
  );
};

export default Home;
