import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ALT_HTML_LANG, ALT_LANG_ARIA, ALT_LANG_LABEL, ALT_URL, LANG_LABEL } from '@/data/locale';
import { destroyScrollSystem, initializeScrollSystem, scrollToElement } from '@/lib/scroll';

const LanguageSwitcher = ({ variant }: { variant: 'desktop' | 'mobile' }) => {
  const cls = variant === 'desktop'
    ? 'hidden lg:flex items-center gap-1 ml-3 font-mono text-sm'
    : 'flex items-center justify-center gap-1 mt-3 font-mono text-sm';
  return (
    <div className={cls}>
      <span
        className="text-primary neon-text font-bold px-2 py-1 border border-primary/40 rounded"
        aria-current="page"
      >
        {LANG_LABEL}
      </span>
      <span className="text-text-muted px-1">/</span>
      <a
        href={ALT_URL}
        hrefLang={ALT_HTML_LANG}
        aria-label={ALT_LANG_ARIA}
        className="text-text-muted hover:text-primary px-2 py-1 transition-colors rounded"
      >
        {ALT_LANG_LABEL}
      </a>
    </div>
  );
};

interface NavItem {
  id: string;
  label: string;
  href: string;
}

// Anchor items (`#section`) trigger smooth-scroll on the home page; page items
// (`/path`) navigate. The Blog item lives on its own route so it can host the
// EdgePress embed iframe full-bleed.
const navItems: NavItem[] = [
  { id: 'who-we-serve', label: 'Who We Serve', href: '#who-we-serve' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'blog', label: 'Blog', href: '/blog' },
];

const isAnchor = (href: string) => href.startsWith('#');

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('hero');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const arrowPulse = shouldReduceMotion ? {} : { x: [0, 3, 0] };
  const arrowPulseTransition = shouldReduceMotion
    ? undefined
    : { duration: 2, repeat: Infinity, ease: 'easeInOut' as const };

  useEffect(() => {
    initializeScrollSystem();
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    setCurrentPath(window.location.pathname);
    return () => {
      destroyScrollSystem();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const allSections = [
        'hero',
        ...navItems.filter((item) => isAnchor(item.href)).map((item) => item.href.substring(1)),
      ];
      const windowHeight = window.innerHeight;

      let currentSection = 'hero';

      for (const sectionId of allSections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible =
            rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5;
          if (isVisible) currentSection = sectionId;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (isAnchor(href)) {
      // On the home page: smooth-scroll to section.
      // On any other page: bounce back to home with the hash so the home page
      // scrolls into view after navigation.
      if (currentPath === '/' || currentPath === '') {
        scrollToElement(href, { offset: -80 });
      } else {
        window.location.href = `/${href}`;
      }
      return;
    }
    window.location.href = href;
  };

  const handleCTAClick = () => {
    setIsMobileMenuOpen(false);
    if (currentPath === '/' || currentPath === '') {
      scrollToElement('#contact', { offset: -80 });
    } else {
      window.location.href = '/#contact';
    }
  };

  const isItemActive = (item: NavItem) => {
    if (!isAnchor(item.href)) return currentPath === item.href;
    return currentPath === '/' && activeSection === item.href.substring(1);
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{ width: progressWidth, boxShadow: '0 0 10px #ff0040' }}
      />

      <motion.nav
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-300 bg-surface-base/90 backdrop-blur-md border-b border-primary/30 ${
          isScrolled ? 'shadow-lg' : ''
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              type="button"
              aria-label="Rubrion home"
              className="flex items-center cursor-pointer mr-12"
              onClick={() => handleNavClick('#hero')}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-10 w-10">
                <svg
                  viewBox="0 0 1369691 1351508"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="navbarLogoGlow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                    fill="#ff004020"
                    stroke="none"
                  />
                  <path
                    d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                    fill="none"
                    stroke="#ff0040"
                    strokeWidth="8000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#navbarLogoGlow)"
                    style={{
                      filter: 'drop-shadow(0 0 5px #ff0040) drop-shadow(0 0 10px #ff004080)',
                    }}
                  />
                </svg>
              </div>
            </motion.button>

            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
              {navItems.map((item) => {
                const active = isItemActive(item);
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNavClick(item.href)}
                    className={`px-3 py-2 text-sm font-mono font-medium rounded-md transition-colors relative ${
                      active ? 'text-primary neon-text' : 'text-text-muted hover:text-primary'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    {active && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        layoutId="activeIndicator"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        style={{ boxShadow: '0 0 5px #ff0040' }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="hidden lg:block ml-12">
              <motion.button
                onClick={handleCTAClick}
                className="bg-transparent text-primary border-2 border-primary px-6 py-3 rounded-lg text-base font-mono font-bold neon-border hover:bg-primary hover:text-surface-base hover:shadow-xl transition-all duration-200 whitespace-nowrap relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow:
                    '0 0 20px rgba(255, 0, 64, 0.3), inset 0 0 20px rgba(255, 0, 64, 0.1)',
                }}
              >
                <motion.span
                  className="inline-block"
                  animate={arrowPulse}
                  transition={arrowPulseTransition}
                >
                  &gt;
                </motion.span>
                <span className="ml-1">send_message</span>
              </motion.button>
            </div>

            <LanguageSwitcher variant="desktop" />

            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
                className="text-text-secondary hover:text-text-primary p-2"
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        <motion.div
          className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-surface-base/95 backdrop-blur-md border-t border-primary/30">
            {navItems.map((item) => {
              const active = isItemActive(item);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`block w-full text-left px-3 py-2 text-base font-mono font-medium rounded-md transition-colors ${
                    active
                      ? 'text-primary neon-text bg-surface-raised'
                      : 'text-text-muted hover:text-primary hover:bg-surface-raised'
                  }`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              );
            })}

            <motion.button
              onClick={() => {
                handleCTAClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-4 bg-transparent text-primary border-2 border-primary px-4 py-3 rounded-lg text-base font-mono font-bold neon-border hover:bg-primary hover:text-surface-base transition-all duration-200 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow:
                  '0 0 20px rgba(255, 0, 64, 0.3), inset 0 0 20px rgba(255, 0, 64, 0.1)',
              }}
            >
              <motion.span
                className="inline-block"
                animate={arrowPulse}
                transition={arrowPulseTransition}
              >
                &gt;
              </motion.span>
              <span className="ml-1">send_message</span>
            </motion.button>

            <LanguageSwitcher variant="mobile" />
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
