# rubrion-web-client

Marketing site for Rubrion, a software studio for SMBs: CRMs, light AI agents,
data mining, SEO, chatbots, newsletters & blogs, and marketplaces, built on
lean infrastructure at a fair price. Sister org [Mondesa](https://mondesa.org)
handles IoT for energy systems.

## Layout

| Folder | Stack | Domains |
|--------|-------|---------|
| `rubrion-landing/` | Astro 7 static + Tailwind v4 + GSAP/Lenis (monochrome + red "spark" brand) | **rubrion.ai** (EN) and **rubrion.com.br** (PT) |

One codebase, one Worker (`rubrion-landing`): `npm run build` produces the
English site and the Portuguese one, and the Worker serves rubrion.ai in
English and rubrion.com.br in Portuguese. All copy lives in
`rubrion-landing/src/data/site.ts` as `{ en, pt }`, so a change is made once.
The contact form posts to the support-email-worker (`../support-email-worker/`),
the newsletter subscribes through [EdgeLetter](https://edgeletter.rubrion.ai)
(`/api/subscribe`), and Turnstile protects both. The blog is in the repo
(`src/content/blog`). See [`rubrion-landing/README.md`](./rubrion-landing/README.md).

## Local dev, build & deploy

```bash
cd rubrion-landing && npm install
npm run dev          # English  (:4321)
npm run dev:pt       # Portuguese
npm run deploy       # build + deploy both domains (one Worker)
```

Non-secret build-time vars (`VITE_SUPPORT_WORKER_URL`, Turnstile site key — the
key allows both domains) are in `.env.production`.

## Email + Turnstile

See [`EMAIL_INTEGRATION.md`](./EMAIL_INTEGRATION.md). The Cloudflare Worker
that processes contact-form submissions is in `../support-email-worker/`.
