import { motion } from 'framer-motion';
import { Hammer, Rocket, Settings } from 'lucide-react';
import { useState } from 'react';

import { services } from '@/data/services';
import { scrollToElement } from '@/lib/scroll';

const ICONS = { Rocket, Settings, Hammer } as const;

export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const active = services[activeTab];
  const Icon = ICONS[active.iconName];

  return (
    <div>
      <div className="flex flex-wrap justify-center mb-8 bg-surface-base rounded-lg p-2">
        {services.map((service, index) => (
          <button
            key={service.title}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === index
                ? 'bg-primary text-white shadow-md'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
            }`}
          >
            {service.title}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-surface-base border border-border-default rounded-xl p-8"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">{active.title}</h3>
            <p className="text-text-secondary mb-6">{active.description}</p>
            <ul className="space-y-3 mb-8">
              {active.features.map((feature) => (
                <li key={feature} className="flex items-center text-text-secondary">
                  <span className="w-2 h-2 bg-accent-teal rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
            <motion.button
              onClick={() => scrollToElement('#contact')}
              className="bg-gradient-to-r from-primary to-rubrion-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {active.cta}
            </motion.button>
          </div>
          <div className="text-center">
            <div className="w-32 h-32 bg-surface-raised border border-primary rounded-full flex items-center justify-center mx-auto neon-border">
              <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
