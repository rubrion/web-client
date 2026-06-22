# rubrion-web-client

Marketing-site monorepo for Rubrion — IT consulting for SMBs. Whitelabel
products ([EdgeLetter](https://github.com/rubrion/edgeletter) newsletter,
[Rubrion Store](https://github.com/rubrion/store) marketplace) and bespoke
software. Sister org [Mondesa](https://mondesa.org) handles IoT for energy
systems.

## Layout

| Folder | Stack | Domain |
|--------|-------|--------|
| `rubrion-landing/` | Astro 6 SSG + Tailwind v4 (monochrome + red "spark" brand) | **rubrion.ai** (English) |
| `rubrion-landing-pt/` | hard-fork clone, translated copy | **rubrion.com.br** (Portuguese — BR) |

Both trees use the `@astrojs/cloudflare` adapter targeting `output: 'static'`,
load Cloudflare Turnstile on the contact + newsletter forms, post contact
submissions to the support-email-worker (sibling repo `../support-email-worker/`),
and subscribe the newsletter via [EdgeLetter](https://edgeletter.rubrion.ai)
(`/api/subscribe`). The blog page embeds the EdgeLetter blog as a self-resizing
iframe. A navbar `LanguageSwitcher` links each site to its counterpart (EN ↔ PT).

### Locale reuse

The SEO/GEO layer (`Seo.astro`, `seo.ts`, `robots.txt.ts`, `Layout.astro`) is
locale-driven: it reads everything locale-specific from `src/data/locale.ts`.
The PT tree differs from EN only in `locale.ts`, `astro.config` (`site`),
`wrangler.jsonc` (`name` + KV id), `package.json` (`name`), and the translated
strings in the `.astro` / `seo.ts` files. When EN copy changes, port the
structural delta to PT by hand.

## Local dev

```bash
cd rubrion-landing    && npm install && npm run dev   # :4321 (EN)
cd rubrion-landing-pt && npm install && npm run dev   # :4321 (PT, run separately)
```

## Build & deploy

```bash
cd rubrion-landing    && npm run deploy   # → rubrion-landing worker (rubrion.ai)
cd rubrion-landing-pt && npm run deploy   # → rubrion-landing-pt worker (rubrion.com.br)
```

Each worker carries the non-secret build-time vars in `.env.production`
(`VITE_SUPPORT_WORKER_URL` + Turnstile site key — the key allows both domains),
baked into the client bundle by CF Workers Builds in CI. The custom domains
attach to their respective workers in the dashboard.

## Email + Turnstile

See [`EMAIL_INTEGRATION.md`](./EMAIL_INTEGRATION.md). The Cloudflare Worker
that processes contact-form submissions is in `../support-email-worker/`.
