import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useRef, useState } from 'react';
import { scrollToElement } from '../../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const HeroSection: React.FC = () => {
    const heroRef = useRef<HTMLElement>(null);
    const isInView = useInView(heroRef, { once: true, margin: '-100px' });
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const steps = [
        {
            title: 'Open-source foundation',
            description: 'Built on proven, community-driven technologies',
        },
        {
            title: 'White-label isolated instances',
            description: 'Your brand, your data, completely isolated',
        },
        {
            title: 'Fully hosted operations',
            description: 'We handle infrastructure, you focus on growth',
        },
    ];

    useEffect(() => {
        if (!heroRef.current) return;

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top center',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const bgProgress = self.progress;
                    gsap.set('.hero-bg', {
                        scale: 1 + (bgProgress * 0.05),
                        rotation: bgProgress * 2,
                        transformOrigin: 'center center'
                    });
                }
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Carousel automático
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % steps.length);
        }, 4000); // Muda a cada 4 segundos

        return () => clearInterval(interval);
    }, [isAutoPlay, steps.length]);

    const handleStepClick = (index: number) => {
        setCurrentStep(index);
        setIsAutoPlay(false); // Para o autoplay quando usuário interage

        // Reativa o autoplay após 10 segundos
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    return (
        <section
            ref={heroRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden z-10 pt-20 w-full"
            style={{ maxWidth: '100vw' }}
        >
            <div className="hero-bg absolute inset-0 opacity-20 w-full h-full">
                <div className="absolute inset-0 bg-primary/8" />
                <div className="hero-grid-wrap absolute inset-0 overflow-hidden">
                    <div
                        className="hero-grid absolute"
                        style={{
                            inset: '-100px',
                            backgroundImage: `
                                linear-gradient(90deg, transparent 95%, #ff0040 96%, transparent 100%),
                                linear-gradient(0deg, transparent 95%, #ff0040 96%, transparent 100%)
                            `,
                            backgroundSize: '100px 100px',
                            filter: 'drop-shadow(0 0 2px #ff0040)',
                        }}
                    />
                </div>
            </div>

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 text-center" style={{ maxWidth: 'min(1024px, 90vw)' }}>
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                >
                    <motion.div
                        variants={fadeInUp}
                        className="flex justify-center mb-8"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32">
                            <img
                                src="/logo_rubrion_ver4.svg"
                                alt="Rubrion"
                                className="w-full h-full"
                            />
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl font-mono font-bold mb-6 text-primary neon-text glitch"
                        data-text="Code-free, cloud-fee."
                    >
                        Code-free, cloud-fee.
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-2xl font-mono text-text-primary mb-8 max-w-2xl mx-auto"
                    >
                        &gt; White-label SaaS modules with transparent infrastructure costs<br />
                        &gt; No vendor lock-in, no hidden fees, just value in the service
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <motion.button
                            onClick={() => scrollToElement('#contact')}
                            className="bg-primary text-surface-base border-2 border-primary px-8 py-4 rounded-lg text-lg font-mono font-bold shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                            whileHover={{ scale: 1.08, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                boxShadow: '0 0 20px rgba(255, 0, 64, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)'
                            }}
                        >
                            &gt;talk_to_us
                        </motion.button>
                        <motion.button
                            onClick={() => scrollToElement('#what-we-deliver')}
                            className="bg-surface-base border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-mono font-bold neon-border hover:bg-primary hover:text-surface-base transition-all duration-200 whitespace-nowrap"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            &gt;see_modules
                        </motion.button>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="bg-surface-raised/50 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto"
                    >
                        <div className="flex justify-center mb-4">
                            {steps.map((_, index) => (
                                <motion.button
                                    key={index}
                                    onClick={() => handleStepClick(index)}
                                    className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 cursor-pointer hover:scale-125 ${index === currentStep
                                        ? 'bg-primary shadow-lg'
                                        : 'bg-border-default hover:bg-primary/50'
                                        }`}
                                    whileHover={{ scale: 1.25 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                        boxShadow: index === currentStep ? '0 0 10px #ff0040' : 'none'
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
                                &gt; {steps[currentStep]?.title}
                            </h3>
                            <p className="text-text-secondary text-sm font-mono">
                                {steps[currentStep]?.description}
                            </p>
                        </motion.div>

                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
