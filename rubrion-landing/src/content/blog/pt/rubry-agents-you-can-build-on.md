---
title: "Rubry: um chat com nossos agentes, e o template para criar os seus"
excerpt: "O rubry.ai está no ar: converse de graça com nossos agentes de IA e crie os seus num template de código aberto que roda nos Workers da Cloudflare."
date: 2026-10-20
category: product
minutes: 4
cover: /work/rubry-1600.webp
---

Hoje abrimos o **[rubry.ai](https://rubry.ai)**, a plataforma onde nossos agentes de IA rodam, junto com o template de código aberto que usamos para criá-los.

São duas partes:

1. **O chat.** Um chat gratuito com nossos agentes em [rubry.ai/chat](https://rubry.ai/chat), com respostas em streaming, raciocínio visível, chamadas de ferramenta, voz e memória separada por agente. Ele é protegido por Turnstile e por um orçamento diário, para continuar gratuito sem ser abusado.
2. **O template.** O [rubry](https://github.com/rubrion/rubry) é um repositório público no GitHub que você clona para ter seu próprio assistente multiagente nos Workers da Cloudflare e no [Mastra](https://mastra.ai). Escreva seus agentes e ferramentas em TypeScript e ganhe um endpoint compatível com a OpenAI para usar no rubry.ai, no Open WebUI ou no seu app.

## Por que um template, e não só um chat

Equipes querem agentes que conheçam o negócio delas, mas não querem manter servidores para testar um. Com o template, seu agente roda na **sua** conta da Cloudflare e no **seu** modelo, fora dos nossos limites: conecte-o ao rubry.ai com um endpoint e uma chave e ele aparece no mesmo chat que os nossos.

## Como o template é feito

```
cliente (rubry.ai, Open WebUI, seu app)
   │  Authorization: Bearer rk_…        /v1 compatível com a OpenAI
   ▼
middleware/  Worker   chaves de API · provedor (chave criptografada) · agentes on/off · configurações
   │  service binding
   ▼
agents/      Worker   seus agentes e ferramentas Mastra · roteamento "auto" · memória no D1
```

- **`agents/`**: cada agente é algumas linhas de configuração; as ferramentas ficam ao lado. Peça `model: "auto"` e um planejador manda cada mensagem para o agente cuja descrição combina, ou divide entre até três.
- **`middleware/`**: o único Worker público, sem dependências. Confere as chaves de API, guarda as configurações do provedor no D1 e serve uma página de configurações.
- Roda no **Workers AI sem nenhuma chave de modelo**. Troque para OpenAI, OpenRouter ou qualquer provedor compatível com a OpenAI na página de configurações.

O Worker de agentes tem uma única dependência: nossa biblioteca [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm), também de código aberto.

## Teste em cinco minutos

```bash
git clone https://github.com/rubrion/rubry meus-agentes && cd meus-agentes
npm install
cp middleware/.dev.vars.example middleware/.dev.vars   # preencha ADMIN_TOKEN e SECRET_KEY
npm run dev                                            # http://localhost:8787
```

Ainda não quer instalar nada? Pegue uma chave em [example.rubry.ai](https://example.rubry.ai), uma cópia pública do template, e conecte-a em [rubry.ai/chat](https://rubry.ai/chat). Os guias completos, com imagens, estão em [docs.rubry.ai](https://docs.rubry.ai).

## Faça você mesmo, ou com a gente

Tudo acima é gratuito e aberto. Se prefere ter um agente construído, conectado aos seus dados e operado com a sua marca, [fale com a gente](/#contact).

## Links

- Chat: [rubry.ai](https://rubry.ai)
- Template (GPL-3.0): [github.com/rubrion/rubry](https://github.com/rubrion/rubry)
- Biblioteca: [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare) · [npm](https://www.npmjs.com/package/@rubrion/mastra-cloudflare)
- Documentação: [docs.rubry.ai](https://docs.rubry.ai)
- Cases: [Rubry](/work/rubry) · [Template Rubry](/work/rubry-template)
