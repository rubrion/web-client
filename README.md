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

EN-only for now. The previous Portuguese clone (`rubrion-landing-pt/` →
rubrion.com.br) has been retired; rubrion.com.br is parked / redirected in the
Cloudflare dashboard until a PT version of the new template is built.

The site uses the `@astrojs/cloudflare` adapter targeting `output: 'static'`,
loads Cloudflare Turnstile on the contact + newsletter forms, posts contact
submissions to the support-email-worker (sibling repo `../support-email-worker/`),
and subscribes the newsletter via [EdgeLetter](https://edgeletter.rubrion.ai)
(`/api/subscribe`). The blog page embeds the EdgeLetter blog as a self-resizing
iframe.

## Local dev

```bash
cd rubrion-landing && npm install && npm run dev   # :4321
```

## Build & deploy

```bash
cd rubrion-landing && npm run deploy   # → rubrion-landing worker
```

The worker carries the non-secret build-time vars in `.env.production`
(`VITE_SUPPORT_WORKER_URL` + Turnstile site key), baked into the client bundle
by CF Workers Builds in CI. The rubrion.ai custom domain attaches to the
`rubrion-landing` worker in the dashboard.

## Email + Turnstile

See [`EMAIL_INTEGRATION.md`](./EMAIL_INTEGRATION.md). The Cloudflare Worker
that processes contact-form submissions is in `../support-email-worker/`.
