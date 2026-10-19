---
title: "Welcome to the Edge: publishing without the success tax"
excerpt: "Why we built EdgeLetter: own your publication and your list, on infrastructure that costs pennies to run."
date: 2026-04-30
category: product
minutes: 3
cover: /work/edgeletter-1600.webp
---

If you are reading this, you are looking at the first post published with **EdgeLetter**, the publishing engine built by Rubrion.

For years, writers, founders and companies have had to make a frustrating choice when building an audience:

1. **The monolith (WordPress):** endlessly managing plugins, paying for bloated hosting and fighting slow pages just to publish an article.
2. **The "success tax" (Substack):** a beautiful, simple interface, in exchange for **10% of your revenue** forever and no control over your code or your domain's reputation.

We built this platform because you shouldn't have to choose between owning your platform and publishing without friction.

## Code-free, cloud-fee

The platform runs on a simple philosophy: **maximum performance, zero maintenance and total ownership.**

It runs on serverless infrastructure at the Cloudflare edge, with no server farm to look after. The result is a platform that costs pennies to run, scales with your audience and needs no DevOps knowledge from you.

### What makes it different

- **No client-side hydration:** pages are rendered on the server before they reach the browser. No spinners, no heavy scripts, just fast HTML that search engines love.
- **One source of truth:** write once. Publishing creates the web post and sends the same HTML to your subscribers' inboxes.
- **Smart delivery:** premium HTTP mail APIs for large sends, or standard SMTP, handled quietly in the background.
- **Fully white-label:** no "Powered by" badges and no forced recommendations. Your logo, your domain, your brand.

> Your audience is your most valuable asset. Renting the tools to reach it is a liability; owning the infrastructure is an advantage.

## Under the hood

- **Frontend and API:** Astro on Cloudflare.
- **Database:** Cloudflare D1, SQLite distributed at the edge.
- **Styling:** Tailwind CSS with per-tenant CSS variables.
- **Delivery:** mail APIs over REST alongside isolated SMTP services.

## Your turn

This post is a live example of what your brand's publication could look like: clean typography, reliable delivery and total control.

If you're tired of renting your audience and paying a success tax, [let's talk](/#contact).
