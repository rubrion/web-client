# rubrion-web-client

Marketing-site monorepo for Rubrion.

## Layout

| Folder | Stack | Domain |
|--------|-------|--------|
| `rubrion-landing/` | Astro 6 SSG + React islands + Tailwind v4 | **rubrion.ai** (English) |
| `rubrion-landing-pt/` | identical clone, translated copy | **rubrion.com.br** (Portuguese — BR) |

Both projects use the `@astrojs/cloudflare` adapter targeting `output: 'static'`,
share the same Turnstile site key, and post to the same support-email-worker
(lives in a sibling repo at `../support-email-worker/`).

A small navbar widget on each site links to its counterpart so visitors can
toggle locales (EN ↔ PT). The selection is persistent only by URL — no
geo-redirect, no cookies.

## Local dev

```bash
cd rubrion-landing       && npm install && npm run dev   # :4321
cd rubrion-landing-pt    && npm install && npm run dev   # :4321 (run separately)
```

## Build & deploy

```bash
cd rubrion-landing       && npm run deploy   # → rubrion-landing worker
cd rubrion-landing-pt    && npm run deploy   # → rubrion-landing-pt worker
```

Both worker bindings carry the same vars in `wrangler.jsonc` (Turnstile site
key + `VITE_SUPPORT_WORKER_URL`). Cloudflare custom domains attach to the
respective workers in the dashboard.

## Translation strategy

Hard fork. The two trees share no code at runtime — every translatable string
lives in either `src/data/*.ts` or in the `.astro` / `.tsx` files of each
project, and the translations are hand-tuned. When the EN copy changes, port
the structural delta to PT manually. See `EMAIL_INTEGRATION.md` for the
infrastructure side (DNS, MailChannels, Turnstile allow-list).

## Email + Turnstile

See [`EMAIL_INTEGRATION.md`](./EMAIL_INTEGRATION.md). The Cloudflare Worker
that processes contact-form submissions is in `../support-email-worker/`.
