/**
 * Renders the social and store kit into public/brand/social/: covers, posts,
 * stories and the Google Play developer page images, in English and
 * Portuguese, from one template drawn with the site's own fonts, logo and
 * colours (ink, paper, one red spark). The brand page lists the files.
 *
 *   node tools/social.mjs [id ...]      (default: every asset)
 *
 * Needs Playwright (operations: the copy in ~/rubrion/cerne) and ImageMagick
 * (`convert`) to flatten to 24-bit and fit the 1 MB limits.
 *
 * Each asset has a safe box: the part no platform crops or covers with a
 * profile photo or buttons. Text stays inside it; the background bleeds.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public/brand/social');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT ?? join(process.env.HOME, 'rubrion/cerne/node_modules/playwright'));

const font = (p) => pathToFileURL(join(root, 'node_modules/@fontsource', p)).href;
const logo = readFileSync(join(root, 'public/brand/rubrion-logo-white.svg'), 'utf8').replace('#FFFFFF', '#F3F2EE');
const mark = readFileSync(join(root, 'src/assets/rubrion-mark.svg'), 'utf8');

const copy = {
	en: { kicker: 'Software studio · Brazil', sub: 'Custom software & AI agents that run on your own infrastructure.', url: 'rubrion.ai' },
	pt: { kicker: 'Estúdio de software · Brasil', sub: 'Software e agentes de IA sob medida, na sua própria infraestrutura.', url: 'rubrion.com.br' },
};

// layout: strip (one row), split (text left, mark right), center, stack (tall).
// safe: [x, y, w, h] in px. max: bytes the platform accepts.
const assets = [
	{ id: 'google-play-header', w: 4096, h: 2304, layout: 'center', safe: [560, 260, 2976, 1784], max: 1e6 },
	{ id: 'open-graph', w: 1200, h: 630, layout: 'split', safe: [80, 70, 1040, 490] },
	{ id: 'github-social', w: 1280, h: 640, layout: 'split', safe: [90, 80, 1100, 480] },
	{ id: 'linkedin-company-cover', w: 1128, h: 191, layout: 'strip', safe: [300, 30, 790, 131] },
	{ id: 'linkedin-personal-banner', w: 1584, h: 396, layout: 'strip', safe: [520, 70, 1000, 256] },
	{ id: 'x-header', w: 1500, h: 500, layout: 'strip', safe: [430, 110, 1000, 280] },
	{ id: 'facebook-cover', w: 1640, h: 624, layout: 'split', safe: [300, 110, 1040, 400] },
	{ id: 'youtube-banner', w: 2560, h: 1440, layout: 'strip', safe: [507, 509, 1546, 423] },
	{ id: 'reddit-banner', w: 1920, h: 384, layout: 'strip', safe: [380, 80, 1160, 224] },
	{ id: 'reddit-mobile-banner', w: 1600, h: 480, layout: 'strip', safe: [200, 120, 1200, 240] },
	{ id: 'post-square', w: 1080, h: 1080, layout: 'stack', safe: [96, 96, 888, 888] },
	{ id: 'post-portrait', w: 1080, h: 1350, layout: 'stack', safe: [96, 120, 888, 1110] },
	{ id: 'story', w: 1080, h: 1920, layout: 'stack', safe: [96, 280, 888, 1300] },
];

const css = `
@font-face { font-family: Jakarta; font-weight: 600; src: url(${font('plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff2')}); }
@font-face { font-family: Lato; font-weight: 400; src: url(${font('lato/files/lato-latin-400-normal.woff2')}); }
@font-face { font-family: Lato; font-weight: 700; src: url(${font('lato/files/lato-latin-700-normal.woff2')}); }
@font-face { font-family: Unna; font-style: italic; src: url(${font('unna/files/unna-latin-400-italic.woff2')}); }
* { margin: 0; box-sizing: border-box; }
html, body { width: var(--w); height: var(--h); overflow: hidden; }
body {
	position: relative; color: #f3f2ee; font-family: Lato, sans-serif;
	background:
		radial-gradient(ellipse 55% 75% at 82% 18%, rgba(243, 242, 238, 0.16), transparent 70%),
		radial-gradient(ellipse 45% 60% at 74% 70%, rgba(230, 43, 48, 0.22), transparent 70%),
		radial-gradient(ellipse 70% 90% at 0% 100%, rgba(0, 0, 0, 0.55), transparent 70%),
		linear-gradient(115deg, #141413 0%, #1d1c1a 55%, #3a3533 100%);
}
/* Film grain, as on the site's shader. */
body::after {
	content: ''; position: absolute; inset: 0; opacity: 0.09; mix-blend-mode: overlay; pointer-events: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* The seam: a hairline on a slant, lit red where it crosses the light. */
.seam { position: absolute; display: var(--seam-on, block); top: -10%; bottom: -10%; left: var(--seam); width: 1px; transform: rotate(14deg); transform-origin: center;
	background: linear-gradient(to bottom, transparent, rgba(243,242,238,.22) 20%, rgba(243,242,238,.22) 45%, #e62b30 55%, #e62b30 63%, rgba(243,242,238,.22) 72%, transparent); }
.safe { position: absolute; left: var(--sx); top: var(--sy); width: var(--sw); height: var(--sh); display: flex; }
.eyebrow { white-space: nowrap; display: inline-flex; align-items: center; gap: .9em; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(243,242,238,.78); font-size: calc(var(--u) * .32); }
.eyebrow::before { content: ''; width: 1.05em; height: .96em; background: #e62b30;
	-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 22'%3E%3Cpath fill-rule='evenodd' d='M4.67 0.92Q5.28 0.00 6.38 0.00L17.62 0.00Q18.72 0.00 19.33 0.92L23.45 7.09Q24.00 7.92 23.35 8.68L12.78 21.09Q12.00 22.00 11.22 21.09L0.65 8.68Q0.00 7.92 0.55 7.09ZM1.6 7.92h20.8v1.3H1.6z'/%3E%3C/svg%3E") center / contain no-repeat; }
h1 { white-space: nowrap; font-family: Jakarta, sans-serif; font-weight: 600; letter-spacing: -.035em; line-height: 1.02; font-size: calc(var(--u) * 1.5); }
h1 em { font-family: Unna, serif; font-style: italic; font-weight: 400; letter-spacing: -.01em; }
.sub { color: rgba(243,242,238,.72); line-height: 1.5; font-size: calc(var(--u) * .42); max-width: 30em; }
.url { font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(243,242,238,.7); font-size: calc(var(--u) * .3); }
.logo svg { display: block; height: calc(var(--u) * .62); width: auto; }
.mark svg { display: block; width: 100%; height: auto; color: #f3f2ee; }
.rule { background: rgba(243,242,238,.24); }

.split { flex-direction: row; align-items: stretch; justify-content: space-between; }
.split .text { max-width: calc(var(--sw) - var(--sh) * .5 - var(--u) * 2); display: flex; flex-direction: column; justify-content: space-between; }
.split .top { display: flex; flex-direction: column; gap: calc(var(--u) * .45); }
.split .foot { display: flex; align-items: center; gap: calc(var(--u) * .5); }
.split .foot .rule { width: 1px; height: calc(var(--u) * .5); }
.split .mark { align-self: center; width: calc(var(--sh) * .5); filter: drop-shadow(0 0 calc(var(--u) * 1.2) rgba(230,43,48,.35)); }

.strip { align-items: center; justify-content: center; gap: calc(var(--u) * .9); }
.strip .rule { width: 1px; height: calc(var(--u) * 1.6); background: rgba(243,242,238,.3); }
.strip .text { display: flex; flex-direction: column; gap: calc(var(--u) * .22); }
.strip h1 { font-size: calc(var(--u) * 1.05); white-space: nowrap; }
.strip .sub { font-size: calc(var(--u) * .34); max-width: none; white-space: nowrap; }
.strip .logo svg { height: calc(var(--u) * .78); }

.center, .stack { flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: calc(var(--u) * .55); }
.center .mark, .stack .mark { width: calc(var(--u) * 2.2); filter: drop-shadow(0 0 calc(var(--u) * .9) rgba(230,43,48,.4)); margin-bottom: calc(var(--u) * .3); }
.center .sub, .stack .sub { max-width: 22em; }
.stack { justify-content: space-between; }
.stack .mid { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u) * .55); }
.stack h1 { font-size: calc(var(--u) * 1.7); }
.stack .logo svg { height: calc(var(--u) * .8); }
`;

function page(a, lang) {
	const t = copy[lang];
	const [sx, sy, sw, sh] = a.safe;
	// --u: one type unit, sized from the safe box.
	const u = a.layout === 'strip' ? Math.min(sh / 2.1, sw / 16.5) : a.layout === 'split' ? Math.min(sh / 7, sw / 13) : a.layout === 'center' ? Math.min(sh / 10.2, sw / 9) : Math.min(sh / 9, sw / 9.6);
	// The seam runs where there is no text: between the text and the mark, or
	// in the margin right of a strip.
	const right = a.w - sx - sw;
	const seam = a.layout === 'split' ? `${sx + sw - sh * 0.5 - u * 1}px` : a.layout === 'strip' ? (right > u ? `${sx + sw + right * 0.45}px` : 'none') : `${sx + sw + right * 0.5}px`;
	const h1 = `<h1>Code-free,${a.layout === 'strip' ? ' ' : '<br>'}<em>cloud-fee.</em></h1>`;
	const body = {
		split: `<div class="text"><div class="top"><span class="eyebrow">${t.kicker}</span>${h1}<p class="sub">${t.sub}</p></div><div class="foot"><span class="logo">${logo}</span><span class="rule"></span><span class="url">${t.url}</span></div></div><div class="mark">${mark}</div>`,
		strip: `<span class="logo">${logo}</span><span class="rule"></span><div class="text">${h1}<p class="sub">${t.sub}</p></div>`,
		center: `<div class="mark">${mark}</div><span class="eyebrow">${t.kicker}</span>${h1}<p class="sub">${t.sub}</p><span class="url">${t.url}</span>`,
		stack: `<span class="logo">${logo}</span><div class="mid"><span class="eyebrow">${t.kicker}</span>${h1}<p class="sub">${t.sub}</p></div><span class="url">${t.url}</span>`,
	}[a.layout];
	return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${css}</style></head>
<body style="--w:${a.w}px;--h:${a.h}px;--sx:${sx}px;--sy:${sy}px;--sw:${sw}px;--sh:${sh}px;--u:${u.toFixed(1)}px;--seam:${seam};${seam === 'none' ? '--seam-on:none' : ''}">
<span class="seam"></span><div class="safe ${a.layout}">${body}</div></body></html>`;
}

const only = process.argv.slice(2);
mkdirSync(join(out, 'preview'), { recursive: true });
const tmp = join(out, '.tmp.html');
const browser = await chromium.launch();
for (const a of assets.filter((a) => !only.length || only.includes(a.id))) {
	for (const lang of ['en', 'pt']) {
		const p = await browser.newPage({ viewport: { width: a.w, height: a.h } });
		writeFileSync(tmp, page(a, lang));
		await p.goto(pathToFileURL(tmp).href);
		await p.evaluate(() => document.fonts.ready);
		// Text must stay inside the safe box.
		const spill = await p.evaluate(() => {
			const s = document.querySelector('.safe').getBoundingClientRect();
			return [...document.querySelectorAll('.safe *:not(svg *)')].some((e) => {
				const r = e.getBoundingClientRect();
				return r.width && (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1);
			});
		});
		const png = join(out, `rubrion-${a.id}-${lang}.png`);
		await p.screenshot({ path: png });
		await p.close();
		// 24-bit, no alpha (Play refuses transparency); JPEG when PNG is over the limit.
		execFileSync('convert', [png, '-alpha', 'off', '-strip', '-define', 'png:color-type=2', png]);
		let file = png;
		if (a.max && statSync(png).size > a.max) {
			file = png.replace(/\.png$/, '.jpg');
			execFileSync('convert', [png, '-strip', '-quality', '90', '-sampling-factor', '4:4:4', file]);
			rmSync(png);
		}
		// A light preview for the brand page.
		if (lang === 'en') execFileSync('convert', [file, '-resize', '720x720>', '-quality', '78', join(out, 'preview', `rubrion-${a.id}.webp`)]);
		console.log(`${spill ? 'SPILL ' : ''}${file.slice(root.length + 1)} ${a.w}x${a.h} ${(statSync(file).size / 1024).toFixed(0)} KB`);
	}
}
rmSync(tmp, { force: true });

// Google Play developer icon: the ink avatar at 512, 24-bit, no alpha.
if (!only.length || only.includes('google-play-icon')) {
	const p = await browser.newPage({ viewport: { width: 512, height: 512 } });
	await p.setContent(`<style>*{margin:0}</style>${readFileSync(join(root, 'public/brand/rubrion-avatar-ink.svg'), 'utf8').replace('<svg ', '<svg width="512" height="512" ')}`);
	const icon = join(out, 'rubrion-google-play-icon.png');
	await p.screenshot({ path: icon });
	execFileSync('convert', [icon, '-alpha', 'off', '-strip', '-define', 'png:color-type=2', icon]);
	console.log(`${icon.slice(root.length + 1)} 512x512 ${(statSync(icon).size / 1024).toFixed(0)} KB`);
}
await browser.close();
