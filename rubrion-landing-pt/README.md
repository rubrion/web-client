# Rubrion Landing — "Building Descent"

New landing page experiment for rubrion.ai. The page is a vertical **building**:
scrolling down descends through floors, each backed by full-viewport artwork
with a scrubbed parallax effect (GSAP ScrollTrigger + Lenis smooth scroll).

| Floor | Artwork | Content |
| ----- | ------------------- | ------------------------------ |
| 3     | command room / city | Hero |
| 2     | server room | Who We Serve + Projects |
| 1     | lobby | Newsletter + Ready to Get Started |

Branding follows `../branding.html` (Fira Sans / Fira Code, accent `#FF0040`,
dark tokens). No React — vanilla scripts only. No loading screen.

## Commands

```sh
npm run dev      # dev server at localhost:4321
npm run build    # prebuild (floor image optimization) + astro build
npm run preview  # serve the production build via wrangler
```

## Floor artwork / parallax layers

- Source art lives in `src/assets/floors/*.png`.
- `scripts/optimize-floors.mjs` (runs as `prebuild`) emits
  `public/floors/<name>-{1280,1920,2560}.webp`. Run it manually after adding
  art so the dev server picks the files up. Generated files are gitignored.
- Layers are declared per floor in `src/pages/index.astro` via
  `<FloorStage layers={[{ name: 'floor3', speed: 0.6, eager: true }]} />`.
  To add a foreground layer: drop the PNG in `src/assets/floors/`, re-run the
  script, append `{ name: 'floor3-fg', speed: 1 }` to the array — higher speed
  = closer to camera. `src/lib/parallax.ts` wires `data-speed` automatically.
- Touch devices and `prefers-reduced-motion` fall back to static backgrounds
  (`body.reduced-motion`).

> Why pre-optimized images instead of `astro:assets`? astro 6.4.4 +
> @astrojs/cloudflare 13.6.1 has a build bug: prerendered image generation
> looks in `dist/_astro` while assets are emitted to `dist/client/_astro`
> (ENOENT). Revisit when the adapter is fixed.

## Env vars

Copy `.env` values (see `../rubrion-landing/.env.production`):

```
VITE_SUPPORT_WORKER_URL=   # contact form endpoint (support-email-worker)
VITE_TURNSTILE_SITE_KEY=   # Cloudflare Turnstile public key
```

Turnstile throws error 110200 on localhost — the sitekey is domain-bound;
forms verify only on the production domain.
