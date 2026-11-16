// Portfolio: everything Rubrion has actually built, by who it was built for.
// Folder layout in ~/rubrion is the source of truth: projects at the root were
// built by Rubrion directly, `sennatech/*` through Sennatech.
//
// Public sites show a real screenshot (`image`, from
// public/work/<image>-{1600,900}.webp); private apps and internal tools show a
// drawn mockup of their kind (`mock`) instead, never real data.
import type { L } from './locale';

export type Credit = 'rubrion' | 'sennatech';
export type Service = 'platforms' | 'agents' | 'data' | 'sites' | 'products';
/** What the work is, for grouping and filtering. */
export type Kind = 'saas' | 'site' | 'library';
export type Mock = 'dashboard' | 'chat' | 'site' | 'mobile' | 'table' | 'report';

export interface Work {
	slug: string;
	name: L;
	credit: Credit;
	type: Kind;
	kind: L;
	summary: L;
	problem: L;
	built: L;
	stack: string[];
	services: Service[];
	url?: string;
	/** For a client build of one of our templates: the template's own demo. */
	demo?: string;
	image?: string;
	mock?: Mock;
	/** Public source code, for open-source work. */
	repo?: string;
	/** Shown in the home hero slider (needs `image`), in this order. */
	hero?: number;
	/** In the hero, takes the whole screen alone instead of half a pair. */
	single?: boolean;
	/** A different picture for the hero (public/work/<heroImage>-{1600,900}.webp). */
	heroImage?: string;
	/** A showcase of other entries (their slugs): its page links to them, and it stays out of the catalogue and counts. */
	parts?: string[];
	/** A video for the case page, in place of the picture (public/video/<video>-<lang>.{mp4,webp}). */
	video?: string;
}

export const credits: Record<Credit, { name: string; url?: string; note: L }> = {
	rubrion: { name: 'Rubrion', note: { en: 'Built by Rubrion', pt: 'Feito pela Rubrion' } },
	sennatech: { name: 'Sennatech', url: 'https://www.linkedin.com/company/sennatechnology', note: { en: 'Delivered with Sennatech', pt: 'Entregue com a Sennatech' } },
};

export const work: Work[] = [
	{
		slug: 'rubry',
		name: { en: 'Rubry', pt: 'Rubry' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'Your own AI agent, on your infrastructure', pt: 'Seu próprio agente de IA, na sua infraestrutura' },
		summary: {
			en: 'An AI agent for your business, on your own infrastructure: we build it in your cloud or on-premise, on the model you choose, or you build it yourself from an open-source template on Cloudflare. rubry.ai is where you test it, next to our agents, and share it on the Agent Hub.',
			pt: 'Um agente de IA para o seu negócio, na sua própria infraestrutura: construímos na sua nuvem ou on-premise, no modelo que você escolher, ou você mesmo cria a partir de um template de código aberto na Cloudflare. O rubry.ai é onde você testa, ao lado dos nossos agentes, e compartilha no Hub de agentes.',
		},
		problem: {
			en: 'Businesses want agents that know their work, without handing their data to someone else’s platform or standing up servers, and want to try them in a real chat before committing to a build.',
			pt: 'Empresas querem agentes que conheçam o trabalho delas, sem entregar seus dados à plataforma de outra empresa nem manter servidores, e querem testá-los num chat de verdade antes de investir num projeto.',
		},
		built: {
			en: 'The chat (rubry.ai) with streaming, tools, voice and per-agent sessions, guarded by Turnstile and a daily budget; the Agent Hub (rubry.ai/agents), where the community lists the agents it builds; and the rubry template: a middleware Worker (API keys, provider, settings page) and Mastra agents on Workers with automatic routing, on our open-source library @rubrion/mastra-cloudflare. Docs at docs.rubry.ai. Brad and Equânime run on their own stacks and answer in the same chat.',
			pt: 'O chat (rubry.ai), com streaming, ferramentas, voz e sessões por agente, protegido por Turnstile e orçamento diário; o Agent Hub (rubry.ai/agents), onde a comunidade lista os agentes que cria; e o template rubry: um Worker de middleware (chaves de API, provedor, página de configurações) e agentes Mastra nos Workers com roteamento automático, sobre nossa biblioteca de código aberto @rubrion/mastra-cloudflare. Documentação em docs.rubry.ai. O Brad e o Equânime rodam nas próprias bases e respondem no mesmo chat.',
		},
		stack: ['Cloudflare Workers', 'Mastra', 'Workers AI', 'D1', 'Astro'],
		services: ['agents', 'products'],
		url: 'https://rubry.ai',
		image: 'rubry',
		video: 'rubry',
		repo: 'https://github.com/rubrion/rubry',
		heroImage: 'rubry-hero',
		hero: 0,
		single: true,
	},
	{
		slug: 'agent-libraries',
		name: { en: 'Open-source agent libraries', pt: 'Bibliotecas de agentes de código aberto' },
		credit: 'rubrion',
		type: 'library',
		kind: { en: 'mastra-cloudflare and Beholder, on npm', pt: 'mastra-cloudflare e Beholder, no npm' },
		summary: {
			en: 'The libraries under our agents, open source on npm: @rubrion/mastra-cloudflare runs Mastra agents on Cloudflare Workers, and Beholder puts an assistant inside any app, from the agent Worker to the React chat.',
			pt: 'As bibliotecas por trás dos nossos agentes, de código aberto no npm: @rubrion/mastra-cloudflare roda agentes Mastra nos Workers da Cloudflare, e o Beholder coloca um assistente dentro de qualquer app, do Worker de agentes ao chat em React.',
		},
		problem: {
			en: 'Every agent we built started with the same plumbing: an API the chat clients understand, memory, routing between agents, identity, budgets and a chat UI. Rewriting it per project was slow and left each one slightly different.',
			pt: 'Todo agente que construímos começava com o mesmo encanamento: uma API que os clientes de chat entendem, memória, roteamento entre agentes, identidade, orçamento e uma interface de chat. Reescrever isso a cada projeto era lento e deixava cada um um pouco diferente.',
		},
		built: {
			en: 'Two layers. @rubrion/mastra-cloudflare (GPL-3.0) is the base: agents as config, an OpenAI-compatible server with streaming, a planner across agents, Mastra memory on D1, Workers AI or any OpenAI-compatible model, and opt-in tools to read files, browse and run background jobs. Beholder (MIT) builds on it for in-app assistants: @rubrion/beholder-server adds the agent Worker and a gateway that decides who may ask, with budgets and plans; @rubrion/beholder-react adds the floating chat, the full assistant screen and the Beholder mascot. They power rubry.ai, Cerne and Equânime.',
			pt: 'Duas camadas. @rubrion/mastra-cloudflare (GPL-3.0) é a base: agentes como configuração, um servidor compatível com a OpenAI com streaming, um planejador entre agentes, memória Mastra no D1, Workers AI ou qualquer modelo compatível com a OpenAI, e ferramentas opcionais para ler arquivos, navegar e rodar tarefas em segundo plano. O Beholder (MIT) se apoia nela para assistentes dentro do app: @rubrion/beholder-server traz o Worker de agentes e um gateway que decide quem pode perguntar, com orçamento e planos; @rubrion/beholder-react traz o chat flutuante, a tela de assistente completa e o mascote Beholder. Elas sustentam o rubry.ai, o Cerne e o Equânime.',
		},
		stack: ['Mastra', 'Cloudflare Workers', 'Workers AI', 'D1', 'Hono', 'React', 'TypeScript'],
		services: ['agents'],
		url: 'https://www.npmjs.com/org/rubrion',
		image: 'agent-libraries',
		video: 'agent-libraries',
		demo: 'https://beholder.rubrion.ai',
		heroImage: 'agent-libraries-hero',
		hero: 1,
		single: true,
		parts: ['mastra-cloudflare', 'beholder'],
	},
	{
		slug: 'advogue',
		name: { en: 'Advogue', pt: 'Advogue' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Law firm website template', pt: 'Template de site para advocacia' },
		summary: {
			en: 'A 17-page bilingual law-firm site with digit-roller counters, a page wipe and a scripted intake chat.',
			pt: 'Site bilíngue de advocacia com 17 páginas, contadores em rolo, transição de página e chat de triagem roteirizado.',
		},
		problem: {
			en: 'Small firms need a site that reads as established, ranks locally and takes enquiries without a receptionist on chat.',
			pt: 'Escritórios pequenos precisam de um site que transmita solidez, apareça nas buscas locais e receba contatos sem alguém de plantão no chat.',
		},
		built: {
			en: 'Static Astro pages on a Cloudflare Worker, English and Portuguese with device-language detection, Turnstile-protected forms and a decision-tree chat that hands pricing questions to WhatsApp.',
			pt: 'Páginas estáticas em Astro num Worker da Cloudflare, em português e inglês com detecção do idioma do dispositivo, formulários protegidos por Turnstile e um chat em árvore de decisão que passa dúvidas de preço para o WhatsApp.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'GSAP', 'Turnstile'],
		services: ['sites'],
		url: 'https://law.rubrion.ai',
		image: 'law-demo',
		hero: 4,
	},
	{
		slug: 'vet-clinic-template',
		name: { en: 'Animally', pt: 'Animally' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Veterinary clinic website template', pt: 'Template de site para clínica veterinária' },
		summary: {
			en: 'Our vet clinic template, live for Animally: a vet in São Carlos who visits exotic and household pets at home, with booking, emails and a chat.',
			pt: 'Nosso template de clínica veterinária, no ar para a Animally: uma veterinária de São Carlos que atende pets exóticos e domésticos em casa, com agendamento, e-mails e chat.',
		},
		problem: {
			en: 'Clinics need a warm, trustworthy site that books visits and answers “how much?”, without paying for a build from scratch. Animally, a new practice with no clinic yet, also needed honest positioning and no full-time assistant.',
			pt: 'Clínicas precisam de um site acolhedor e confiável que agende consultas e responda “quanto custa?”, sem pagar por um projeto do zero. A Animally, uma prática nova ainda sem clínica, também precisava de um posicionamento honesto e de dispensar uma assistente em tempo integral.',
		},
		built: {
			en: 'The template: static Astro pages on a Cloudflare Worker in English and Portuguese, a booking wizard with confirmation emails, a scripted chat with WhatsApp handoff, hand-drawn pets animated with GSAP, and every text, colour and photo swappable per clinic (demo at vet.rubrion.ai, as a fictional clinic). For Animally: its brand and copy, a booking wizard that checks the service area, and emails to the team and the client through Resend and Email Routing.',
			pt: 'O template: páginas estáticas em Astro num Worker da Cloudflare, em português e inglês, agendamento em etapas com e-mails de confirmação, chat roteirizado com passagem para o WhatsApp, pets desenhados à mão animados com GSAP, e todos os textos, cores e fotos trocáveis por clínica (demo em vet.rubrion.ai, como uma clínica fictícia). Para a Animally: marca e textos próprios, agendamento que confere a área atendida, e e-mails para a equipe e para o cliente pelo Resend e Email Routing.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Resend', 'Email Routing', 'GSAP'],
		services: ['sites'],
		url: 'https://animally.pet',
		demo: 'https://vet.rubrion.ai',
		image: 'animally',
		hero: 5,
	},
	{
		slug: 'brad',
		name: { en: 'Brad', pt: 'Brad' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'Marketing agent on WhatsApp', pt: 'Agente de marketing no WhatsApp' },
		summary: {
			en: 'A B2B marketing agent that writes briefs, social posts and on-brand banners from a WhatsApp chat.',
			pt: 'Um agente de marketing B2B que escreve briefings, posts e banners com a sua marca a partir de uma conversa no WhatsApp.',
		},
		problem: {
			en: 'Small teams skip marketing because every post starts from a blank page and a design tool.',
			pt: 'Equipes pequenas deixam o marketing de lado porque todo post começa com uma página em branco e uma ferramenta de design.',
		},
		built: {
			en: 'Specialist agents (briefing, banner, post, insights) behind an OpenAI-compatible gateway, with per-tenant brand kits and an admin to switch agents on and off.',
			pt: 'Agentes especialistas (briefing, banner, post, insights) atrás de um gateway compatível com a API da OpenAI, com kit de marca por cliente e um painel para ligar e desligar agentes.',
		},
		stack: ['TypeScript', 'OpenRouter', 'WhatsApp', 'Cloudflare'],
		services: ['agents'],
		url: 'https://brad.rubrion.ai',
		image: 'brad',
	},
	{
		slug: 'curriclean',
		name: { en: 'CurriClean', pt: 'CurriClean' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'AI job-search assistant', pt: 'Assistente de busca de emprego com IA' },
		summary: {
			en: 'Know how well your CV fits a job before you apply: a fit score, the gaps, a tailored CV and interview questions, then every application on one board.',
			pt: 'Saiba quanto o seu currículo combina com a vaga antes de se candidatar: nota de aderência, lacunas, currículo adaptado e perguntas de entrevista, e todas as candidaturas em um só quadro.',
		},
		problem: {
			en: 'Job seekers send the same CV everywhere, never learn why it misses, and lose track of where they applied.',
			pt: 'Quem procura emprego manda o mesmo currículo para todo lado, nunca sabe por que não passa e perde a conta de onde se candidatou.',
		},
		built: {
			en: 'A Hono API on Cloudflare Workers with D1 and KV, Workers AI for schema-validated analysis, PDF upload, and a Next.js 16 app on Workers with a drag-and-drop pipeline. Free credit every day, Stripe packs for more, sign-in by email or Google and GitHub, English and Portuguese. The CV is never stored, only a hash of it.',
			pt: 'Uma API em Hono no Cloudflare Workers com D1 e KV, Workers AI para a análise validada por schema, upload de PDF, e um app em Next.js 16 no Workers com quadro de candidaturas arrastável. Crédito grátis todo dia, pacotes pelo Stripe para mais, login por e-mail ou Google e GitHub, em inglês e português. O currículo nunca é guardado, só um hash dele.',
		},
		stack: ['Cloudflare Workers', 'Hono', 'D1', 'Workers AI', 'Next.js', 'Stripe'],
		services: ['agents', 'products'],
		url: 'https://curriclean.com',
		image: 'curriclean',
		repo: 'https://github.com/rubrion/curriclean',
		hero: 3,
	},
	{
		slug: 'edgeletter',
		name: { en: 'EdgeLetter', pt: 'EdgeLetter' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'Newsletter & blog platform', pt: 'Plataforma de newsletter e blog' },
		summary: {
			en: 'Write it once, send it to everyone who asked: anyone gets a blog and a newsletter at their own address, free to start.',
			pt: 'Escreva uma vez e envie para todos que pediram: qualquer pessoa ganha um blog e uma newsletter no próprio endereço, de graça para começar.',
		},
		problem: {
			en: 'Publishing platforms charge more as your list grows, and keep your readers on their domain. Writers pay a success tax.',
			pt: 'Plataformas de publicação cobram mais conforme a lista cresce e prendem os leitores no domínio delas. Quem escreve paga um imposto pelo sucesso.',
		},
		built: {
			en: 'A self-serve platform on one Cloudflare Worker (Astro SSR, D1, R2, Queues): sign-up gives <handle>.edgeletter.blog, a Markdown editor with media and an optional AI proofread, double opt-in and one-click unsubscribe, queued sending through Resend with a per-recipient ledger, open and click stats, Stripe plans, and custom domains on Pro through Cloudflare for SaaS.',
			pt: 'Uma plataforma self-service em um só Worker da Cloudflare (Astro SSR, D1, R2, Queues): o cadastro dá <handle>.edgeletter.blog, um editor em Markdown com mídia e revisão opcional por IA, confirmação dupla e descadastro em um clique, envio em fila pela Resend com registro por destinatário, estatísticas de abertura e clique, planos pelo Stripe e domínio próprio no Pro via Cloudflare for SaaS.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'D1', 'R2', 'Queues', 'Resend', 'Stripe'],
		services: ['products', 'sites'],
		url: 'https://edgeletter.blog',
		image: 'edgeletter',
		repo: 'https://github.com/rubrion/edgeletter',
		hero: 2,
	},
	{
		slug: 'rubrion-store',
		name: { en: 'Rubrion Store', pt: 'Rubrion Store' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Multi-vendor marketplace', pt: 'Marketplace multivendedor' },
		summary: {
			en: 'A marketplace where independent sellers onboard, list and sell under one brand.',
			pt: 'Um marketplace onde vendedores independentes se cadastram, anunciam e vendem sob uma só marca.',
		},
		problem: {
			en: 'Running a marketplace means vendors, payouts, catalogue and search, not just a shop.',
			pt: 'Operar um marketplace envolve vendedores, repasses, catálogo e busca, não só uma loja.',
		},
		built: {
			en: 'A Mercur (Medusa) marketplace in a Turborepo: storefront, seller panel and API, containerised, with brand identity set per deployment.',
			pt: 'Um marketplace Mercur (Medusa) em Turborepo: vitrine, painel do vendedor e API, em contêineres, com identidade de marca definida por implantação.',
		},
		stack: ['Medusa', 'Mercur', 'Next.js', 'Docker'],
		services: ['products'],
		image: 'rubrion-store',
	},
	{
		slug: 'mondesa',
		name: { en: 'MonDesa', pt: 'MonDesa' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'IoT disaster monitoring, sister org', pt: 'Monitoramento de desastres com IoT, organização irmã' },
		summary: {
			en: 'The site of our sister organisation, which builds IoT early-warning systems for natural disasters.',
			pt: 'O site da nossa organização irmã, que desenvolve sistemas de alerta antecipado com IoT para desastres naturais.',
		},
		problem: {
			en: 'Research projects and partners needed one clear home in two languages.',
			pt: 'Projetos de pesquisa e parceiros precisavam de um endereço claro, em dois idiomas.',
		},
		built: {
			en: 'A static Astro site on Cloudflare, each page mounted as its own island, bilingual.',
			pt: 'Um site estático em Astro na Cloudflare, cada página montada como uma ilha, bilíngue.',
		},
		stack: ['Astro', 'Cloudflare'],
		services: ['sites'],
		url: 'https://mondesa.com.br',
		image: 'mondesa',
		hero: 8,
		repo: 'https://github.com/MonDesa/mondesa-web-client',
	},
	{
		slug: 'cerne',
		name: { en: 'Cerne', pt: 'Cerne' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'Project intelligence for architecture firms', pt: 'Inteligência de projeto para escritórios de arquitetura' },
		summary: {
			en: 'Method, checklists and review for architecture projects, moved off a single SQLite file onto the edge.',
			pt: 'Método, conferência e revisão de projetos de arquitetura, migrados de um arquivo SQLite para a borda.',
		},
		problem: {
			en: 'A legacy app on one database file couldn’t serve a growing team or be tested safely.',
			pt: 'Um app legado num único arquivo de banco não atendia uma equipe crescente nem podia ser testado com segurança.',
		},
		built: {
			en: 'A Hono API on Workers with D1 and Drizzle migrations, an Astro host for the existing UI, an import tool for the old data and Playwright end-to-end tests.',
			pt: 'Uma API em Hono nos Workers com D1 e migrações Drizzle, um host em Astro para a interface existente, uma ferramenta de importação dos dados antigos e testes ponta a ponta com Playwright.',
		},
		stack: ['Hono', 'D1', 'Drizzle', 'Astro', 'Playwright'],
		services: ['platforms', 'data'],
		url: 'https://cerne.arq.br',
		image: 'cerne',
		hero: 9,
	},
	{
		slug: 'equanime',
		name: { en: 'Equânime', pt: 'Equânime' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'Conflict checks for academic boards', pt: 'Análise de conflito em bancas acadêmicas' },
		summary: {
			en: 'Register a board, collect each member’s Lattes CV, apply the conflict rules and download a PDF report.',
			pt: 'Cadastre a banca, colete o currículo Lattes de cada membro, aplique as regras de conflito e baixe um relatório em PDF.',
		},
		problem: {
			en: 'Checking every pair of examiners for co-authorship and shared affiliations was hours of manual cross-reading.',
			pt: 'Conferir cada par de avaliadores em busca de coautoria e vínculos em comum eram horas de leitura cruzada manual.',
		},
		built: {
			en: 'A Worker API driving a durable Workflow: Lattes XML uploads or a private collector, deterministic rules and PDF reports in R2; a web app with Google sign-in; and the Análise de Banca agent, built on our Beholder and mastra-cloudflare libraries, which runs an analysis from a chat on rubry.ai or OpenWebUI and keeps each person’s analyses apart.',
			pt: 'Uma API em Worker que dispara um Workflow durável: envio do XML do Lattes ou um coletor privado, regras determinísticas e relatórios em PDF no R2; um app web com login Google; e o agente Análise de Banca, feito com nossas bibliotecas Beholder e mastra-cloudflare, que roda uma análise a partir de um chat no rubry.ai ou no OpenWebUI e mantém as análises de cada pessoa separadas.',
		},
		stack: ['Cloudflare Workflows', 'D1', 'R2', 'Beholder', 'Mastra'],
		services: ['data', 'agents'],
		url: 'https://equanime.rubrion.ai',
		image: 'equanime',
		repo: 'https://github.com/rubenszinho/equanime',
	},
	{
		slug: 'mastra-cloudflare',
		name: { en: 'Mastra on Cloudflare', pt: 'Mastra na Cloudflare' },
		credit: 'rubrion',
		type: 'library',
		kind: { en: 'Open-source agent library, on npm', pt: 'Biblioteca de agentes de código aberto, no npm' },
		summary: {
			en: 'Mastra agents on Cloudflare Workers without the boilerplate: an OpenAI-compatible agent server with routing, memory in D1 and model helpers. npm install @rubrion/mastra-cloudflare; it powers rubry.ai and the rubry template.',
			pt: 'Agentes Mastra nos Workers da Cloudflare sem código repetitivo: um servidor de agentes compatível com a OpenAI, com roteamento, memória no D1 e utilitários de modelo. npm install @rubrion/mastra-cloudflare; é a base do rubry.ai e do template rubry.',
		},
		problem: {
			en: 'Most agent stacks assume a server running all day, and every project rewrites the same API, routing and memory glue.',
			pt: 'A maioria das stacks de agentes pressupõe um servidor ligado o dia todo, e cada projeto reescreve a mesma cola de API, roteamento e memória.',
		},
		built: {
			en: 'One package: agents as config, an OpenAI-compatible server with real streaming and a planner that splits a request across agents, Mastra memory on D1, and Workers AI or any OpenAI-compatible model, with extra headers for remote agents. Since 0.2, how many agents a request may use and how many tool rounds a reply may take are set per environment, and every reply carries its token usage. Since 0.3, opt-in tools let an agent read long files (PDF, Word, Excel, CSV) a piece at a time, browse the web and run background jobs, and each agent lists its capabilities in /v1/models. GPL-3.0, published on npm as @rubrion/mastra-cloudflare; reference at docs.rubry.ai/library.',
			pt: 'Um pacote: agentes como configuração, um servidor compatível com a OpenAI com streaming de verdade e um planejador que divide um pedido entre agentes, memória Mastra no D1, e Workers AI ou qualquer modelo compatível com a OpenAI, com cabeçalhos extras para agentes remotos. Desde a 0.2, quantos agentes um pedido pode usar e quantas rodadas de ferramentas uma resposta pode fazer são definidos por ambiente, e toda resposta traz o uso de tokens. Desde a 0.3, ferramentas opcionais deixam um agente ler arquivos longos (PDF, Word, Excel, CSV) aos poucos, navegar na web e rodar tarefas em segundo plano, e cada agente lista suas capacidades em /v1/models. GPL-3.0, publicado no npm como @rubrion/mastra-cloudflare; referência em docs.rubry.ai/library.',
		},
		stack: ['Mastra', 'Cloudflare Workers', 'Workers AI', 'D1', 'TypeScript'],
		services: ['agents'],
		url: 'https://www.npmjs.com/package/@rubrion/mastra-cloudflare',
		repo: 'https://github.com/rubrion/mastra-cloudflare',
		image: 'mastra-cloudflare',
		video: 'agent-libraries',
	},
	{
		slug: 'beholder',
		name: { en: 'Beholder', pt: 'Beholder' },
		credit: 'rubrion',
		type: 'library',
		kind: { en: 'Open-source agent kit for in-app assistants, on npm', pt: 'Kit de agentes de código aberto para assistentes dentro do app, no npm' },
		summary: {
			en: 'An AI assistant you can drop into any Cloudflare app: an agent Worker, a gateway for your API and a React chat that streams the agent’s thinking, tool calls and answer.',
			pt: 'Um assistente de IA para colocar em qualquer app na Cloudflare: um Worker de agentes, um gateway para a sua API e um chat em React que mostra o raciocínio, as chamadas de ferramenta e a resposta do agente em tempo real.',
		},
		problem: {
			en: 'Putting an assistant inside a product means identity, tenants, budgets and a chat UI, and every app was rebuilding them around its agents.',
			pt: 'Colocar um assistente dentro de um produto envolve identidade, clientes, orçamento e uma interface de chat, e cada app reconstruía tudo isso em volta dos seus agentes.',
		},
		built: {
			en: 'Extracted from the Cerne assistant into two npm packages: @rubrion/beholder-server (createAgentWorker: Mastra agents with D1 memory, per-tenant context and token cost; createAgentGateway: Hono routes that decide who may ask, with budgets, plans and bring-your-own-key) and @rubrion/beholder-react (a floating ChatBox and a full AssistantScreen, with file attachments the agent reads through the gateway, and the Beholder mascot whose eyes follow the cursor), plus a deployable template behind Cloudflare Access. MIT.',
			pt: 'Extraído do assistente do Cerne em dois pacotes no npm: @rubrion/beholder-server (createAgentWorker: agentes Mastra com memória no D1, contexto por cliente e custo em tokens; createAgentGateway: rotas Hono que decidem quem pode perguntar, com orçamento, planos e chave própria) e @rubrion/beholder-react (um ChatBox flutuante e uma AssistantScreen de página inteira, com anexos que o agente lê pelo gateway, e o mascote Beholder, cujos olhos seguem o cursor), mais um template pronto para publicar atrás do Cloudflare Access. MIT.',
		},
		stack: ['Mastra', 'Cloudflare Workers', 'D1', 'Hono', 'React'],
		services: ['agents'],
		url: 'https://www.npmjs.com/package/@rubrion/beholder-server',
		repo: 'https://github.com/rubrion/beholder',
		image: 'beholder',
		video: 'agent-libraries',
		demo: 'https://beholder.rubrion.ai',
	},
	{
		slug: 'rubry-template',
		name: { en: 'Rubry template', pt: 'Template Rubry' },
		credit: 'rubrion',
		type: 'library',
		kind: { en: 'Open-source multi-agent template', pt: 'Template multiagente de código aberto' },
		summary: {
			en: 'Your own multi-agent assistant on Workers and Mastra: write agents and tools in TypeScript and get an OpenAI-compatible endpoint for rubry.ai, Open WebUI or your app.',
			pt: 'Seu próprio assistente multiagente nos Workers e no Mastra: escreva agentes e ferramentas em TypeScript e tenha um endpoint compatível com a OpenAI para o rubry.ai, o Open WebUI ou o seu app.',
		},
		problem: {
			en: 'An agent product needs API keys, provider settings, routing and memory before it gives its first useful answer.',
			pt: 'Um produto de agentes precisa de chaves de API, configuração de provedor, roteamento e memória antes de dar a primeira resposta útil.',
		},
		built: {
			en: 'Two Workers: a dependency-free middleware (API keys, the provider with its key encrypted, agents on or off, a settings page) and Mastra agents on @rubrion/mastra-cloudflare, with "auto" routing across up to three agents and memory in D1. Runs on Workers AI with no model keys, or any OpenAI-compatible provider. A public example runs at example.rubry.ai. GPL-3.0.',
			pt: 'Dois Workers: um middleware sem dependências (chaves de API, o provedor com a chave criptografada, agentes ligados ou desligados, uma página de configurações) e agentes Mastra sobre @rubrion/mastra-cloudflare, com roteamento "auto" entre até três agentes e memória no D1. Roda no Workers AI sem chaves de modelo, ou em qualquer provedor compatível com a OpenAI. Um exemplo público roda em example.rubry.ai. GPL-3.0.',
		},
		stack: ['Mastra', 'Cloudflare Workers', 'Workers AI', 'D1', 'TypeScript'],
		services: ['agents'],
		url: 'https://docs.rubry.ai',
		repo: 'https://github.com/rubrion/rubry',
		image: 'rubry-template',
	},
	{
		slug: 'avilink',
		name: { en: 'Avilink', pt: 'Avilink' },
		credit: 'sennatech',
		type: 'saas',
		kind: { en: 'Farm management, mobile + web', pt: 'Gestão de granjas, mobile + web' },
		summary: {
			en: 'Field teams log flocks, vaccines and medication on their phones, online or off.',
			pt: 'Equipes de campo registram lotes, vacinas e medicações no celular, com ou sem internet.',
		},
		problem: {
			en: 'Paper records on the farm reached the office days late, with inconsistent catalogues.',
			pt: 'Registros em papel chegavam ao escritório dias depois, com catálogos inconsistentes.',
		},
		built: {
			en: 'A Flutter app with a reactive offline cache, a curated vaccine and medication catalogue, a backend and a web admin on Cloudflare.',
			pt: 'Um app Flutter com cache offline reativo, catálogo curado de vacinas e medicamentos, backend e painel web na Cloudflare.',
		},
		stack: ['Flutter', 'BLoC', 'Cloudflare', 'Codemagic'],
		services: ['platforms'],
		url: 'https://app.avilink.com.br',
		image: 'avilink',
	},
	{
		slug: 'bccc',
		name: { en: 'BCCC', pt: 'BCCC' },
		credit: 'sennatech',
		type: 'site',
		kind: { en: 'Brazil-Canada Chamber of Commerce', pt: 'Câmara de Comércio Brasil-Canadá' },
		summary: {
			en: 'Events, membership, news and resources for the Brazil-Canada Chamber of Commerce, in English, Portuguese and French.',
			pt: 'Eventos, associação, notícias e materiais da Câmara de Comércio Brasil-Canadá, em inglês, português e francês.',
		},
		problem: {
			en: 'An outdated site in one language couldn’t serve members across two countries.',
			pt: 'Um site antigo em um só idioma não atendia associados de dois países.',
		},
		built: {
			en: 'A static Astro site on a Worker with three languages, events, news and resources managed by the team in Sanity CMS, content migrated from the old site, and structured data.',
			pt: 'Um site estático em Astro num Worker com três idiomas, eventos, notícias e materiais geridos pela equipe no Sanity CMS, conteúdo migrado do site antigo e dados estruturados.',
		},
		stack: ['Astro', 'Sanity CMS', 'Cloudflare Workers'],
		services: ['sites'],
		url: 'https://bccc.rubrion.ai',
		image: 'bccc',
		hero: 10,
	},
	{
		slug: 'mvm-war-room',
		name: { en: 'MVM War Room', pt: 'MVM War Room' },
		credit: 'sennatech',
		type: 'saas',
		kind: { en: 'TikTok Shop KPI war room', pt: 'Sala de guerra de KPIs do TikTok Shop' },
		summary: {
			en: 'Sales, orders and performance from TikTok Shop, synced and shown live for the team.',
			pt: 'Vendas, pedidos e desempenho do TikTok Shop, sincronizados e exibidos ao vivo para a equipe.',
		},
		problem: {
			en: 'During live sales the team was refreshing a marketplace back office instead of reacting.',
			pt: 'Durante as vendas ao vivo a equipe ficava atualizando o painel do marketplace em vez de reagir.',
		},
		built: {
			en: 'Sync jobs from the shop API into Supabase, a FastAPI service and a dashboard with team chat alongside.',
			pt: 'Rotinas de sincronização da API da loja para o Supabase, um serviço FastAPI e um painel com chat da equipe ao lado.',
		},
		stack: ['Supabase', 'FastAPI', 'React', 'pnpm'],
		services: ['platforms', 'data'],
		url: 'https://mvmwarroom.io',
		image: 'mvm-war-room',
	},
	{
		slug: 'bioexame',
		name: { en: 'Bioexame', pt: 'Bioexame' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Clinical laboratory, São João del-Rei', pt: 'Laboratório clínico, São João del-Rei' },
		summary: {
			en: 'Site and patient portal for a clinical lab: guided onboarding and secure online results.',
			pt: 'Site e portal do paciente de um laboratório clínico: cadastro guiado e resultados on-line com segurança.',
		},
		problem: {
			en: 'Patients had to collect their results in person, and the lab’s site said little about its services.',
			pt: 'Os pacientes precisavam buscar os resultados no balcão, e o site do laboratório dizia pouco sobre os serviços.',
		},
		built: {
			en: 'A clean homepage for the brand, services and contacts; guided onboarding so patients register and start using the portal; and a results area where they view and download their lab results securely.',
			pt: 'Uma página inicial clara com marca, serviços e contatos; um cadastro guiado para o paciente começar a usar o portal; e uma área de resultados onde ele vê e baixa os exames com segurança.',
		},
		stack: ['Web portal', 'Patient onboarding', 'Secure results'],
		services: ['platforms', 'sites'],
		url: 'https://exame.bio',
		image: 'bioexame',
	},
	{
		slug: 'acme-business-template',
		name: { en: 'Acme Advisory', pt: 'Acme Advisory' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Consultancy website template', pt: 'Template de site para consultorias' },
		summary: {
			en: 'A bilingual one-page business site with a product page, shown as the fictional Acme Advisory.',
			pt: 'Um site empresarial bilíngue de uma página com página de produto, apresentado como a fictícia Acme Advisory.',
		},
		problem: {
			en: 'Consultancies need a credible, fast site with lead capture, without starting from a blank page each time.',
			pt: 'Consultorias precisam de um site rápido e confiável que capte contatos, sem começar do zero a cada vez.',
		},
		built: {
			en: 'An Astro site on a Cloudflare Worker in English and Portuguese, with a wave page transition, a HubSpot-ready lead form with Turnstile, a newsletter signup and generated placeholder art, so every string, colour and image can be swapped per client.',
			pt: 'Um site em Astro num Worker da Cloudflare, em português e inglês, com transição de página em onda, formulário de contato pronto para HubSpot com Turnstile, newsletter e arte gerada, para trocar textos, cores e imagens por cliente.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'HubSpot', 'Turnstile'],
		services: ['sites'],
		url: 'https://acme.rubrion.ai',
		image: 'acme',
	},
];

export const kinds: Record<Kind, L> = {
	saas: { en: 'SaaS', pt: 'SaaS' },
	site: { en: 'Websites & portals', pt: 'Sites e portais' },
	library: { en: 'Libraries', pt: 'Bibliotecas' },
};

/** The home page's examples per service: Rubrion's own work only (see ownWork). */
export const serviceCases: Record<Service, string[]> = {
	platforms: ['cerne', 'curriclean', 'bioexame'],
	agents: ['rubry', 'brad', 'beholder'],
	data: ['equanime', 'cerne'],
	sites: ['advogue', 'vet-clinic-template', 'mondesa'],
	products: ['edgeletter', 'rubrion-store'],
};

/** The catalogue and the counts: everything but showcases of other entries. */
export const catalogWork = work.filter((w) => !w.parts);
/** The home page shows only Rubrion's own work: consulting builds stay in /work. */
export const ownWork = work.filter((w) => w.credit === 'rubrion');
/** The home hero and grid: Rubrion's featured work, in hero order. */
export const heroWork = ownWork.filter((w) => w.hero !== undefined && w.image).sort((a, b) => a.hero! - b.hero!);
