# rubrion-landing

Rubrion's marketing site. One codebase builds two sites:

| Build | Language | Domain | Worker |
| :-- | :-- | :-- | :-- |
| `npm run build:en` | English | rubrion.ai | `rubrion-landing` (`wrangler.jsonc`) |
| `npm run build:pt` | Portuguese | rubrion.com.br | `rubrion-landing-pt` (`wrangler.pt.jsonc`) |

`SITE_LOCALE` (set by those scripts) picks the language, the `site` URL and the
Worker config. Each output is a complete static site in one language with
canonical + hreflang pointing at its twin, so search engines index each domain
on its own.

## Where things live

| What | Where |
| :-- | :-- |
| All copy, both languages side by side | `src/data/site.ts` |
| Portfolio (cases, credits, hero order) | `src/data/work.ts` |
| Locale, domains, support email | `src/data/locale.ts` |
| SEO + JSON-LD | `src/data/seo.ts`, `src/components/Seo.astro` |
| Blog posts | `src/content/blog/{en,pt}/<slug>.md` (same slug in both) |
| Brand tokens + shared styles | `src/styles/global.css` |
| Motion (GSAP, Lenis): reveals, split headings, rollers | `src/scripts/motion.ts` |
| Diagonal page transition (`a[data-diagonal]` only) | `src/scripts/diagonal.ts` |

### Portfolio

`work.ts` lists everything we've shipped, credited to Rubrion, MT2 Data or
Sennatech (mirroring `~/rubrion`, `~/rubrion/mt2data`, `~/rubrion/sennatech`).
Client and internal work is **anonymised**: no client names or data, a drawn
`mock` instead of a screenshot. Only public sites and our own products get an
`image` (`public/work/<image>-{1600,900}.webp`, WebP, ~25–55 KB). Items with
`hero` appear in the home slider, in that order.

## Commands

Node 24 (`.tool-versions`).

| Command | Action |
| :-- | :-- |
| `npm run dev` / `npm run dev:pt` | Dev server in English / Portuguese |
| `npm run check` | Type-check |
| `npm run build:en` / `build:pt` | Build one site into `dist/` |
| `npm run preview` | Serve the last build |
| `node tools/verify.mjs <origin> [--reduced]` | Every page at 1440/390 + flows |
| `npm run deploy:en` / `deploy:pt` / `deploy` | Build and deploy one or both |

Both builds write to `dist/`, so build and deploy one language at a time (the
deploy scripts do).
