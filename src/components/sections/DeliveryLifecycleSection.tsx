import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';
import { Search, Settings, Package, Palette, TestTube, Rocket } from 'lucide-react';

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

const DeliveryLifecycleSection: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const steps = [
        {
            title: 'Discovery & Planning',
            description: 'Requirements analysis and architecture design',
            duration: '1-2 weeks',
            icon: Search,
        },
        {
            title: 'Infrastructure Setup',
            description: 'Kubernetes cluster and CI/CD pipeline deployment',
            duration: '1 week',
            icon: Settings,
        },
        {
            title: 'Module Deployment',
            description: 'Core modules installation and configuration',
            duration: '1-2 weeks',
            icon: Package,
        },
        {
            title: 'Customization',
            description: 'Branding, integrations, and custom features',
            duration: '2-4 weeks',
            icon: Palette,
        },
        {
            title: 'Testing & QA',
            description: 'Comprehensive testing and performance optimization',
            duration: '1 week',
            icon: TestTube,
        },
        {
            title: 'Go Live & Support',
            description: 'Production deployment and ongoing monitoring',
            duration: 'Ongoing',
            icon: Rocket,
        },
    ];

    return (
        <section
            ref={ref}
            id="delivery-lifecycle"
            className="py-20 px-4 bg-surface-base"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
                    >
                        Delivery Lifecycle
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-text-secondary max-w-3xl mx-auto"
                    >
                        From concept to production in 6-10 weeks with our proven delivery
                        process
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-surface-raised border border-border-default rounded-xl p-6 hover:border-primary/50 transition-colors duration-300 neon-border"
                        >
                            <div className="mb-4">
                                <step.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <div className="flex items-center mb-3">
                                <span className="bg-primary text-surface-base text-sm font-mono px-2 py-1 rounded mr-3">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="text-accent-green text-sm font-mono">
                                    {step.duration}
                                </span>
                            </div>
                            <h3 className="text-xl font-mono font-bold text-text-primary mb-3">
                                {step.title}
                            </h3>
                            <p className="text-text-muted font-mono text-sm">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Hacker Loading Bar Animation */}
                <motion.div className="mt-16 relative flex flex-col items-center">
                    {/* Hacker Loading Bar */}
                    <div className="relative w-full max-w-4xl">
                        {/* Hacker Progress Indicators */}
                        <div className="absolute -top-6 left-0 w-full flex justify-between text-xs font-mono text-primary">
                            {['[', '▓', '▓', '▓', '▓', '▓', '▓', '▓', '▓', '▓', ']'].map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0.3 }}
                                    animate={isInView ? { opacity: 1 } : { opacity: 0.3 }}
                                    transition={{ duration: 0.1, delay: 0.5 + (i * 0.15) }}
                                    className="neon-text"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>

                        {/* Loading Bar Progress */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-1 bg-gradient-to-r from-primary to-accent-green rounded-full origin-left"
                            style={{
                                boxShadow: '0 0 5px #ff0040'
                            }}
                        />

                        {/* Loading Percentage */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.5, delay: 1.8 }}
                            className="absolute -bottom-8 right-0 text-sm font-mono text-accent-green"
                        >
                        </motion.div>
                    </div>

                    {/* FAST DELIVERY Text - Below Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: 2 }}
                        className="mt-6 text-center"
                    >
                        <span className="text-lg md:text-xl font-mono font-bold text-primary neon-text tracking-normal">
                            FAST DELIVERY
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default DeliveryLifecycleSection;
