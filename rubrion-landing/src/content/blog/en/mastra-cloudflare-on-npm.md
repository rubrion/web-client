---
title: "@rubrion/mastra-cloudflare 0.2: Mastra agents on Workers, from npm"
excerpt: "What began as a starter in June is now a library: an OpenAI-compatible agent server, D1 memory and model helpers, in one npm package."
date: 2026-10-29
category: engineering
minutes: 4
cover: /work/rubry-template-1600.webp
---

Most agent stacks assume a server running all day, and every project ends up rewriting the same glue: an API, routing between agents, memory. [@rubrion/mastra-cloudflare](https://www.npmjs.com/package/@rubrion/mastra-cloudflare) is that glue, for [Mastra](https://mastra.ai) agents on Cloudflare Workers.

## From starter to library

- **June 13**: the [repository](https://github.com/rubrion/mastra-cloudflare) started as a starter: a Mastra agent on Workers with D1, to copy and edit.
- **October 20**: every project we built on it copied the same files, so we turned it into a library: **0.1.0**, published on npm. The [rubry template](/blog/rubry-agents-you-can-build-on) and rubry.ai run on it.
- **October 29**: **0.2.0**, with per-environment limits and token usage in every reply.
- **October 30**: **0.2.1**, extra headers on remote models, so a platform can pass who's asking to an agent that runs elsewhere. That's how [Equânime](/blog/agent-hub-and-equanime) keeps each person's analyses apart on rubry.ai.

## What's in the package

- **`createAgentServer`**: an OpenAI-compatible server (`/v1/models`, `/v1/chat/completions` with real SSE streaming) as a Worker `fetch` handler, with no HTTP framework. `model: "auto"` routes each message to the right agent, or splits it across several.
- **`defineAgents`**: agents as plain config, built lazily once per isolate, because bindings and secrets can only be read inside a request.
- **`d1Memory`**: Mastra Memory on D1, with no vector store to pay for.
- **`workersAI`**, **`openAICompatible`**, **`providerModel`**: models from Workers AI, any OpenAI-compatible endpoint, or the provider each request carries.
- Re-exports `Agent`, `createTool`, `z` and `RequestContext`, so a project needs only this package.

## A Worker in 20 lines

```bash
npm install @rubrion/mastra-cloudflare
```

```ts
import { env } from 'cloudflare:workers';
import { createAgentServer, createTool, d1Memory, defineAgents, z } from '@rubrion/mastra-cloudflare';

const time = createTool({
	id: 'current_time',
	description: 'The current date and time.',
	inputSchema: z.object({}),
	execute: async () => ({ now: new Date().toISOString() }),
});

const agents = defineAgents(
	[
		{ id: 'writer', name: 'Writer', description: 'Writes and edits text.', instructions: 'Write what is asked, briefly.' },
		{ id: 'helper', name: 'Helper', description: 'General questions; knows the time.', instructions: 'Be useful.', tools: { current_time: time } },
	],
	{ memory: d1Memory(() => env.MEMORY) },
);

export default createAgentServer({
	agents,
	apiKey: (e: Env) => e.API_KEY,
	provider: (e: Env) => ({ baseURL: 'https://api.openai.com/v1', apiKey: e.OPENAI_API_KEY, model: 'gpt-5-mini' }),
});
```

## New in 0.2

- **`maxAgents`** (how many agents `auto` may split a request across, default 3) and **`maxSteps`** (tool rounds per reply, default 5) take a number or `(env) => number`, so a public demo can be stricter than production without a second build.
- **Token usage in every reply**: OpenAI's `usage` field, summed over the planner, every agent and every tool round, in the JSON body or on the final streamed chunk. rubry.ai's daily budget is computed from it.

## Links

- npm: [@rubrion/mastra-cloudflare](https://www.npmjs.com/package/@rubrion/mastra-cloudflare)
- Source (GPL-3.0): [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare)
- Reference: [docs.rubry.ai/library](https://docs.rubry.ai/library/)
- Built on it: [github.com/rubrion/rubry](https://github.com/rubrion/rubry) · [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit)
- Case study: [Mastra on Cloudflare](/work/mastra-cloudflare)

Building agents on Cloudflare and want a hand? [Let's talk](/#contact).
