import { motion, useInView } from 'framer-motion';
import React, { useRef } from 'react';
import { Rocket, GraduationCap, Building2 } from 'lucide-react';

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

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
    },
};

const WhoWeServeSection: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const segments = [
        {
            title: 'SMBs & Startups',
            description: 'Fast deployment, predictable costs, scale as you grow',
            icon: Rocket,
            features: [
                'Quick time-to-market',
                'Transparent pricing',
                'Scalable architecture',
            ],
        },
        {
            title: 'Schools & Nonprofits',
            description: 'Educational and mission-driven organizations',
            icon: GraduationCap,
            features: [
                'Cost-effective solutions',
                'Community focus',
                'Educational discounts',
            ],
        },
        {
            title: 'Enterprises',
            description: 'Custom deployments with enterprise-grade security',
            icon: Building2,
            features: [
                'Custom integrations',
                'Enterprise security',
                'Dedicated support',
            ],
        },
    ];

    return (
        <section
            ref={ref}
            id="who-we-serve"
            className="py-20 px-4 relative z-20 bg-surface-base overflow-hidden"
        >
            {/* Zigzag borders using specific PNG images for each side - Responsive */}
            <motion.div
                className="absolute left-0 top-0 w-8 h-full hidden md:block"
                style={{
                    backgroundImage: 'url(/zigzag_black_transparent_left.png)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: 'contain',
                    filter: 'invert(18%) sepia(100%) saturate(7500%) hue-rotate(345deg) brightness(100%) contrast(120%) drop-shadow(0 0 5px #ff0040)',
                    animation: 'zigzagMove 1.5s linear infinite'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 0.6, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            />

            <motion.div
                className="absolute right-0 top-0 w-8 h-full hidden md:block"
                style={{
                    backgroundImage: 'url(/zigzag_black_transparent_right.png)',
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: 'contain',
                    filter: 'invert(18%) sepia(100%) saturate(7500%) hue-rotate(345deg) brightness(100%) contrast(120%) drop-shadow(0 0 5px #ff0040)',
                    animation: 'zigzagMove 1.5s linear infinite reverse'
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 0.6, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            />

            {/* CSS Animation for zigzag movement */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes zigzagMove {
                        from {
                            background-position: 0 0;
                        }
                        to {
                            background-position: 0 100px;
                        }
                    }
                `
            }} />

            <div className="max-w-6xl mx-auto relative z-10">
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
                        Who We Serve
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-text-secondary max-w-2xl mx-auto"
                    >
                        From startups to enterprises, we provide tailored solutions for
                        every scale
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {segments.map((segment, index) => (
                        <motion.div
                            key={index}
                            variants={scaleIn}
                            className="bg-surface-raised border border-border-default rounded-xl p-8 hover:bg-surface-elevated transition-all duration-300 group"
                            whileHover={{ y: -5 }}
                        >
                            <div className="mb-4">
                                <segment.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-accent-indigo transition-colors">
                                {segment.title}
                            </h3>
                            <p className="text-text-secondary mb-6">{segment.description}</p>
                            <ul className="space-y-2">
                                {segment.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center text-text-secondary"
                                    >
                                        <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhoWeServeSection;
