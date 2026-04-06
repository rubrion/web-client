import React from 'react';
import BaseLayout from '../components/layout/BaseLayout';
import Navbar from '../components/Navbar';
import HeroSection from '../components/sections/HeroSection';
import WhoWeServeSection from '../components/sections/WhoWeServeSection';
import WhatWeDeliverAndServicesSection from '../components/sections/WhatWeDeliverAndServicesSection';
import DeliveryLifecycleSection from '../components/sections/DeliveryLifecycleSection';
import ContactSection from '../components/sections/ContactSection';

const Home: React.FC = () => {
  return (
    <BaseLayout>
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <WhoWeServeSection />
        <WhatWeDeliverAndServicesSection />
        <DeliveryLifecycleSection />
        <ContactSection />
      </main>
    </BaseLayout>
  );
};

export default Home;