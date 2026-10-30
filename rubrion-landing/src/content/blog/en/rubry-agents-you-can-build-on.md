---
title: "Rubry: a chat with our agents, and the template to build yours"
excerpt: "rubry.ai is live: talk to our AI agents for free, then build your own on an open-source template that runs on Cloudflare Workers."
date: 2026-10-20
category: product
minutes: 4
cover: /work/rubry-1600.webp
---

Today we're opening **[rubry.ai](https://rubry.ai)**, the platform our AI agents run on, together with the open-source template we use to build them.

It comes in two parts:

1. **The chat.** A free chat with our agents at [rubry.ai/chat](https://rubry.ai/chat), with streaming answers, visible thinking, tool calls, voice and a separate memory per agent. It's guarded by Turnstile and a daily budget, so it stays free without being abused.
2. **The template.** [rubry](https://github.com/rubrion/rubry) is a public GitHub repository you clone to get your own multi-agent assistant on Cloudflare Workers and [Mastra](https://mastra.ai). Write your agents and tools in TypeScript and you get an OpenAI-compatible endpoint you can use from rubry.ai, Open WebUI or your own app.

## Why a template, and not just a chat

Teams want agents that know their business, but they don't want to stand up servers to try one. With the template, your agent runs on **your** Cloudflare account and **your** model, outside our limits: connect it to rubry.ai with an endpoint and a key and it shows up in the same chat as ours.

## How the template is built

```
client (rubry.ai, Open WebUI, your app)
   │  Authorization: Bearer rk_…        OpenAI-compatible /v1
   ▼
middleware/  Worker   API keys · provider (key encrypted) · agents on/off · settings page
   │  service binding
   ▼
agents/      Worker   your Mastra agents and tools · "auto" routing · D1 memory
```

- **`agents/`**: each agent is a few lines of config; tools go next to them. Ask for `model: "auto"` and a planner sends each message to the agent whose description fits, or splits it across up to three.
- **`middleware/`**: the only public Worker, with no dependencies. It checks API keys, keeps the provider settings in D1 and serves a settings page.
- It runs on **Workers AI out of the box, with no model keys**. Switch to OpenAI, OpenRouter or any OpenAI-compatible provider from the settings page.

The agents Worker has a single dependency: our library [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm), also open source.

## Try it in five minutes

```bash
git clone https://github.com/rubrion/rubry my-agents && cd my-agents
npm install
cp middleware/.dev.vars.example middleware/.dev.vars   # fill ADMIN_TOKEN and SECRET_KEY
npm run dev                                            # http://localhost:8787
```

Don't want to install anything yet? Take a key at [example.rubry.ai](https://example.rubry.ai), a public copy of the template, and connect it on [rubry.ai/chat](https://rubry.ai/chat). The full guides, with screenshots, are at [docs.rubry.ai](https://docs.rubry.ai).

## Do it yourself, or with us

Everything above is free and open. If you'd rather have an agent built, connected to your data and run under your brand, [talk to us](/#contact).

## Links

- Chat: [rubry.ai](https://rubry.ai)
- Template (GPL-3.0): [github.com/rubrion/rubry](https://github.com/rubrion/rubry)
- Library: [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare) · [npm](https://www.npmjs.com/package/@rubrion/mastra-cloudflare)
- Docs: [docs.rubry.ai](https://docs.rubry.ai)
- Case studies: [Rubry](/work/rubry) · [Rubry template](/work/rubry-template)
