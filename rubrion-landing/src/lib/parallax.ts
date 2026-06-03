import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * How far (in % of layer height) a layer with speed=1 travels across its
 * floor's scroll range. Layer images overscan ±15%, so keep
 * speed * OVERSCAN <= 15 to never reveal an edge.
 */
const OVERSCAN = 15;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Wires a scrubbed parallax tween for every `.floor__layer[data-speed]`.
 * Layers are discovered generically — adding a foreground image to a
 * FloorStage `layers` array needs no JS changes.
 *
 * Touch devices run this too — ScrollTrigger scrubs off native scroll
 * (only Lenis is desktop-only, see lib/scroll.ts). Static fallback is
 * reserved for prefers-reduced-motion.
 */
export const initParallax = () => {
  if (prefersReducedMotion()) {
    document.body.classList.add('reduced-motion');
    return;
  }

  const layers = document.querySelectorAll<HTMLElement>(
    '.floor__layer[data-speed]'
  );

  layers.forEach((layer) => {
    const speed = Number.parseFloat(layer.dataset.speed ?? '0');
    if (!speed) return;

    const floor = layer.closest<HTMLElement>('.floor');
    if (!floor) return;

    const range = Math.min(Math.abs(speed), 1) * OVERSCAN * Math.sign(speed);

    gsap.fromTo(
      layer,
      { yPercent: -range },
      {
        yPercent: range,
        ease: 'none',
        scrollTrigger: {
          trigger: floor,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });

  // Scroll-driven blackout per floor: grows to full black as the floor
  // exits and recedes as it enters, so the seam between two floor images
  // is always hidden inside black.
  document.querySelectorAll<HTMLElement>('.floor').forEach((floor) => {
    const fade = floor.querySelector<HTMLElement>('.floor__fade');
    if (!fade) return;

    // Entering from below: start black, reveal as the floor rises.
    gsap.fromTo(
      fade,
      { opacity: 1 },
      {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: floor,
          start: 'top 85%',
          end: 'top 15%',
          scrub: true,
        },
      }
    );

    // Leaving through the top: darken back to black.
    gsap.fromTo(
      fade,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: floor,
          start: 'bottom 85%',
          end: 'bottom 15%',
          scrub: true,
        },
      }
    );
  });
};

/**
 * Adds `.is-visible` to `.reveal` elements as they enter the viewport.
 * IntersectionObserver works for both smooth (Lenis) and native scroll,
 * so it covers touch devices too. Reduced motion shows content via CSS.
 */
export const initReveals = () => {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
};
