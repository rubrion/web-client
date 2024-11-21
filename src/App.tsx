import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetails';
import NotFound from './pages/NotFound';

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
