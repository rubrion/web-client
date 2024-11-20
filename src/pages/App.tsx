import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from '../routes';
import Home from './Home';
import About from './About';
import Blog from './Blog';
import PostDetail from './PostDetails';
import NotFound from './NotFound';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path={ROUTES.PUBLIC.HOME.path} element={<Home />} />
                <Route path={ROUTES.PUBLIC.ABOUT.path} element={<About />} />
                <Route path={ROUTES.BLOG.LIST.path} element={<Blog />} />
                <Route path={ROUTES.BLOG.POST_DETAIL({ id: ':id' })} element={<PostDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;
