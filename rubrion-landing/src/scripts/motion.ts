/**
 * Page motion: smooth scroll, reveals, split headings and digit rollers.
 * Gated on `html.has-motion`, set before paint in Layout.astro only when JS
 * runs and reduced motion isn't requested, so the page stays fully visible
 * and static if any of this fails to load.
 *
 * Nothing here runs a loop of its own: Lenis rides GSAP's ticker, which
 * sleeps when nothing is animating.
 */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);
// Mobile URL-bar resizes would otherwise recalculate every trigger mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

const EASE = 'power3.out';

function initSmoothScroll() {
	const lenis = new Lenis({ lerp: 0.14, wheelMultiplier: 1.1, touchMultiplier: 1.5 });
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((time) => lenis.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);

	// Hash links go through Lenis or they fight the smooth scroller.
	document.addEventListener('click', (event) => {
		const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
		if (!link) return;
		const url = new URL(link.href, location.href);
		if (url.pathname !== location.pathname || url.hash.length < 2) return;
		const target = document.querySelector(url.hash);
		if (!target) return;
		event.preventDefault();
		lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.1 });
	});
}

/** One heading per task, so splitting a long page never blocks input. */
async function initHeadlines() {
	for (const el of gsap.utils.toArray<HTMLElement>('[data-split]')) {
		await new Promise((r) => setTimeout(r, 0));
		SplitText.create(el, {
			type: 'lines',
			mask: 'lines',
			// global.css pads `.split-line-mask` so ascenders aren't clipped.
			linesClass: 'split-line',
			autoSplit: true,
			onSplit(self) {
				return gsap.from(self.lines, {
					yPercent: 110,
					duration: 1,
					stagger: 0.09,
					ease: 'power4.out',
					scrollTrigger: { trigger: el, start: 'top 88%', once: true },
				});
			},
		});
	}
	ScrollTrigger.refresh();
}

function initReveals() {
	ScrollTrigger.batch('[data-reveal]', {
		start: 'top 92%',
		once: true,
		batchMax: 6,
		onEnter: (batch) =>
			gsap.to(batch, {
				opacity: 1,
				y: 0,
				duration: 0.6,
				stagger: 0.06,
				ease: EASE,
				overwrite: true,
				force3D: true,
				// Flag before clearProps runs, or the CSS start state comes back.
				onStart: () => (batch as HTMLElement[]).forEach((el) => el.classList.add('is-revealed')),
				clearProps: 'transform,opacity',
			}),
	});
}

/** Digit rollers (Roller.astro): odd columns roll down, even ones up. */
function initRollers() {
	gsap.utils.toArray<HTMLElement>('[data-roller]').forEach((roller) => {
		const strips = roller.querySelectorAll<HTMLElement>('.roller__strip');
		ScrollTrigger.create({
			trigger: roller,
			start: 'top 90%',
			once: true,
			onEnter: () => {
				strips.forEach((strip, i) => {
					const down = strip.dataset.dir === 'down';
					// `y: 0` on both ends: GSAP would otherwise read the CSS start
					// translate as pixels and park the strip one digit short.
					gsap.fromTo(
						strip,
						{ y: 0, yPercent: down ? -90 : 0 },
						{ y: 0, yPercent: down ? 0 : -90, duration: 2, delay: i * 0.08, ease: 'sine.out' },
					);
				});
				roller.classList.add('is-rolled');
			},
		});
	});
}

/** Last resort: anything still hidden once it's on screen gets shown. */
function settleVisible() {
	setTimeout(() => {
		document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)').forEach((el) => {
			if (el.getBoundingClientRect().top < innerHeight) {
				el.classList.add('is-revealed');
				gsap.set(el, { clearProps: 'transform,opacity' });
			}
		});
	}, 2500);
}

export function initMotion() {
	if (!document.documentElement.classList.contains('has-motion')) return;
	initSmoothScroll();
	initReveals();
	initRollers();
	settleVisible();
	// Splitting before fonts settle measures the wrong line boxes.
	document.fonts.ready.then(initHeadlines);
}
