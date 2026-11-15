/**
 * Renders the social and store kit into public/brand/social/: covers, posts,
 * stories and the Google Play developer page images, in English and
 * Portuguese and four colour themes, from one template drawn with the site's
 * own fonts, logo and colours; plus the icon in the same four themes. The
 * brand page lists the files, with a theme switch.
 *
 *   node tools/social.mjs [id ...]      (default: every asset; `icons` for the icons)
 *
 * Files: rubrion-<id>-<theme>-<lang>.jpg (JPEG keeps the grain under every
 * platform's limit), rubrion-icon-<theme>-<512|1024>.png.
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
const logo = readFileSync(join(root, 'public/brand/rubrion-logo-white.svg'), 'utf8').replace('fill="#FFFFFF"', 'fill="currentColor"');
const mark = readFileSync(join(root, 'src/assets/rubrion-mark.svg'), 'utf8');

const copy = {
	en: { kicker: 'Software studio · Brazil', sub: 'Custom software & AI agents that run on your own infrastructure.', url: 'rubrion.ai' },
	pt: { kicker: 'Estúdio de software · Brasil', sub: 'Software e agentes de IA sob medida, na sua própria infraestrutura.', url: 'rubrion.com.br' },
};

// Ink: the site's dark hero. Spark: the same with the mark in red. Paper: the
// light site, red mark. Red: the brand red as the ground, for the moments the
// red should carry the whole image (the site itself never paints red surfaces).
const themes = {
	ink: { bg: 'linear-gradient(115deg, #141413 0%, #1d1c1a 55%, #3a3533 100%)', light: 'rgba(243,242,238,.16)', glow: 'rgba(230,43,48,.22)', shade: 'rgba(0,0,0,.55)', fg: '243,242,238', mark: '#f3f2ee', gem: '#e62b30', halo: 'rgba(230,43,48,.35)', grain: 0.09 },
	spark: { bg: 'linear-gradient(115deg, #141413 0%, #1b1a19 55%, #2e2a29 100%)', light: 'rgba(243,242,238,.10)', glow: 'rgba(230,43,48,.30)', shade: 'rgba(0,0,0,.55)', fg: '243,242,238', mark: '#e62b30', gem: '#e62b30', halo: 'rgba(230,43,48,.55)', grain: 0.09 },
	paper: { bg: 'linear-gradient(115deg, #f3f2ee 0%, #efede8 55%, #e4e1da 100%)', light: 'rgba(255,255,255,.7)', glow: 'rgba(230,43,48,.13)', shade: 'rgba(233,231,225,.6)', fg: '20,20,19', mark: '#e62b30', gem: '#e62b30', halo: 'rgba(230,43,48,.22)', grain: 0.06 },
	red: { bg: 'linear-gradient(115deg, #a8000f 0%, #d00016 55%, #e62b30 100%)', light: 'rgba(255,190,180,.28)', glow: 'rgba(120,0,10,.45)', shade: 'rgba(60,0,6,.45)', fg: '255,255,255', mark: '#ffffff', gem: '#ffffff', halo: 'rgba(80,0,8,.35)', grain: 0.08 },
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
	position: relative; color: rgb(var(--fg)); font-family: Lato, sans-serif;
	background:
		radial-gradient(ellipse 55% 75% at 82% 18%, var(--light), transparent 70%),
		radial-gradient(ellipse 45% 60% at 74% 70%, var(--glow), transparent 70%),
		radial-gradient(ellipse 70% 90% at 0% 100%, var(--shade), transparent 70%),
		var(--bg);
}
/* Film grain, as on the site's shader. */
body::after {
	content: ''; position: absolute; inset: 0; opacity: var(--grain); mix-blend-mode: overlay; pointer-events: none;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* The seam: a hairline on a slant, lit red where it crosses the light. */
.seam { position: absolute; display: var(--seam-on, block); top: -10%; bottom: -10%; left: var(--seam); width: 1px; transform: rotate(14deg); transform-origin: center;
	background: linear-gradient(to bottom, transparent, rgba(var(--fg),.22) 20%, rgba(var(--fg),.22) 45%, var(--seam-lit) 55%, var(--seam-lit) 63%, rgba(var(--fg),.22) 72%, transparent); }
.safe { position: absolute; left: var(--sx); top: var(--sy); width: var(--sw); height: var(--sh); display: flex; }
.eyebrow { white-space: nowrap; display: inline-flex; align-items: center; gap: .9em; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: rgba(var(--fg),.78); font-size: calc(var(--u) * .32); }
.eyebrow::before { content: ''; width: 1.05em; height: .96em; background: var(--gem);
	-webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 22'%3E%3Cpath fill-rule='evenodd' d='M4.67 0.92Q5.28 0.00 6.38 0.00L17.62 0.00Q18.72 0.00 19.33 0.92L23.45 7.09Q24.00 7.92 23.35 8.68L12.78 21.09Q12.00 22.00 11.22 21.09L0.65 8.68Q0.00 7.92 0.55 7.09ZM1.6 7.92h20.8v1.3H1.6z'/%3E%3C/svg%3E") center / contain no-repeat; }
h1 { white-space: nowrap; font-family: Jakarta, sans-serif; font-weight: 600; letter-spacing: -.035em; line-height: 1.02; font-size: calc(var(--u) * 1.5); }
h1 em { font-family: Unna, serif; font-style: italic; font-weight: 400; letter-spacing: -.01em; }
.sub { color: rgba(var(--fg),.74); line-height: 1.5; font-size: calc(var(--u) * .42); max-width: 30em; }
.url { font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgba(var(--fg),.72); font-size: calc(var(--u) * .3); }
.logo { color: rgb(var(--fg)); }
.logo svg { display: block; height: calc(var(--u) * .62); width: auto; }
.logo svg > g { fill: var(--mark); }
.mark svg { display: block; width: 100%; height: auto; color: var(--mark); }
.rule { background: rgba(var(--fg),.26); }

.split { flex-direction: row; align-items: stretch; justify-content: space-between; }
.split .text { max-width: calc(var(--sw) - var(--sh) * .5 - var(--u) * 2); display: flex; flex-direction: column; justify-content: space-between; }
.split .top { display: flex; flex-direction: column; gap: calc(var(--u) * .45); }
.split .foot { display: flex; align-items: center; gap: calc(var(--u) * .5); }
.split .foot .rule { width: 1px; height: calc(var(--u) * .5); }
.split .mark { align-self: center; width: calc(var(--sh) * .5); filter: drop-shadow(0 0 calc(var(--u) * 1.2) var(--halo)); }

.strip { align-items: center; justify-content: center; gap: calc(var(--u) * .9); }
.strip .rule { width: 1px; height: calc(var(--u) * 1.6); background: rgba(var(--fg),.3); }
.strip .text { display: flex; flex-direction: column; gap: calc(var(--u) * .22); }
.strip h1 { font-size: calc(var(--u) * 1.05); white-space: nowrap; }
.strip .sub { font-size: calc(var(--u) * .34); max-width: none; white-space: nowrap; }
.strip .logo svg { height: calc(var(--u) * .78); }

.center, .stack { flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: calc(var(--u) * .55); }
.center .mark, .stack .mark { width: calc(var(--u) * 2.2); filter: drop-shadow(0 0 calc(var(--u) * .9) var(--halo)); margin-bottom: calc(var(--u) * .3); }
.center .sub, .stack .sub { max-width: 22em; }
.stack { justify-content: space-between; }
.stack .mid { display: flex; flex-direction: column; align-items: center; gap: calc(var(--u) * .55); }
.stack h1 { font-size: calc(var(--u) * 1.7); }
.stack .logo svg { height: calc(var(--u) * .8); }
`;

function page(a, lang, theme) {
	const t = copy[lang];
	const c = themes[theme];
	const vars = `--bg:${c.bg};--light:${c.light};--glow:${c.glow};--shade:${c.shade};--fg:${c.fg};--mark:${c.mark};--gem:${c.gem};--halo:${c.halo};--grain:${c.grain};--seam-lit:${theme === 'red' ? '#ffffff' : '#e62b30'};`;
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
<body style="${vars}--w:${a.w}px;--h:${a.h}px;--sx:${sx}px;--sy:${sy}px;--sw:${sw}px;--sh:${sh}px;--u:${u.toFixed(1)}px;--seam:${seam};${seam === 'none' ? '--seam-on:none' : ''}">
<span class="seam"></span><div class="safe ${a.layout}">${body}</div></body></html>`;
}

const only = process.argv.slice(2);
mkdirSync(join(out, 'preview'), { recursive: true });
const tmp = join(out, '.tmp.html');
const browser = await chromium.launch();
for (const a of assets.filter((a) => !only.length || only.includes(a.id))) {
	for (const theme of Object.keys(themes)) {
		for (const lang of ['en', 'pt']) {
			const p = await browser.newPage({ viewport: { width: a.w, height: a.h } });
			writeFileSync(tmp, page(a, lang, theme));
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
			const shot = join(out, '.shot.png');
			await p.screenshot({ path: shot });
			await p.close();
			// 24-bit JPEG (Play refuses transparency; 1 MB at most there).
			const file = join(out, `rubrion-${a.id}-${theme}-${lang}.jpg`);
			execFileSync('convert', [shot, '-alpha', 'off', '-strip', '-quality', '92', '-sampling-factor', '4:4:4', file]);
			if (a.max && statSync(file).size > a.max) execFileSync('convert', [shot, '-alpha', 'off', '-strip', '-quality', '84', '-sampling-factor', '4:4:4', file]);
			// A light preview for the brand page.
			if (lang === 'en') execFileSync('convert', [shot, '-resize', '720x720>', '-quality', '78', join(out, 'preview', `rubrion-${a.id}-${theme}.webp`)]);
			rmSync(shot);
			console.log(`${spill ? 'SPILL ' : ''}${file.slice(root.length + 1)} ${a.w}x${a.h} ${(statSync(file).size / 1024).toFixed(0)} KB`);
		}
	}
}
rmSync(tmp, { force: true });

// The icon alone, in the same themes: Google Play's developer icon (512,
// 24-bit, no alpha) and profile photos (1024). The mark sits in the middle
// 64%, inside the circle every platform crops avatars to.
const icon = { ink: ['#141413', '#f3f2ee'], spark: ['#141413', '#e62b30'], paper: ['#f3f2ee', '#e62b30'], red: ['#e62b30', '#ffffff'] };
if (!only.length || only.includes('icons')) {
	for (const [theme, [bg, fg]] of Object.entries(icon)) {
		for (const size of [512, 1024]) {
			const p = await browser.newPage({ viewport: { width: size, height: size } });
			await p.setContent(`<style>*{margin:0}body{width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center}svg{width:64%;height:auto;color:${fg}}</style>${mark}`);
			const f = join(out, `rubrion-icon-${theme}-${size}.png`);
			await p.screenshot({ path: f });
			await p.close();
			execFileSync('convert', [f, '-alpha', 'off', '-strip', '-define', 'png:color-type=2', f]);
			console.log(`${f.slice(root.length + 1)} ${(statSync(f).size / 1024).toFixed(0)} KB`);
		}
	}
}
await browser.close();
