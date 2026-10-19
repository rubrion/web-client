/**
 * Pill filters over a list: `[data-filter='<key>']` buttons show only
 * `[data-filter-list] > [data-cat~='<key>']` items ('all' shows every one),
 * with a FLIP animation so the remaining cards glide into place. The list's
 * own height is tweened too, so whatever sits below it
 * slides to its new position instead of jumping.
 */
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(Flip, ScrollTrigger);

export function initFilters() {
	const list = document.querySelector<HTMLElement>('[data-filter-list]');
	const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
	if (!list || !buttons.length || list.dataset.ready) return;
	list.dataset.ready = '';
	const items = Array.from(list.children) as HTMLElement[];
	const motion = document.documentElement.classList.contains('has-motion');

	buttons.forEach((btn) =>
		btn.addEventListener('click', () => {
			const key = btn.dataset.filter!;
			buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
			const state = motion ? Flip.getState(items) : null;
			const from = list.offsetHeight;
			gsap.killTweensOf(list);
			gsap.set(list, { clearProps: 'height' });
			// A class, not `hidden`: the global [hidden] rule is !important, and
			// Flip must be able to show leaving cards while they fade out.
			items.forEach((el) => el.classList.toggle('is-filtered', key !== 'all' && !el.dataset.cat!.split(' ').includes(key)));
			if (state) {
				const to = list.offsetHeight;
				gsap.fromTo(
					list,
					{ height: from },
					{
						height: to,
						duration: 0.6,
						ease: 'power3.inOut',
						clearProps: 'height',
						// Sections below moved: re-measure their scroll triggers.
						onComplete: () => ScrollTrigger.refresh(),
					},
				);
				Flip.from(state, {
					duration: 0.6,
					ease: 'power3.inOut',
					absolute: true,
					onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5 }),
					onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
				});
			}
		}),
	);
}
