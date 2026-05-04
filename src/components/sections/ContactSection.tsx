import { motion, useInView, AnimatePresence } from 'framer-motion';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Mail, Globe, Rocket, CheckCircle } from 'lucide-react';

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

declare global {
    interface Window {
        turnstile?: {
            render: (
                container: HTMLElement | string,
                options: {
                    sitekey: string;
                    callback?: (token: string) => void;
                    'expired-callback'?: () => void;
                    'error-callback'?: () => void;
                    theme?: 'light' | 'dark' | 'auto';
                    size?: 'normal' | 'flexible' | 'compact';
                }
            ) => string;
            reset: (widgetId?: string) => void;
            remove: (widgetId?: string) => void;
        };
    }
}

const WORKER_URL = import.meta.env.VITE_SUPPORT_WORKER_URL as string | undefined;
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

const ContactSection: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const turnstileContainerRef = useRef<HTMLDivElement>(null);
    const turnstileWidgetIdRef = useRef<string | null>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
    });
    const [honeypot, setHoneypot] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const captchaRequired = Boolean(TURNSTILE_SITE_KEY);

    const renderTurnstile = useCallback(() => {
        if (!captchaRequired) return;
        if (!turnstileContainerRef.current) return;
        if (!window.turnstile) return;
        if (turnstileWidgetIdRef.current) return;

        turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
            sitekey: TURNSTILE_SITE_KEY!,
            theme: 'dark',
            callback: (token: string) => setTurnstileToken(token),
            'expired-callback': () => setTurnstileToken(null),
            'error-callback': () => setTurnstileToken(null),
        });
    }, [captchaRequired]);

    useEffect(() => {
        if (!captchaRequired) return;
        if (!isInView) return;

        renderTurnstile();
        if (turnstileWidgetIdRef.current) return;

        const interval = window.setInterval(() => {
            if (window.turnstile) {
                renderTurnstile();
                if (turnstileWidgetIdRef.current) {
                    window.clearInterval(interval);
                }
            }
        }, 250);

        return () => window.clearInterval(interval);
    }, [captchaRequired, isInView, renderTurnstile]);

    useEffect(() => {
        return () => {
            if (turnstileWidgetIdRef.current && window.turnstile) {
                window.turnstile.remove(turnstileWidgetIdRef.current);
                turnstileWidgetIdRef.current = null;
            }
        };
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        if (error) setError(null);
    };

    const resetCaptcha = () => {
        if (turnstileWidgetIdRef.current && window.turnstile) {
            window.turnstile.reset(turnstileWidgetIdRef.current);
        }
        setTurnstileToken(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!WORKER_URL) {
            setError('Form endpoint is not configured. Please contact us directly.');
            return;
        }

        if (captchaRequired && !turnstileToken) {
            setError('Please complete the captcha challenge.');
            return;
        }

        setIsSubmitting(true);

        const composedMessage = formData.company
            ? `Company: ${formData.company}\n\n${formData.message}`
            : formData.message;

        const payload = {
            name: formData.name,
            email: formData.email,
            subject: 'New contact form submission',
            message: composedMessage,
            turnstileToken: turnstileToken ?? '',
            honeypot,
        };

        try {
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let message = 'Failed to send message. Please try again or contact us directly.';
                try {
                    const data = await response.json();
                    if (data?.error) message = data.error;
                } catch {
                    /* keep default */
                }
                setError(message);
                resetCaptcha();
                return;
            }

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', company: '', message: '' });
                setHoneypot('');
                resetCaptcha();
            }, 4000);
        } catch (submitError) {
            console.error('Failed to send message:', submitError);
            setError('Network error. Please try again or contact us directly.');
            resetCaptcha();
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitDisabled =
        isSubmitting || (captchaRequired && !turnstileToken);

    const submitLabel = isSubmitting
        ? '>sending...'
        : captchaRequired && !turnstileToken
            ? '>verifying...'
            : '>send_message';

    return (
        <section ref={ref} id="contact" className="lazy-paint py-20 px-4 bg-surface-raised">
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

                                {/* Honeypot — hidden from real users, bots fill it; worker silently rejects */}
                                <div
                                    aria-hidden="true"
                                    style={{
                                        position: 'absolute',
                                        left: '-10000px',
                                        width: '1px',
                                        height: '1px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <label htmlFor="company-website">Website</label>
                                    <input
                                        type="text"
                                        id="company-website"
                                        name="honeypot"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                    />
                                </div>

                                {captchaRequired && (
                                    <div
                                        ref={turnstileContainerRef}
                                        className="flex justify-center"
                                    />
                                )}

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
                                    disabled={submitDisabled}
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
                                    <span>{submitLabel}</span>
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
