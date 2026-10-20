// Portfolio: everything Rubrion has actually built, by who it was built for.
// Folder layout in ~/rubrion is the source of truth: projects at the root were
// built by Rubrion directly, `mt2data/*` (plus Dexplan) as consulting through
// MT2 Data, `sennatech/*` through Sennatech.
//
// Public sites show a real screenshot (`image`, from
// public/work/<image>-{1600,900}.webp); private apps and internal tools show a
// drawn mockup of their kind (`mock`) instead, never real data.
import type { L } from './locale';

export type Credit = 'rubrion' | 'mt2' | 'sennatech';
export type Service = 'platforms' | 'agents' | 'data' | 'sites' | 'products';
/** What the work is, for grouping and filtering. */
export type Kind = 'saas' | 'platform' | 'site' | 'library';
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
	image?: string;
	mock?: Mock;
	/** Public source code, for open-source work. */
	repo?: string;
	/** Shown in the home hero slider (needs `image`), in this order. */
	hero?: number;
}

export const credits: Record<Credit, { name: string; url?: string; note: L }> = {
	rubrion: { name: 'Rubrion', note: { en: 'Built by Rubrion', pt: 'Feito pela Rubrion' } },
	mt2: { name: 'MT2 Data', url: 'https://mt2data.cloud', note: { en: 'Consulting via MT2 Data', pt: 'Consultoria via MT2 Data' } },
	sennatech: { name: 'Sennatech', url: 'https://www.linkedin.com/company/sennatechnology', note: { en: 'Delivered with Sennatech', pt: 'Entregue com a Sennatech' } },
};

export const work: Work[] = [
	{
		slug: 'advogue',
		name: { en: 'Advogue', pt: 'Advogue' },
		credit: 'rubrion',
		type: 'platform',
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
		hero: 1,
	},
	{
		slug: 'vet-clinic-template',
		name: { en: 'Vet clinic template', pt: 'Template de clínica veterinária' },
		credit: 'rubrion',
		type: 'platform',
		kind: { en: 'Veterinary clinic website template', pt: 'Template de site para clínica veterinária' },
		summary: {
			en: 'A full bilingual clinic site with a vet team, a 24/7 strip, booking, a shop and a style guide, shown as a fictional clinic.',
			pt: 'Um site bilíngue completo de clínica, com equipe de veterinários, faixa 24h, agendamento, loja e guia de estilo, apresentado como uma clínica fictícia.',
		},
		problem: {
			en: 'Clinics need a warm, trustworthy site that books visits and answers common questions, without paying for a custom build from scratch.',
			pt: 'Clínicas precisam de um site acolhedor e confiável que agende consultas e responda dúvidas comuns, sem pagar por um projeto do zero.',
		},
		built: {
			en: 'Static Astro pages on a Cloudflare Worker in English and Portuguese, a booking wizard with confirmation emails, a scripted chat with WhatsApp handoff, hand-drawn pets animated with GSAP, and every text, colour and photo swappable per clinic.',
			pt: 'Páginas estáticas em Astro num Worker da Cloudflare, em português e inglês, agendamento em etapas com e-mails de confirmação, chat roteirizado com passagem para o WhatsApp, pets desenhados à mão animados com GSAP, e todos os textos, cores e fotos trocáveis por clínica.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Resend', 'GSAP'],
		services: ['sites'],
		url: 'https://vet.rubrion.ai',
		image: 'vet-demo',
		hero: 2,
	},
	{
		slug: 'mt2-data-site',
		name: { en: 'MT2 Data website', pt: 'Site da MT2 Data' },
		credit: 'mt2',
		type: 'site',
		kind: { en: 'Data-science consultancy site', pt: 'Site de consultoria em ciência de dados' },
		summary: {
			en: 'The consultancy’s bilingual site, with an insights section its team publishes to directly.',
			pt: 'O site bilíngue da consultoria, com uma seção de artigos que a própria equipe publica.',
		},
		problem: {
			en: 'Case studies and articles lived in decks; the site had to carry them and be easy for consultants to update.',
			pt: 'Cases e artigos viviam em apresentações; o site precisava carregá-los e ser fácil de atualizar pelos consultores.',
		},
		built: {
			en: 'An Astro site on a Cloudflare Worker, mostly prerendered, with server-rendered insight pages and an admin backed by D1.',
			pt: 'Um site em Astro num Worker da Cloudflare, quase todo pré-renderizado, com páginas de artigos renderizadas no servidor e um painel apoiado em D1.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'D1'],
		services: ['sites'],
		url: 'https://mt2data.cloud',
		image: 'mt2data',
		hero: 3,
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
		hero: 4,
	},
	{
		slug: 'curriclean',
		name: { en: 'CurriClean', pt: 'CurriClean' },
		credit: 'rubrion',
		type: 'saas',
		kind: { en: 'CV scoring, SaaS', pt: 'Avaliação de currículos, SaaS' },
		summary: {
			en: 'Paste a role and a CV, get a structured fit score with matched skills, gaps and a recommendation.',
			pt: 'Cole a vaga e o currículo e receba uma nota de aderência com competências, lacunas e uma recomendação.',
		},
		problem: {
			en: 'Screening dozens of CVs by hand is slow, and inconsistent from one reviewer to the next.',
			pt: 'Triar dezenas de currículos à mão é lento, e muda de um avaliador para outro.',
		},
		built: {
			en: 'A FastAPI service with schema-validated LLM output stored as JSONB, a Next.js dashboard to track applications, and CV text that is never persisted.',
			pt: 'Um serviço em FastAPI com saída de LLM validada por schema e guardada em JSONB, um painel em Next.js para acompanhar candidaturas, e o texto do currículo nunca é armazenado.',
		},
		stack: ['FastAPI', 'Next.js', 'PostgreSQL', 'instructor'],
		services: ['agents', 'platforms'],
		url: 'https://curriclean.rubrion.ai',
		image: 'curriclean',
		hero: 5,
		repo: 'https://github.com/rubrion/curriclean',
	},
	{
		slug: 'edgeletter',
		name: { en: 'EdgeLetter', pt: 'EdgeLetter' },
		credit: 'rubrion',
		type: 'platform',
		kind: { en: 'Newsletter & blog platform', pt: 'Plataforma de newsletter e blog' },
		summary: {
			en: 'Blog, editor, media and newsletter dispatch for a whole publication on one Worker.',
			pt: 'Blog, editor, mídia e envio de newsletter de uma publicação inteira em um só Worker.',
		},
		problem: {
			en: 'Publishing platforms charge more as your list grows. Writers pay a success tax.',
			pt: 'Plataformas de publicação cobram mais conforme a lista cresce. Quem escreve paga um imposto pelo sucesso.',
		},
		built: {
			en: 'Astro SSR with D1 and R2: public blog, admin editor, uploader and double opt-in newsletter, one deployment per white-label tenant.',
			pt: 'Astro SSR com D1 e R2: blog público, editor, envio de mídia e newsletter com confirmação dupla, uma implantação por cliente white-label.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'D1', 'R2'],
		services: ['products', 'sites'],
		url: 'https://edgeletter.rubrion.ai',
		image: 'edgeletter',
		hero: 6,
		repo: 'https://github.com/rubrion/edgeletter',
	},
	{
		slug: 'rubrion-store',
		name: { en: 'Rubrion Store', pt: 'Rubrion Store' },
		credit: 'rubrion',
		type: 'platform',
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
		hero: 7,
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
			en: 'A Worker API driving a durable Workflow: a private collector, deterministic rules, reports in R2, Access-protected, with an assistant in OpenWebUI that calls the API.',
			pt: 'Uma API em Worker que dispara um Workflow durável: coletor privado, regras determinísticas, relatórios no R2, protegida por Access, com um assistente no OpenWebUI que chama a API.',
		},
		stack: ['Cloudflare Workflows', 'D1', 'R2', 'OpenWebUI'],
		services: ['data', 'agents'],
		mock: 'report',
		repo: 'https://github.com/rubenszinho/equanime',
	},
	{
		slug: 'mastra-cloudflare',
		name: { en: 'Mastra on Cloudflare', pt: 'Mastra na Cloudflare' },
		credit: 'rubrion',
		type: 'library',
		kind: { en: 'AI agent starter on Workers', pt: 'Base de agente de IA nos Workers' },
		summary: {
			en: 'Our base for light agents: Mastra on a plain Worker, with conversation memory in D1.',
			pt: 'Nossa base para agentes leves: Mastra num Worker comum, com memória de conversa no D1.',
		},
		problem: {
			en: 'Most agent stacks assume a server running all day. Small agents shouldn’t need one.',
			pt: 'A maioria das stacks de agentes pressupõe um servidor ligado o dia todo. Agentes pequenos não deveriam precisar.',
		},
		built: {
			en: 'Mastra mounted on Hono, strongly consistent memory in D1, an example tool, and a model router that points at any OpenAI-compatible endpoint.',
			pt: 'Mastra montado em Hono, memória consistente no D1, uma ferramenta de exemplo e um roteador de modelos que aceita qualquer endpoint compatível com a OpenAI.',
		},
		stack: ['Mastra', 'Hono', 'D1', 'Cloudflare Workers'],
		services: ['agents'],
		mock: 'chat',
	},
	{
		slug: 'colmeia',
		name: { en: 'Colmeia', pt: 'Colmeia' },
		credit: 'mt2',
		type: 'saas',
		kind: { en: 'Farm decisions over WhatsApp', pt: 'Decisões do campo pelo WhatsApp' },
		summary: {
			en: 'Specialised agents answer machine health, slaughter timing and crop forecasting questions in plain language.',
			pt: 'Agentes especializados respondem sobre saúde de máquinas, ponto de abate e previsão de safra em linguagem natural.',
		},
		problem: {
			en: 'Farm data sat in half a dozen platforms; managers wanted answers, not dashboards.',
			pt: 'Os dados da fazenda estavam espalhados em várias plataformas; os gestores queriam respostas, não painéis.',
		},
		built: {
			en: 'One agent per decision domain behind a WhatsApp sender, with guardrails, shared memory and Grafana monitoring.',
			pt: 'Um agente por domínio de decisão atrás de um disparador de WhatsApp, com guardrails, memória compartilhada e monitoramento no Grafana.',
		},
		stack: ['Python', 'LLM agents', 'WhatsApp', 'Grafana'],
		services: ['agents', 'data'],
		url: 'https://colmeia.agr.br',
		image: 'colmeia',
	},
	{
		slug: 'dexplan',
		name: { en: 'Dexplan', pt: 'Dexplan' },
		credit: 'mt2',
		type: 'platform',
		kind: { en: 'Production planning optimiser', pt: 'Otimizador de planejamento de produção' },
		summary: {
			en: 'Allocates orders to production days with a MILP solver, respecting capacity and seller quotas.',
			pt: 'Distribui pedidos entre dias de produção com um solver MILP, respeitando capacidade e cotas de vendedores.',
		},
		problem: {
			en: 'Planning by spreadsheet left capacity idle on some days and orders late on others.',
			pt: 'Planejar em planilha deixava capacidade ociosa em alguns dias e pedidos atrasados em outros.',
		},
		built: {
			en: 'An optimisation service with split orders and soft or hard quotas, plus a web shell where planners review and track the plan.',
			pt: 'Um serviço de otimização com pedidos fracionados e cotas flexíveis ou rígidas, mais uma interface web para os planejadores revisarem e acompanharem o plano.',
		},
		stack: ['Python', 'MILP', 'React', 'pnpm monorepo'],
		services: ['data', 'platforms'],
		mock: 'table',
	},
	{
		slug: 'mt2-allocation',
		name: { en: 'MT2 Allocation', pt: 'MT2 Allocation' },
		credit: 'mt2',
		type: 'platform',
		kind: { en: 'Team allocation hub', pt: 'Central de alocação de equipe' },
		summary: {
			en: 'Who is on which project, at what capacity, with every project’s resources in one place.',
			pt: 'Quem está em qual projeto, com qual dedicação, e os recursos de cada projeto num só lugar.',
		},
		problem: {
			en: 'Allocation across billable projects and demos lived in chats and people’s memory.',
			pt: 'A alocação entre projetos faturáveis e demonstrações vivia em conversas e na memória.',
		},
		built: {
			en: 'An Astro app on a Worker behind Cloudflare Access, tracking people, capacity and project links.',
			pt: 'Um app em Astro num Worker atrás do Cloudflare Access, com pessoas, dedicação e links de cada projeto.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Cloudflare Access'],
		services: ['platforms', 'data'],
		mock: 'dashboard',
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
		slug: 'animally',
		name: { en: 'Animally', pt: 'Animally' },
		credit: 'rubrion',
		type: 'site',
		kind: { en: 'Home vet care, São Carlos', pt: 'Veterinária a domicílio, São Carlos' },
		summary: {
			en: 'Site, booking and email flow for a vet who visits exotic and household pets at home.',
			pt: 'Site, agendamento e e-mails para uma veterinária que atende pets exóticos e domésticos em casa.',
		},
		problem: {
			en: 'A new practice with no clinic yet needed bookings, honest positioning and a way to answer “how much?” without a full-time assistant.',
			pt: 'Uma prática nova, ainda sem clínica, precisava de agendamentos, um posicionamento honesto e um jeito de responder “quanto custa?” sem uma assistente em tempo integral.',
		},
		built: {
			en: 'A bilingual static site with a booking wizard that checks the service area, sends the team and the client confirmation emails, a scripted chat with WhatsApp handoff, and hand-drawn pets animated with GSAP.',
			pt: 'Um site estático bilíngue com agendamento em etapas que confere a área atendida, envia e-mails de confirmação para a equipe e para o cliente, um chat roteirizado com passagem para o WhatsApp e pets desenhados à mão animados com GSAP.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Resend', 'Email Routing', 'GSAP'],
		services: ['sites'],
		url: 'https://animally.pet',
		image: 'animally',
	},
	{
		slug: 'lms',
		name: { en: 'LMS', pt: 'LMS' },
		credit: 'rubrion',
		type: 'platform',
		kind: { en: 'LGPD training for a clinical lab', pt: 'Treinamento em LGPD para laboratório clínico' },
		summary: {
			en: 'A training platform that takes a lab’s staff through data protection practice, step by step.',
			pt: 'Uma plataforma de treinamento que conduz a equipe de um laboratório pelas práticas de proteção de dados, passo a passo.',
		},
		problem: {
			en: 'Complying with Brazil’s data protection law (LGPD) meant every employee had to be trained, and the lab had to show it.',
			pt: 'Cumprir a LGPD exigia treinar todos os funcionários, e o laboratório precisava comprovar isso.',
		},
		built: {
			en: 'A customised learning platform with structured internal courses on the lab’s own data handling, progress per employee and a record of completion for compliance.',
			pt: 'Uma plataforma de aprendizagem sob medida, com cursos internos estruturados sobre o tratamento de dados do próprio laboratório, progresso por funcionário e registro de conclusão para a conformidade.',
		},
		stack: ['LMS', 'Course builder', 'Progress tracking', 'LGPD'],
		services: ['products', 'platforms'],
		mock: 'dashboard',
	},
	{
		slug: 'acme-business-template',
		name: { en: 'Business site template', pt: 'Template de site empresarial' },
		credit: 'rubrion',
		type: 'platform',
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
	platform: { en: 'White-label & tools', pt: 'White-label e ferramentas' },
	site: { en: 'Websites & portals', pt: 'Sites e portais' },
	library: { en: 'Libraries', pt: 'Bibliotecas' },
};

/** Cases shown under each service, in this order. */
export const serviceCases: Record<Service, string[]> = {
	platforms: ['cerne', 'avilink', 'mvm-war-room', 'bioexame'],
	agents: ['brad', 'colmeia', 'curriclean'],
	data: ['dexplan', 'equanime', 'mt2-allocation'],
	sites: ['bccc', 'advogue', 'animally'],
	products: ['edgeletter', 'rubrion-store', 'lms'],
};

export const heroWork = work.filter((w) => w.hero && w.image).sort((a, b) => a.hero! - b.hero!);
