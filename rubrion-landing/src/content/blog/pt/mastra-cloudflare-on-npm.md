---
title: "@rubrion/mastra-cloudflare 0.2: agentes Mastra nos Workers, direto do npm"
excerpt: "O que começou como um starter em junho agora é uma biblioteca: servidor de agentes compatível com a OpenAI, memória no D1 e utilitários de modelo, num só pacote npm."
date: 2026-10-29
category: engineering
minutes: 4
cover: /work/rubry-template-1600.webp
---

A maioria das stacks de agentes pressupõe um servidor ligado o dia todo, e cada projeto acaba reescrevendo a mesma cola: uma API, roteamento entre agentes, memória. O [@rubrion/mastra-cloudflare](https://www.npmjs.com/package/@rubrion/mastra-cloudflare) é essa cola, para agentes [Mastra](https://mastra.ai) nos Workers da Cloudflare.

## De starter a biblioteca

- **13 de junho**: o [repositório](https://github.com/rubrion/mastra-cloudflare) nasceu como starter: um agente Mastra nos Workers com D1, para copiar e editar.
- **20 de outubro**: cada projeto que fizemos em cima dele copiava os mesmos arquivos, então viramos uma biblioteca: **0.1.0**, publicada no npm. O [template rubry](/blog/rubry-agents-you-can-build-on) e o rubry.ai rodam nela.
- **29 de outubro**: **0.2.0**, com limites por ambiente e uso de tokens em toda resposta.
- **30 de outubro**: **0.2.1**, cabeçalhos extras em modelos remotos, para uma plataforma dizer quem está perguntando a um agente que roda em outro lugar. É assim que o [Equânime](/blog/agent-hub-and-equanime) mantém as análises de cada pessoa separadas no rubry.ai.

## O que vem no pacote

- **`createAgentServer`**: um servidor compatível com a OpenAI (`/v1/models`, `/v1/chat/completions` com streaming SSE de verdade) como handler `fetch` de um Worker, sem framework HTTP. `model: "auto"` manda cada mensagem para o agente certo, ou divide entre vários.
- **`defineAgents`**: agentes como configuração, construídos sob demanda uma vez por isolate, porque bindings e segredos só podem ser lidos dentro de uma requisição.
- **`d1Memory`**: Mastra Memory no D1, sem vector store para pagar.
- **`workersAI`**, **`openAICompatible`**, **`providerModel`**: modelos do Workers AI, de qualquer endpoint compatível com a OpenAI, ou do provedor que vem em cada requisição.
- Reexporta `Agent`, `createTool`, `z` e `RequestContext`, então o projeto só precisa deste pacote.

## Um Worker em 20 linhas

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

## Novidades da 0.2

- **`maxAgents`** (entre quantos agentes o `auto` pode dividir um pedido, padrão 3) e **`maxSteps`** (rodadas de ferramenta por resposta, padrão 5) aceitam um número ou `(env) => number`, então uma demo pública pode ser mais restrita que a produção sem outro build.
- **Uso de tokens em toda resposta**: o campo `usage` da OpenAI, somado entre o planejador, cada agente e cada rodada de ferramenta, no corpo JSON ou no último chunk do streaming. O orçamento diário do rubry.ai é calculado a partir dele.

## Links

- npm: [@rubrion/mastra-cloudflare](https://www.npmjs.com/package/@rubrion/mastra-cloudflare)
- Código (GPL-3.0): [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare)
- Referência: [docs.rubry.ai/library](https://docs.rubry.ai/library/)
- Feitos com ela: [github.com/rubrion/rubry](https://github.com/rubrion/rubry) · [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit)
- Case: [Mastra na Cloudflare](/work/mastra-cloudflare)

Criando agentes na Cloudflare e quer ajuda? [Vamos conversar](/#contact).
