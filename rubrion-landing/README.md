# rubrion-landing

Rubrion's marketing site. One codebase, one Worker (`rubrion-landing`), two
sites:

| Domain | Language | Served from |
| :-- | :-- | :-- |
| rubrion.ai, www.rubrion.ai | English | `dist/` |
| rubrion.com.br, www.rubrion.com.br | Portuguese | `dist/__pt/` |

`npm run build` builds English (`SITE_LOCALE=en`), then Portuguese
(`SITE_LOCALE=pt`, into `dist-pt/`), and `tools/merge-pt.mjs` folds the
Portuguese pages under `dist/__pt/` (bundles and images are shared).
`worker/index.ts` answers rubrion.com.br from `/__pt` and everything else from
the root; `/__pt` itself is never reachable. Each domain is a complete site in
one language with canonical + hreflang pointing at its twin, so search engines
index them separately.

## Where things live

| What | Where |
| :-- | :-- |
| All copy, both languages side by side | `src/data/site.ts` |
| Portfolio (cases, credits, hero order) | `src/data/work.ts` |
| Locale, domains, support email | `src/data/locale.ts` |
| SEO + JSON-LD | `src/data/seo.ts`, `src/components/Seo.astro` |
| Blog posts | `src/content/blog/{en,pt}/<slug>.md` (same slug in both) |
| Brand tokens (paper/ink/hairline, red spark) + shared styles | `src/styles/global.css`, documented live at `/brand` |
| Type: Plus Jakarta Sans (display), Lato (body), Unna italic (highlighted word) | `@fontsource/*`, preloaded in `Layout.astro` |
| Hero slider (WebGL seam + distortion dissolve, CSS fallback) | `src/components/Hero.astro`, `src/scripts/hero-gl.ts` |
| Geometric ambient backgrounds: triangular lattice (`canvas[data-ambient]`) | `src/scripts/ambient.ts`, `src/scripts/gl.ts` |
| Scripted chat (no AI; WhatsApp/email handoff) | `src/components/ChatWidget.astro`, `src/scripts/chat.ts` |
| Motion (GSAP, Lenis): reveals, split headings, rollers | `src/scripts/motion.ts` |
| Diagonal page transition (`a[data-diagonal]` only) | `src/scripts/diagonal.ts` |

WebGL is skipped on software renderers (no GPU) and with reduced motion the
hero swaps instantly; both fall back to plain images and CSS. Add `?gl=force`
to a URL to keep WebGL on anyway (reviewing the effects in headless Chrome).

### Portfolio

`work.ts` lists everything we've shipped, credited to Rubrion, MT2 Data or
Sennatech (mirroring `~/rubrion`, `~/rubrion/mt2data`, `~/rubrion/sennatech`).
Public sites and our own products get a screenshot (`image`,
`public/work/<image>-{1600,900}.webp`, WebP, ~25–55 KB); private apps and
internal tools get a drawn `mock` of their kind instead, never real data. Items with
`hero` appear in the home slider, in that order.

## Commands

Node 24 (`.tool-versions`).

| Command | Action |
| :-- | :-- |
| `npm run dev` / `npm run dev:pt` | Dev server in English / Portuguese |
| `npm run check` | Type-check |
| `npm run build` | Both languages, merged into `dist/` |
| `npm run preview` | `wrangler dev` on the merged build (add `--host rubrion.com.br` for Portuguese) |
| `node tools/verify.mjs <origin> [--reduced]` | Every page at 1440/390 + flows |
| `npm run deploy` | Build and deploy both domains |

Node: `.node-version` (24) for CI; locally mise reads an untracked
`.tool-versions`.
