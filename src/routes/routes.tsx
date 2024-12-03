import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './index';
import PageHelmet from '../components/PageHelmet';

const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Blog = React.lazy(() => import('../pages/Blog'));
const PostDetail = React.lazy(() => import('../pages/PostDetails'));
const Contact = React.lazy(() => import('../pages/Contact'));
const NotFound = React.lazy(() => import('../pages/NotFound'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path={ROUTES.PUBLIC.HOME.path}
          element={
            <PageHelmet
              title={ROUTES.PUBLIC.HOME.label}
              description={ROUTES.PUBLIC.HOME.description}
            >
              <Home />
            </PageHelmet>
          }
        />
        <Route
          path={ROUTES.PUBLIC.ABOUT.path}
          element={
            <PageHelmet
              title={ROUTES.PUBLIC.ABOUT.label}
              description={ROUTES.PUBLIC.ABOUT.description}
            >
              <About />
            </PageHelmet>
          }
        />
        <Route
          path={ROUTES.BLOG.LIST.path}
          element={
            <PageHelmet
              title={ROUTES.BLOG.LIST.label}
              description={ROUTES.BLOG.LIST.description}
            >
              <Blog />
            </PageHelmet>
          }
        />
        <Route
          path={ROUTES.BLOG.POST_DETAIL_STATIC}
          element={
            <PageHelmet
              title="Blog Post Details"
              description="Detailed view of the selected blog post."
            >
              <PostDetail />
            </PageHelmet>
          }
        />
        <Route
          path={ROUTES.PUBLIC.CONTACT.path}
          element={
            <PageHelmet
              title={ROUTES.PUBLIC.CONTACT.label}
              description={ROUTES.PUBLIC.CONTACT.description}
            >
              <Contact />
            </PageHelmet>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
