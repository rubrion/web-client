---
title: "The Agent Hub, and Equânime joins Rubry"
excerpt: "rubry.ai/agents lists the agents we run and the ones the community builds. The first new arrival: Equânime, which checks academic boards for conflicts of interest."
date: 2026-10-30
category: product
minutes: 3
cover: /work/rubry-hero-1600.webp
---

Ten days after [opening rubry.ai](/blog/rubry-agents-you-can-build-on), two things changed: there's now a place to find agents, and there's a new one in the chat.

## The Agent Hub

[rubry.ai/agents](https://rubry.ai/agents) lists two kinds of agents:

- **In the chat**: the agents Rubrion runs on rubry.ai (Rubry, Rubry Think, Brad and now Equânime), ready to talk to with nothing to set up.
- **From the community**: agents people built on the [rubry template](https://github.com/rubrion/rubry), each with its own page and, if its author shares them, its source code and a public endpoint.

Search, tags and filters stay in a sidebar beside the list, and every filtered list has its own address you can share. From the chat's agent menu, **Agent Hub** shows the same list: if an agent has a public endpoint, **Wire it** connects it to your chat with its address filled in; otherwise **View code** opens its repository so you can run your own copy.

Built an agent on the template? With a free account you can **publish it** in three steps. Paste its GitHub, GitLab or Codeberg repository and the form fills in the name, summary and tags it finds there.

## Equânime, in the chat

[Equânime](/work/equanime) checks academic boards and selection committees for conflicts of interest between a candidate and the examiners: co-authorship, shared affiliations, advising. Done by hand, that's hours of cross-reading Lattes CVs.

On rubry.ai, its **Análise de Banca** agent runs an analysis from a conversation: tell it the candidate and each examiner, with their Lattes CVs and roles, and it starts the analysis, follows it to the end and walks you through the result, with the PDF report. It also lists the analyses you've run before. The rules are deterministic, so the agent explains the result; it doesn't make it up.

Equânime runs on its own stack, not on Rubry's: a Worker API driving a durable Workflow, reports in R2, and an agent built on our two open-source libraries, [@rubrion/agent-kit-server](/blog/agent-kit-on-npm) and [@rubrion/mastra-cloudflare](/blog/mastra-cloudflare-on-npm). rubry.ai talks to it like any remote agent, over an OpenAI-compatible endpoint, and passes a stable pseudonym of each visitor (never their account) so everyone's analyses stay apart. Its full web app is at [equanime.rubrion.ai](https://equanime.rubrion.ai).

## Links

- Agent Hub: [rubry.ai/agents](https://rubry.ai/agents) · [docs](https://docs.rubry.ai)
- Equânime source: [github.com/rubenszinho/equanime](https://github.com/rubenszinho/equanime)
- Template: [github.com/rubrion/rubry](https://github.com/rubrion/rubry)
- Libraries: [github.com/rubrion/agent-kit](https://github.com/rubrion/agent-kit) · [github.com/rubrion/mastra-cloudflare](https://github.com/rubrion/mastra-cloudflare)

Have a process that would work better as an agent? [Tell us about it](/#contact).
