import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export const initializeScrollSystem = () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Check if we're on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (prefersReducedMotion || (isMobile && isTouchDevice)) {
    // Use native scroll for mobile and reduced motion
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      ignoreMobileResize: true,
    });
    
    // Add smooth scroll behavior to body for mobile
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return null;
  }

  // Initialize Lenis only for desktop
  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false, // Disable smooth touch to prevent conflicts
    touchMultiplier: 2,
    infinite: false,
    autoResize: true,
    gestureDirection: 'vertical',
    normalizeWheel: true,
    wheelMultiplier: 1,
  });

  // Bind Lenis scroll to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Configure ScrollTrigger for smooth scrolling
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
  });

  // Update ScrollTrigger on Lenis scroll
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  // Disable lag smoothing for better performance with ScrollTrigger
  gsap.ticker.lagSmoothing(0);

  return lenis;
};

export const destroyScrollSystem = () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  ScrollTrigger.killAll();
  gsap.ticker.lagSmoothing(33, 16); // Reset to default
};

export const getLenis = () => lenis;

// Utility to detect mobile and touch devices
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Force refresh scroll system on mobile issues
export const refreshScrollSystem = () => {
  if (lenis) {
    lenis.resize();
  }
  ScrollTrigger.refresh();
};

// Emergency scroll unlock for mobile stuck issues
export const unlockScroll = () => {
  if (isMobileDevice() && isTouchDevice()) {
    // Force enable native scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.position = 'static';
    
    // Reset any transform that might block scroll
    document.body.style.transform = 'none';
    document.documentElement.style.transform = 'none';
    
    // Force refresh after a small delay
    setTimeout(() => {
      refreshScrollSystem();
    }, 100);
  }
};

// Utility function to scroll to element
export const scrollToElement = (
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number }
) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  if (lenis) {
    // Use Lenis for desktop smooth scrolling
    lenis.scrollTo(target, {
      offset: options?.offset || 0,
      duration: options?.duration || 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    // Fallback for mobile and reduced motion
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop + (options?.offset || 0);

    // Use native scrollTo with smooth behavior for better mobile compatibility
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Utility function to create scroll-triggered animations
export const createScrollAnimation = (
  trigger: string | Element,
  animation: gsap.core.Tween | gsap.core.Timeline,
  options?: ScrollTrigger.Vars
) => {
  return ScrollTrigger.create({
    trigger,
    animation,
    toggleActions: 'play none none reverse',
    ...options,
  });
};

// Enhanced scroll animation for logo with better easing
export const createLogoScrollAnimation = (
  logoElement: Element,
  options?: {
    startScale?: number;
    endScale?: number;
    rotationRange?: number;
    duration?: number;
  }
) => {
  const {
    startScale = 0.9,
    endScale = 1.1,
    rotationRange = 5,
    duration = 1
  } = options || {};

  return gsap.timeline({
    scrollTrigger: {
      trigger: logoElement,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 2, // Mais suave
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = startScale + (progress * (endScale - startScale));
        const rotation = Math.sin(progress * Math.PI * 2) * rotationRange;
        
        gsap.set(logoElement, {
          scale,
          rotation,
          transformOrigin: 'center center',
          ease: 'power2.out'
        });
      }
    }
  });
};
