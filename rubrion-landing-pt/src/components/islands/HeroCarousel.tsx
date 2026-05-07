import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { heroSteps } from '@/data/heroSteps';

export default function HeroCarousel() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % heroSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <div className="bg-surface-raised/50 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        {heroSteps.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => handleStepClick(index)}
            aria-label={`Show step ${index + 1}`}
            className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 cursor-pointer hover:scale-125 ${
              index === currentStep
                ? 'bg-primary shadow-lg'
                : 'bg-border-default hover:bg-primary/50'
            }`}
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.9 }}
            style={{
              boxShadow: index === currentStep ? '0 0 10px #ff0040' : 'none',
            }}
          />
        ))}
      </div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-2 font-mono">
          &gt; {heroSteps[currentStep]?.title}
        </h3>
        <p className="text-text-secondary text-sm font-mono">
          {heroSteps[currentStep]?.description}
        </p>
      </motion.div>
    </div>
  );
}
