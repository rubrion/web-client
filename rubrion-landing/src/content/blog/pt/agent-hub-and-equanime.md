---
title: "O Agent Hub, e o Equânime chega ao Rubry"
excerpt: "O rubry.ai/agents lista os agentes que operamos e os que a comunidade cria. O primeiro a chegar: o Equânime, que analisa conflitos de interesses em bancas acadêmicas."
date: 2026-10-30
category: product
minutes: 3
cover: /work/rubry-hero-1600.webp
---

Dez dias depois de [abrirmos o rubry.ai](/blog/rubry-agents-you-can-build-on), duas coisas mudaram: agora existe um lugar para encontrar agentes, e há um novo no chat.

## O Agent Hub

O [rubry.ai/agents](https://rubry.ai/agents) lista dois tipos de agentes:

- **No chat**: os agentes que a Rubrion opera no rubry.ai (Rubry, Rubry Think, Brad e agora o Equânime), prontos para conversar, sem nada para configurar.
- **Da comunidade**: agentes que as pessoas criaram com o [template rubry](https://github.com/rubrion/rubry), cada um com sua página e, se o autor compartilhar, o código e um endpoint público.

Busca, tags e filtros ficam numa barra lateral ao lado da lista, e cada lista filtrada tem seu próprio endereço para compartilhar. No menu de agentes do chat, **Hub de agentes** mostra a mesma lista: se o agente tem endpoint público, **Ligar** conecta ele ao seu chat com o endereço preenchido; senão, **Ver código** abre o repositório para você rodar sua própria cópia.

Criou um agente com o template? Com uma conta gratuita você **publica** em três passos. Cole o repositório no GitHub, GitLab ou Codeberg e o formulário preenche o nome, o resumo e as tags que encontrar.

## O Equânime, no chat

O [Equânime](/work/equanime) analisa bancas acadêmicas e de concursos em busca de conflitos de interesses entre o candidato e os avaliadores: coautoria, vínculos institucionais, orientação. À mão, isso são horas de leitura cruzada de currículos Lattes.

No rubry.ai, o agente **Análise de Banca** faz a análise a partir de uma conversa: informe o candidato e cada avaliador, com o Lattes e o papel de cada um, e ele inicia a análise, acompanha até o fim e explica o resultado, com o relatório em PDF. Ele também lista as análises que você já fez. As regras são determinísticas: o agente explica o resultado, não o inventa.

O Equânime roda na própria base, não na do Rubry: uma API em Worker que dispara um Workflow durável, relatórios no R2, e um agente feito com nossas duas bibliotecas de código aberto, [@rubrion/agent-kit-server](/blog/agent-kit-on-npm) e [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm). O rubry.ai conversa com ele como com qualquer agente remoto, por um endpoint compatível com a OpenAI, e envia um pseudônimo estável de cada visitante (nunca a conta) para que as análises de cada um fiquem separadas. O app web completo está em [equanime.rubrion.ai](https://equanime.rubrion.ai).

## Links

- Agent Hub: [rubry.ai/agents](https://rubry.ai/agents) · [documentação](https://docs.rubry.ai)
- Código do Equânime: [github.com/rubenszinho/equanime](https://github.com/rubenszinho/equanime)
- Template: [github.com/rubrion/rubry](https://github.com/rubrion/rubry)
- Bibliotecas: [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit) · [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare)

Tem um processo que funcionaria melhor como agente? [Conte pra gente](/#contact).
