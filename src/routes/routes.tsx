import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import PageHelmet from '../components/PageHelmet';
import ROUTES from './index';

const Home = React.lazy(() => import('../pages/Home'));
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
              keywords="white-label saas, ai-powered solutions, no vendor lock-in, transparent pricing, kubernetes, terraform, cms, ecommerce, lms, multi-tenant, artificial intelligence, saas platform, cloud infrastructure, devops automation"
              ogTitle="Rubrion AI - Code-free, cloud-fee | AI-Powered White-Label SaaS"
              ogDescription="Revolutionary AI-powered white-label SaaS modules with transparent infrastructure costs. Deploy in 6-10 weeks with Kubernetes, Terraform automation. No vendor lock-in, no hidden fees."
              ogImage="https://rubrion.ai/og-image.png"
              ogUrl="https://rubrion.ai/"
              canonicalUrl="https://rubrion.ai/"
            >
              <Home />
            </PageHelmet>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
