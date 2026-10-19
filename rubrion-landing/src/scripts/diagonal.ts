/**
 * Page transition: a diagonal wipe. Leaving, a red edge and then a black
 * panel sweep across on a slant; once covered, the browser navigates.
 * Arriving, a pre-paint flag (Layout.astro) holds the cover from the first
 * frame, then it sweeps off to the right.
 *
 * Only for links marked `data-diagonal` (main page links, hero CTAs), so the
 * rest of the site navigates normally. Skipped for modified clicks, new tabs,
 * same-page links, reduced motion, and pages restored from the bfcache. A CSS
 * failsafe (global.css) clears the arrival cover if this never runs.
 */
import mark from '../assets/rubrion-mark.svg?raw';

const KEY = 'rubrion-diagonal';
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function overlay(covered: boolean) {
	const root = document.createElement('div');
	root.className = 'dg';
	root.setAttribute('aria-hidden', 'true');
	root.innerHTML = `<span class="dg__red"></span><span class="dg__ink"><span class="dg__mark">${mark}</span></span>`;
	if (covered) root.classList.add('is-covered');
	document.body.appendChild(root);
	return root;
}

function leave(url: string) {
	const root = overlay(false);
	// Two frames so the start state paints before the transition runs.
	requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-covering')));
	setTimeout(() => {
		try {
			sessionStorage.setItem(KEY, String(Date.now()));
		} catch {
			/* storage blocked: the destination just won't animate in */
		}
		location.assign(url);
	}, 470);
}

function arrive() {
	const html = document.documentElement;
	if (!html.classList.contains('dg-arriving')) return;
	try {
		sessionStorage.removeItem(KEY);
	} catch {}
	const root = overlay(true);
	html.classList.remove('dg-arriving');
	requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-leaving')));
	setTimeout(() => root.remove(), 700);
}

function onClick(e: MouseEvent) {
	if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
	const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-diagonal]');
	if (!a || a.target === '_blank' || reduced()) return;
	const url = new URL(a.href, location.href);
	if (url.origin !== location.origin) return;
	// Same page (hash links, or a link to here): let the smooth scroller have it.
	if (url.pathname === location.pathname) return;
	e.preventDefault();
	leave(url.href);
}

export function initDiagonal() {
	document.addEventListener('click', onClick);
	arrive();
	addEventListener('pageshow', (e) => {
		if (!e.persisted) return;
		document.querySelectorAll('.dg').forEach((el) => el.remove());
		document.documentElement.classList.remove('dg-arriving');
	});
}
