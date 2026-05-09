import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

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

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

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
  const [captchaCycle, setCaptchaCycle] = useState(0);

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
  }, [captchaRequired, renderTurnstile, captchaCycle]);

  useEffect(() => {
    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          /* widget already gone */
        }
        turnstileWidgetIdRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const cycleCaptcha = useCallback(() => {
    if (turnstileWidgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      } catch {
        /* widget DOM detached already */
      }
    }
    turnstileWidgetIdRef.current = null;
    setTurnstileToken(null);
    setCaptchaCycle((n) => n + 1);
  }, []);

  const resetCaptcha = useCallback(() => {
    if (!turnstileWidgetIdRef.current || !window.turnstile) {
      setTurnstileToken(null);
      return;
    }
    try {
      window.turnstile.reset(turnstileWidgetIdRef.current);
      setTurnstileToken(null);
    } catch {
      // Container was detached (e.g. success-screen swap). Force a remount.
      cycleCaptcha();
    }
  }, [cycleCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!WORKER_URL) {
      setError('Endpoint do formulário não configurado. Entre em contato diretamente.');
      return;
    }

    if (captchaRequired && !turnstileToken) {
      setError('Por favor, complete o desafio do captcha.');
      return;
    }

    setIsSubmitting(true);

    const composedMessage = formData.company
      ? `Empresa: ${formData.company}\n\n${formData.message}`
      : formData.message;

    const payload = {
      name: formData.name,
      email: formData.email,
      subject: 'Nova mensagem do formulário de contato',
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
        let message = 'Falha ao enviar mensagem. Tente novamente ou entre em contato diretamente.';
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
        cycleCaptcha();
      }, 4000);
    } catch (submitError) {
      console.error('Failed to send message:', submitError);
      setError('Erro de rede. Tente novamente ou entre em contato diretamente.');
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDisabled = isSubmitting || (captchaRequired && !turnstileToken);
  const submitLabel = isSubmitting
    ? '>enviando...'
    : captchaRequired && !turnstileToken
      ? '>verificando...'
      : '>enviar_mensagem';

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.6 }}
        className="text-center py-8"
      >
        <motion.div
          className="mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
        >
          <CheckCircle className="w-12 h-12 text-primary mx-auto drop-shadow-lg" strokeWidth={1.5} />
        </motion.div>
        <motion.h3
          className="text-xl font-mono font-bold text-text-primary mb-2 neon-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <span>&gt;mensagem_enviada!</span>
        </motion.h3>
        <motion.p
          className="text-text-secondary font-mono"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <span>&gt; Resposta esperada em até 24 horas</span>
        </motion.p>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
          Nome *
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
        <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
          E-mail *
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
        <label htmlFor="company" className="block text-sm font-medium text-text-primary mb-2">
          Empresa
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
        <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
          Mensagem *
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
        <div ref={turnstileContainerRef} className="flex justify-center" />
      )}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4"
          >
            <p className="text-red-400 text-sm font-mono">&gt; Erro: {error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={submitDisabled}
        className="w-full bg-primary text-surface-base py-3 rounded-lg font-mono font-semibold neon-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{
          scale: isSubmitting ? 1 : 1.02,
          boxShadow: isSubmitting ? 'none' : '0 0 25px rgba(255, 0, 64, 0.7)',
        }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={{
          boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(255, 0, 64, 0.5)',
        }}
      >
        <span>{submitLabel}</span>
      </motion.button>
    </form>
  );
}
