---
title: "agent-kit: um assistente de IA para qualquer app na Cloudflare, no npm"
excerpt: "Extraímos o assistente que fizemos para o Cerne em dois pacotes de código aberto: um Worker de agentes com seu gateway, e um chat em React que mostra cada passo."
date: 2026-10-30
category: engineering
minutes: 4
cover: /work/cerne-1600.webp
---

Colocar um assistente dentro de um produto é mais do que chamar um modelo. Alguém precisa decidir quem está perguntando, quais dados de qual cliente essa pessoa pode ver, se o orçamento estourou, e o chat precisa mostrar o que o agente está fazendo. Fizemos tudo isso para o assistente do [Cerne](/work/cerne), e depois fizemos de novo no projeto seguinte. Então tiramos de lá.

O **[agent-kit](https://github.com/rubrion/agent-kit)** é de código aberto (MIT) e está no npm em dois pacotes:

| Pacote | O que é |
|---|---|
| [`@rubrion/agent-kit-server`](https://www.npmjs.com/package/@rubrion/agent-kit-server) | `createAgentWorker`, o Worker de agentes, e `createAgentGateway`, rotas Hono para a sua API |
| [`@rubrion/agent-kit-react`](https://www.npmjs.com/package/@rubrion/agent-kit-react) | `ChatBox` (flutuante, em todas as telas), `AssistantScreen` (página inteira com conversas) e as peças de que são feitos |

## Como as partes se encaixam

```
navegador ──► Worker do app /api/agent/*  (gateway: quem pergunta? pode perguntar?)
                 │ service binding
                 ▼
            Worker de agentes  (agentes Mastra + ferramentas, memória no D1, SSE enxuto)  ── sem rota pública
```

O Worker de agentes não tem rota pública; só o gateway do seu app chega nele. É lá que ficam as suas regras: identidade vinda do seu login, orçamento mensal, planos que liberam um agente, a chave de modelo do próprio cliente.

```ts
import { createAgentWorker } from '@rubrion/agent-kit-server';

export default createAgentWorker<Env>({
  agents: [{ id: 'main', name: 'Assistente', tagline: 'Dúvidas do dia a dia', tools, instructions }],
  ai: (env) => env.AI,
  memory: (env) => env.MEMORY,                       // D1; tabelas criadas no primeiro uso
  context: ({ caller }) => snapshot(caller.tenant),  // somado às instruções a cada pergunta
  onUsage: (u, env) => logCost(env, u),              // tokens e USD por resposta
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

## O que a pessoa vê

- **Cada passo na hora**: o raciocínio (recolhido ao terminar), um card por chamada de ferramenta e então a resposta. Um mascote, um olho cuja pupila segue o cursor, mostra se o agente está pensando, usando uma ferramenta ou respondendo.
- **Conversas privadas** por cliente e pessoa, lembradas no servidor; o navegador envia só a nova pergunta.
- **Streaming enxuto**: só sai do Worker de agentes o que a interface desenha. Prompts e saídas de ferramentas nunca saem.
- **Nada roda antes do uso**: o chat só chama o gateway quando é aberto.

Os componentes usam os tokens do shadcn/ui, então combinam com um app shadcn, e resetam os próprios elementos em sites sem o preflight do Tailwind. Os textos em português já vêm prontos.

## Comece pelo template

O repositório traz um app funcionando, `template/`, com as duas metades: o Worker de agentes e um site Vite + React atrás do Cloudflare Access. Copie, edite `agents.ts` e `tools.ts`, crie um banco D1 e publique. Por baixo, os agentes rodam no [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm), e o primeiro produto a usar o agent-kit fora do Cerne foi o [Equânime](/blog/agent-hub-and-equanime).

## Links

- Código (MIT): [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit)
- npm: [@rubrion/agent-kit-server](https://www.npmjs.com/package/@rubrion/agent-kit-server) · [@rubrion/agent-kit-react](https://www.npmjs.com/package/@rubrion/agent-kit-react)
- Case: [agent-kit](/work/agent-kit)

Quer um assistente dentro do seu produto? [Vamos conversar](/#contact).
