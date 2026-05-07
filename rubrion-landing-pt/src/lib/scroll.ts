import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let lenisRafCallback: ((time: number) => void) | null = null;

export const initializeScrollSystem = async (): Promise<Lenis | null> => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (prefersReducedMotion || (isMobile && isTouchDevice)) {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
      ignoreMobileResize: true,
    });
    document.documentElement.style.scrollBehavior = 'smooth';
    return null;
  }

  const { default: LenisCtor } = await import('lenis');

  lenis = new LenisCtor({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
    autoResize: true,
    wheelMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    ignoreMobileResize: true,
  });

  lenisRafCallback = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(lenisRafCallback);
  gsap.ticker.lagSmoothing(0);

  return lenis;
};

export const destroyScrollSystem = () => {
  if (lenisRafCallback) {
    gsap.ticker.remove(lenisRafCallback);
    lenisRafCallback = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  ScrollTrigger.killAll();
  gsap.ticker.lagSmoothing(33, 16);
};

export const getLenis = () => lenis;

export const scrollToElement = (
  target: string | HTMLElement,
  options?: { offset?: number; duration?: number }
) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset || 0,
      duration: options?.duration || 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementTop + (options?.offset || 0);
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};
