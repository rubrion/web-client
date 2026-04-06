import { motion, useInView, AnimatePresence } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Globe, Rocket, CheckCircle, X } from 'lucide-react';

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

// Declare grecaptcha globally
declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

const ContactSection: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

    const isDev = import.meta.env.DEV;
    const RECAPTCHA_SITE_KEY = '6Lc13cMrAAAAANoY7v1-XZivX8BmlppVXnWJDDyt';

    // Load reCAPTCHA v3 script
    useEffect(() => {
        if (isDev) return; // Skip in development

        const loadRecaptcha = () => {
            if (window.grecaptcha) {
                setRecaptchaLoaded(true);
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
            script.onload = () => {
                window.grecaptcha.ready(() => {
                    setRecaptchaLoaded(true);
                });
            };
            document.head.appendChild(script);
        };

        loadRecaptcha();
    }, [isDev]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validar campos obrigatórios
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        }

        // Se for dev, enviar direto
        if (isDev) {
            await sendEmail();
            return;
        }

        // Se não for dev, executar reCAPTCHA v3
        if (!recaptchaLoaded) {
            setError('reCAPTCHA not loaded. Please try again.');
            return;
        }

        try {
            console.log('🔐 Executing reCAPTCHA v3 verification...');
            const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
                action: 'contact_form_submit'
            });
            console.log('✅ reCAPTCHA token generated successfully');
            await sendEmail(token);
        } catch (error) {
            console.error('❌ reCAPTCHA error:', error);
            setError('reCAPTCHA verification failed. Please try again.');
        }
    };

    const sendEmail = async (recaptchaToken?: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            // Prepare template parameters for EmailJS
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                company: formData.company || 'Not specified',
                message: formData.message,
                recaptcha_token: recaptchaToken || 'dev-mode',
            };

            const result = await emailjs.send(
                'service_ift91as',
                'template_ub3pkzj',
                templateParams,
                'imzEB4bH-aZiVSHBI'
            );
            setIsSubmitted(true);

            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', company: '', message: '' });
            }, 4000);

        } catch (error) {
            console.error('Failed to send email:', error);
            setError('Failed to send message. Please try again or contact us directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section ref={ref} id="contact" className="py-20 px-4 bg-surface-raised">
            <div className="max-w-4xl mx-auto">
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
                        Ready to Get Started?
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl text-text-secondary max-w-2xl mx-auto"
                    >
                        Let's discuss how Rubrion can accelerate your digital transformation
                    </motion.p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        variants={fadeInUp}
                        className="bg-surface-base border border-border-default rounded-xl p-8"
                    >
                        {!isSubmitted ? (
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-text-primary mb-2"
                                    >
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent neon-border"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-text-primary mb-2"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent neon-border"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="company"
                                        className="block text-sm font-medium text-text-primary mb-2"
                                    >
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent neon-border"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-text-primary mb-2"
                                    >
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-surface-raised border border-border-default rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none neon-border"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                            className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4"
                                        >
                                            <p className="text-red-400 text-sm font-mono">
                                                &gt; Error: {error}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || (!isDev && !recaptchaLoaded)}
                                    className="w-full bg-primary text-surface-base py-3 rounded-lg font-mono font-semibold neon-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    whileHover={{
                                        scale: isSubmitting ? 1 : 1.02,
                                        boxShadow: isSubmitting ? 'none' : '0 0 25px rgba(255, 0, 64, 0.7)'
                                    }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    style={{
                                        boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(255, 0, 64, 0.5)'
                                    }}
                                >
                                    <span>
                                        {isSubmitting
                                            ? '>sending...'
                                            : (!isDev && !recaptchaLoaded)
                                                ? '>loading_security...'
                                                : '>send_message'
                                        }
                                    </span>
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    duration: 0.6
                                }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    className="mb-4"
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15
                                    }}
                                >
                                    <CheckCircle className="w-12 h-12 text-primary mx-auto drop-shadow-lg" strokeWidth={1.5} />
                                </motion.div>
                                <motion.h3
                                    className="text-xl font-mono font-bold text-text-primary mb-2 neon-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                >
                                    <span>&gt;message_sent!</span>
                                </motion.h3>
                                <motion.p
                                    className="text-text-secondary font-mono"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.4 }}
                                >
                                    <span>&gt; Response expected within 24 hours</span>
                                </motion.p>
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.div variants={fadeInUp} className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary mb-4">
                                Let's Talk
                            </h3>
                            <p className="text-text-secondary mb-6">
                                Ready to transform your business with white-label SaaS
                                solutions? We're here to help you every step of the way.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-surface-raised border border-accent-cyan rounded-lg flex items-center justify-center mr-4">
                                    <Mail className="w-5 h-5 text-accent-cyan" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-text-primary font-medium">Email</p>
                                    <a
                                        href="mailto:hello@rubrion.ai"
                                        className="text-accent-indigo hover:underline"
                                    >
                                        hello@rubrion.ai
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-surface-raised border border-accent-green rounded-lg flex items-center justify-center mr-4">
                                    <Globe className="w-5 h-5 text-accent-green" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-text-primary font-medium">Response Time</p>
                                    <p className="text-text-secondary">Within 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-surface-raised border border-primary rounded-lg flex items-center justify-center mr-4 neon-border">
                                    <Rocket className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <p className="text-text-primary font-medium">Deployment</p>
                                    <p className="text-text-secondary">
                                        6-10 weeks to production
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </section>
    );
};

export default ContactSection;
