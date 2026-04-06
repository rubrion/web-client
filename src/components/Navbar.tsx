import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { useEffect, useState } from 'react';

import { scrollToElement } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'who-we-serve', label: 'Who We Serve', href: '#who-we-serve' },
  { id: 'what-we-deliver', label: 'What We Deliver', href: '#what-we-deliver' },
  { id: 'service-lines', label: 'Service Lines', href: '#service-lines' },
  { id: 'delivery-lifecycle', label: 'Delivery', href: '#delivery-lifecycle' },
];

const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to width percentage
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    // Handle scroll state for navbar background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const allSections = ['hero', ...navItems.map((item) => item.href.substring(1))];
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      let currentSection = 'hero'; // Default to hero

      for (const sectionId of allSections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;
          const elementBottom = rect.bottom;

          // Seção está visível se pelo menos 50% dela está na tela
          const isVisible = elementTop < windowHeight * 0.5 && elementBottom > windowHeight * 0.5;

          if (isVisible) {
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Update on scroll
    const handleScroll = () => {
      updateActiveSection();
    };

    // Initial update
    updateActiveSection();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (href: string) => {
    const targetId = href.substring(1); // Remove # from href
    scrollToElement(`#${targetId}`, { offset: -80 });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleCTAClick = () => {
    scrollToElement('#contact', { offset: -80 });
  };

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50"
        style={{
          width: progressWidth,
          boxShadow: '0 0 10px #ff0040'
        }}
      />

      {/* Navbar */}
      <motion.nav
        className={`fixed top-1 left-0 right-0 z-40 transition-all duration-300 bg-surface-base/90 backdrop-blur-md border-b border-primary/30 ${isScrolled
          ? 'shadow-lg'
          : ''
          }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Com mais destaque */}
            <motion.div
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
                  {/* Background fill with neon effect */}
                  <path
                    d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                    fill="#ff004020"
                    stroke="none"
                  />
                  {/* Outline stroke */}
                  <path
                    d="M336194 676699l254 344276c-2062,-2699 -34308,-35241 -36630,-38088 -51960,-63639 -90552,-160624 -98194,-241964 -57422,-611277 832864,-746317 959005,-150832 58308,275244 -193190,696550 -400211,298339 222676,-1668 342797,-256615 214791,-437659 -94868,-114989 -167751,-119716 -311603,-121042 -116144,-1072 -157418,1190 -246788,76712 -29681,29678 -63070,79390 -75608,137214l322396 637c48230,123 98276,-8566 134261,27999 34590,35167 3233,104336 -36759,108100l-424914 -3692zm198181 674809c3553,-10757 2336,-415256 1461,-459649 383975,666516 840703,304465 833775,-219386 -3679,-277612 -181744,-530330 -442336,-627372 -564951,-210380 -1098227,353567 -875430,898908 84447,206695 266527,357188 482530,407500z"
                    fill="none"
                    stroke="#ff0040"
                    strokeWidth="8000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#navbarLogoGlow)"
                    style={{
                      filter: 'drop-shadow(0 0 5px #ff0040) drop-shadow(0 0 10px #ff004080)'
                    }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Desktop Navigation - Centralizado */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-3 py-2 text-sm font-mono font-medium rounded-md transition-colors relative ${activeSection === item.href.substring(1)
                    ? 'text-primary neon-text'
                    : 'text-text-muted hover:text-primary'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.href.substring(1) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="activeIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{
                        boxShadow: '0 0 5px #ff0040'
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block ml-12">
              <motion.button
                onClick={handleCTAClick}
                className="bg-transparent text-primary border-2 border-primary px-6 py-3 rounded-lg text-base font-mono font-bold neon-border hover:bg-primary hover:text-surface-base hover:shadow-xl transition-all duration-200 whitespace-nowrap relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
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
                <span className="ml-1">send_message</span>
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

        {/* Mobile Navigation Menu */}
        <motion.div
          className={`lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-4 space-y-2 bg-surface-base/95 backdrop-blur-md border-t border-primary/30">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left px-3 py-2 text-base font-mono font-medium rounded-md transition-colors ${activeSection === item.href.substring(1)
                  ? 'text-primary neon-text bg-surface-raised'
                  : 'text-text-muted hover:text-primary hover:bg-surface-raised'
                  }`}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}

            {/* Mobile CTA Button */}
            <motion.button
              onClick={() => {
                handleCTAClick();
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-4 bg-transparent text-primary border-2 border-primary px-4 py-3 rounded-lg text-base font-mono font-bold neon-border hover:bg-primary hover:text-surface-base transition-all duration-200 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
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
              <span className="ml-1">send_message</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
};

export default Navbar;
