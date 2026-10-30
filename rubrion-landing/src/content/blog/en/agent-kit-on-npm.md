---
title: "agent-kit: an AI assistant for any Cloudflare app, on npm"
excerpt: "We extracted the assistant we built for Cerne into two open-source packages: an agent Worker with its gateway, and a React chat that streams every step."
date: 2026-10-30
category: engineering
minutes: 4
cover: /work/cerne-1600.webp
---

Putting an assistant inside a product is more than a model call. Someone has to decide who is asking, which client's data they may see, whether they're over budget, and the chat has to show what the agent is doing. We built all of that for the [Cerne](/work/cerne) assistant, then built it again for the next project. So we pulled it out.

**[agent-kit](https://github.com/rubrion/agent-kit)** is open source (MIT) and published on npm as two packages:

| Package | What it is |
|---|---|
| [`@rubrion/agent-kit-server`](https://www.npmjs.com/package/@rubrion/agent-kit-server) | `createAgentWorker`, the agent Worker, and `createAgentGateway`, Hono routes for your API |
| [`@rubrion/agent-kit-react`](https://www.npmjs.com/package/@rubrion/agent-kit-react) | `ChatBox` (floating, on every screen), `AssistantScreen` (full page with conversations), and the pieces they're made of |

## How it fits together

```
browser ──► app Worker /api/agent/*  (gateway: who is asking? may they ask?)
                 │ service binding
                 ▼
            agent Worker  (Mastra agents + tools, D1 memory, slim SSE)  ── no public route
```

The agent Worker has no public route; only your app's gateway can reach it. That's where your own rules live: identity from your login, monthly budgets, plans that unlock an agent, a client's own model key.

```ts
import { createAgentWorker } from '@rubrion/agent-kit-server';

export default createAgentWorker<Env>({
  agents: [{ id: 'main', name: 'Assistant', tagline: 'Everyday questions', tools, instructions }],
  ai: (env) => env.AI,
  memory: (env) => env.MEMORY,                       // D1; tables created on first use
  context: ({ caller }) => snapshot(caller.tenant),  // appended to the instructions on every question
  onUsage: (u, env) => logCost(env, u),              // tokens and USD per answer
});
```

```ts
import { createAgentGateway } from '@rubrion/agent-kit-server/gateway';

app.route('/api/agent', createAgentGateway({
  agent: (c) => c.env.AGENT,
  identify: (c) => ({ tenant: c.get('officeId'), person: c.get('userId'), role: c.get('role'), name: c.get('name') }),
  preflight: async (c, caller) => (await overBudget(c, caller) ? { ok: false, status: 429, reason: 'budget' } : { ok: true }),
}));
```

## What the person sees

- **Every step as it happens**: the reasoning (folded once done), one card per tool call, then the answer. A mascot, an eye whose pupil follows the cursor, shows whether the agent is thinking, using a tool or speaking.
- **Private conversations** per client and person, remembered on the server; the browser sends only the new question.
- **Slim streaming**: only what the UI draws leaves the agent Worker. Prompts and tool outputs never do.
- **Nothing runs until it's used**: the chat only calls the gateway once it opens.

The components use shadcn/ui tokens, so they match a shadcn app, and they reset their own elements on sites without Tailwind's preflight. Portuguese strings ship in the box.

## Start from the template

The repository includes a working app, `template/`, with both halves: the agent Worker and a Vite + React site behind Cloudflare Access. Copy it, edit `agents.ts` and `tools.ts`, create a D1 database, deploy. Under the hood the agents run on [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm), and the first product to ship on agent-kit outside Cerne was [Equânime](/blog/agent-hub-and-equanime).

## Links

- Source (MIT): [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit)
- npm: [@rubrion/agent-kit-server](https://www.npmjs.com/package/@rubrion/agent-kit-server) · [@rubrion/agent-kit-react](https://www.npmjs.com/package/@rubrion/agent-kit-react)
- Case study: [agent-kit](/work/agent-kit)

Want an assistant inside your product? [Let's talk](/#contact).
