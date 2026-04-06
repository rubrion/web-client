import { motion, useInView } from 'framer-motion';
import React, { useRef, useState } from 'react';
import { FileText, ShoppingCart, Target, BookOpen, MessageSquare, BarChart3, Rocket, Settings, Hammer } from 'lucide-react';
import { scrollToElement } from '../../lib/scroll';

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

const WhatWeDeliverAndServicesSection: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeTab, setActiveTab] = useState(0);

    const modules = [
        {
            title: 'Content Management',
            description: 'Headless CMS with multi-tenant architecture',
            icon: FileText,
            features: [
                'Multi-language support',
                'Version control',
                'API-first design',
            ],
        },
        {
            title: 'E-commerce Platform',
            description: 'Complete online store with payment processing',
            icon: ShoppingCart,
            features: ['Payment gateways', 'Inventory management', 'Order tracking'],
        },
        {
            title: 'Learning Management',
            description: 'Educational platform with progress tracking',
            icon: Target,
            features: [
                'Course creation',
                'Student analytics',
                'Certification system',
            ],
        },
        {
            title: 'Knowledge Base',
            description: 'Searchable documentation and FAQ system',
            icon: BookOpen,
            features: ['Full-text search', 'Category organization', 'User feedback'],
        },
        {
            title: 'Communication Hub',
            description: 'Real-time messaging and collaboration tools',
            icon: MessageSquare,
            features: ['Real-time chat', 'File sharing', 'Team channels'],
        },
        {
            title: 'Analytics Dashboard',
            description: 'Business intelligence and reporting tools',
            icon: BarChart3,
            features: ['Custom reports', 'Data visualization', 'Export capabilities'],
        },
    ];

    const services = [
        {
            title: 'Managed SaaS (White-Label)',
            description: 'Complete white-label SaaS deployment with your branding',
            features: [
                'Custom domain and branding',
                'Isolated tenant instances',
                'Automated scaling and monitoring',
                '24/7 infrastructure support',
            ],
            cta: 'Start Your Instance',
        },
        {
            title: 'Custom Development',
            description: 'Tailored modules and integrations for your specific needs',
            features: [
                'Custom module development',
                'Third-party integrations',
                'API customization',
                'Performance optimization',
            ],
            cta: 'Discuss Requirements',
        },
        {
            title: 'Support & Maintenance',
            description: 'Ongoing support and continuous improvement services',
            features: [
                'Technical support',
                'Security updates',
                'Performance monitoring',
                'Feature enhancements',
            ],
            cta: 'Get Support',
        },
    ];

    return (
        <section
            ref={ref}
            id="what-we-deliver"
            className="relative z-20 overflow-hidden"
        >
            {/* Extended Space acceleration rain effect covering both sections */}
            <div className="absolute inset-0 space-rain" style={{ minHeight: '200vh' }}>
                {Array.from({ length: 80 }).map((_, i) => (
                    <div
                        key={i}
                        className="rain-line"
                        style={{
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${1 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* CSS for extended space rain effect */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    .space-rain {
                        pointer-events: none;
                        z-index: 1;
                    }
                    
                    .rain-line {
                        position: absolute;
                        width: 2px;
                        height: 25px;
                        background: linear-gradient(to bottom, transparent, #ff0040, transparent);
                        opacity: 0.25;
                        animation: rainFallExtended linear infinite;
                        transform-origin: center top;
                    }
                    
                    .rain-line:nth-child(odd) {
                        width: 1.5px;
                        height: 20px;
                        opacity: 0.2;
                    }
                    
                    .rain-line:nth-child(3n) {
                        width: 2.5px;
                        height: 30px;
                        opacity: 0.3;
                        background: linear-gradient(to bottom, transparent, #ff0040, #ff004080, transparent);
                    }
                    
                    .rain-line:nth-child(5n) {
                        width: 3px;
                        height: 35px;
                        opacity: 0.35;
                        background: linear-gradient(to bottom, transparent, #ff0040, #ff004060, #ff004040, transparent);
                    }
                    
                    .rain-line:nth-child(7n) {
                        width: 3.5px;
                        height: 40px;
                        opacity: 0.4;
                        background: linear-gradient(to bottom, transparent, #ff0040, #ff004080, #ff004060, #ff004040, transparent);
                    }
                    
                    /* Mobile adjustments */
                    @media (max-width: 768px) {
                        .space-rain {
                            height: 200vh; /* Ensure rain covers both sections on mobile */
                        }
                        
                        .rain-line {
                            opacity: 0.15;
                        }
                        
                        .rain-line:nth-child(odd) {
                            opacity: 0.1;
                        }
                        
                        .rain-line:nth-child(3n) {
                            opacity: 0.2;
                        }
                        
                        .rain-line:nth-child(5n) {
                            opacity: 0.25;
                        }
                        
                        .rain-line:nth-child(7n) {
                            opacity: 0.3;
                        }
                    }

                    @keyframes rainFallExtended {
                        0% {
                            transform: translateY(-180vh) scaleY(0.3);
                            opacity: 0;
                        }
                        3% {
                            opacity: 0.1;
                            transform: translateY(-170vh) scaleY(0.5);
                        }
                        8% {
                            opacity: 0.2;
                            transform: translateY(-150vh) scaleY(0.8);
                        }
                        15% {
                            opacity: 0.3;
                            transform: translateY(-100vh) scaleY(1);
                        }
                        80% {
                            opacity: 0.3;
                            transform: translateY(180vh) scaleY(3);
                        }
                        90% {
                            opacity: 0.2;
                            transform: translateY(200vh) scaleY(4);
                        }
                        95% {
                            opacity: 0.1;
                            transform: translateY(220vh) scaleY(4.5);
                        }
                        100% {
                            transform: translateY(240vh) scaleY(5);
                            opacity: 0;
                        }
                    }
                `
            }} />

            {/* What We Deliver Section */}
            <div className="py-20 px-4 bg-surface-raised">
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
                            What We Deliver
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-text-secondary max-w-3xl mx-auto"
                        >
                            Production-ready SaaS modules that integrate seamlessly with your
                            existing infrastructure
                        </motion.p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {modules.map((module, index) => (
                            <motion.div
                                key={index}
                                variants={scaleIn}
                                className="bg-surface-base border border-border-default rounded-xl p-6 hover:border-accent-indigo/50 transition-all duration-300 group"
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className="mb-4 w-8 h-8 overflow-hidden flex items-center justify-center">
                                    <div className="group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                        <module.icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-indigo transition-colors">
                                    {module.title}
                                </h3>
                                <p className="text-text-secondary mb-4 text-sm">
                                    {module.description}
                                </p>
                                <ul className="space-y-1">
                                    {module.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center text-text-muted text-sm"
                                        >
                                            <span className="w-1.5 h-1.5 bg-accent-teal rounded-full mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={fadeInUp} className="text-center mt-12">
                        <motion.button
                            onClick={() => scrollToElement('#contact')}
                            className="bg-transparent text-primary border-2 border-primary px-8 py-3 rounded-lg text-base font-mono font-bold neon-border hover:bg-primary hover:text-surface-base hover:shadow-xl transition-all duration-200 whitespace-nowrap relative overflow-hidden"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                boxShadow: '0 0 20px rgba(255, 0, 64, 0.3), inset 0 0 20px rgba(255, 0, 64, 0.1)'
                            }}
                        >
                            <motion.span
                                className="inline-block"
                                animate={{ x: [0, 3, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                &gt;
                            </motion.span>
                            <span className="ml-1">request_demo</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Service Lines Section */}
            <div id="service-lines" className="py-20 px-4 bg-surface-raised">
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
                            Service Lines
                        </motion.h2>
                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-text-secondary max-w-3xl mx-auto"
                        >
                            Comprehensive services from deployment to ongoing support
                        </motion.p>
                    </motion.div>

                    <motion.div variants={staggerContainer}>
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap justify-center mb-8 bg-surface-base rounded-lg p-2"
                        >
                            {services.map((service, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === index
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                                        }`}
                                >
                                    {service.title}
                                </button>
                            ))}
                        </motion.div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-surface-base border border-border-default rounded-xl p-8"
                        >
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-4">
                                        {services[activeTab].title}
                                    </h3>
                                    <p className="text-text-secondary mb-6">
                                        {services[activeTab].description}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {services[activeTab].features.map((feature, idx) => (
                                            <li
                                                key={idx}
                                                className="flex items-center text-text-secondary"
                                            >
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
                                        {services[activeTab].cta}
                                    </motion.button>
                                </div>
                                <div className="text-center">
                                    <div className="w-32 h-32 bg-surface-raised border border-primary rounded-full flex items-center justify-center mx-auto neon-border">
                                        {activeTab === 0 ? (
                                            <Rocket className="w-12 h-12 text-primary" strokeWidth={1.5} />
                                        ) : activeTab === 1 ? (
                                            <Settings className="w-12 h-12 text-primary" strokeWidth={1.5} />
                                        ) : (
                                            <Hammer className="w-12 h-12 text-primary" strokeWidth={1.5} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhatWeDeliverAndServicesSection;
