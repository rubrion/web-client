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
export type Service = 'crm' | 'agents' | 'data' | 'seo' | 'chatbots' | 'publishing' | 'marketplace';
export type Mock = 'dashboard' | 'chat' | 'site' | 'mobile' | 'table' | 'report';

export interface Work {
	slug: string;
	name: L;
	credit: Credit;
	kind: L;
	summary: L;
	problem: L;
	built: L;
	stack: string[];
	services: Service[];
	url?: string;
	image?: string;
	mock?: Mock;
	/** Shown in the home hero slider (needs `image`), in this order. */
	hero?: number;
}

export const credits: Record<Credit, { name: string; url?: string; note: L }> = {
	rubrion: { name: 'Rubrion', note: { en: 'Built by Rubrion', pt: 'Feito pela Rubrion' } },
	mt2: { name: 'MT2 Data', url: 'https://mt2data.cloud', note: { en: 'Consulting via MT2 Data', pt: 'Consultoria via MT2 Data' } },
	sennatech: { name: 'Sennatech', url: 'https://www.sennatechnology.com', note: { en: 'Delivered with Sennatech', pt: 'Entregue com a Sennatech' } },
};

export const work: Work[] = [
	{
		slug: 'advogue',
		name: { en: 'Advogue', pt: 'Advogue' },
		credit: 'rubrion',
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
		services: ['seo', 'chatbots'],
		url: 'https://law.rubrion.ai',
		image: 'law-demo',
		hero: 1,
	},
	{
		slug: 'animally',
		name: { en: 'Animally', pt: 'Animally' },
		credit: 'rubrion',
		kind: { en: 'Home vet care, São Carlos', pt: 'Veterinária a domicílio, São Carlos' },
		summary: {
			en: 'Site, booking and email flow for a vet who visits exotic and household pets at home, also running as a ready-made clinic site.',
			pt: 'Site, agendamento e e-mails para uma veterinária que atende pets exóticos e domésticos em casa, também disponível como site pronto para clínicas.',
		},
		problem: {
			en: 'A new practice with no clinic yet needed bookings, honest positioning and a way to answer “how much?” without a full-time assistant.',
			pt: 'Uma prática nova, ainda sem clínica, precisava de agendamentos, um posicionamento honesto e um jeito de responder “quanto custa?” sem uma assistente em tempo integral.',
		},
		built: {
			en: 'A bilingual static site with a booking wizard that checks the service area, sends the team and the client confirmation emails, a scripted chat with WhatsApp handoff, and hand-drawn pets animated with GSAP. The same build runs as a full clinic site, with a team, a 24/7 strip, a shop and a style guide, at vet.rubrion.ai.',
			pt: 'Um site estático bilíngue com agendamento em etapas que confere a área atendida, envia e-mails de confirmação para a equipe e para o cliente, um chat roteirizado com passagem para o WhatsApp e pets desenhados à mão animados com GSAP. A mesma base roda como site completo de clínica, com equipe, faixa 24h, loja e guia de estilo, em vet.rubrion.ai.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Resend', 'Email Routing', 'GSAP'],
		services: ['seo', 'chatbots'],
		url: 'https://animally.pet',
		image: 'animally',
		hero: 2,
	},
	{
		slug: 'mt2-data-site',
		name: { en: 'MT2 Data website', pt: 'Site da MT2 Data' },
		credit: 'mt2',
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
		services: ['seo', 'publishing'],
		url: 'https://mt2data.cloud',
		image: 'mt2data',
		hero: 3,
	},
	{
		slug: 'brad',
		name: { en: 'Brad', pt: 'Brad' },
		credit: 'rubrion',
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
		services: ['agents', 'chatbots'],
		url: 'https://brad.rubrion.ai',
		image: 'brad',
		hero: 4,
	},
	{
		slug: 'curriclean',
		name: { en: 'CurriClean', pt: 'CurriClean' },
		credit: 'rubrion',
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
		services: ['agents', 'data'],
		url: 'https://curriclean.rubrion.ai',
		image: 'curriclean',
		hero: 5,
	},
	{
		slug: 'edgeletter',
		name: { en: 'EdgeLetter', pt: 'EdgeLetter' },
		credit: 'rubrion',
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
		services: ['publishing', 'seo'],
		url: 'https://edgeletter.rubrion.ai',
		image: 'edgeletter',
		hero: 6,
	},
	{
		slug: 'rubrion-store',
		name: { en: 'Rubrion Store', pt: 'Rubrion Store' },
		credit: 'rubrion',
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
		services: ['marketplace'],
		image: 'rubrion-store',
		hero: 7,
	},
	{
		slug: 'mondesa',
		name: { en: 'MonDesa', pt: 'MonDesa' },
		credit: 'rubrion',
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
		services: ['seo'],
		url: 'https://mondesa.com.br',
		image: 'mondesa',
		hero: 8,
	},
	{
		slug: 'cerne',
		name: { en: 'Cerne', pt: 'Cerne' },
		credit: 'rubrion',
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
		services: ['crm', 'data'],
		mock: 'dashboard',
	},
	{
		slug: 'equanime',
		name: { en: 'Equânime', pt: 'Equânime' },
		credit: 'rubrion',
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
	},
	{
		slug: 'nown-creative',
		name: { en: 'NOWN Creative', pt: 'NOWN Creative' },
		credit: 'rubrion',
		kind: { en: 'Video production studio, Curitiba', pt: 'Produtora de vídeo, Curitiba' },
		summary: {
			en: 'A showreel-first site for a creative video studio whose clients include Coca-Cola, Disney and Red Bull.',
			pt: 'Um site com o showreel em primeiro lugar para uma produtora de vídeo que atende marcas como Coca-Cola, Disney e Red Bull.',
		},
		problem: {
			en: 'The work is the pitch: the site had to play video fast and stay out of its way.',
			pt: 'O trabalho é o argumento: o site precisava tocar vídeo rápido e não atrapalhar.',
		},
		built: {
			en: 'A React and Vite single-page site with a project grid, autoplaying reels and contact.',
			pt: 'Um site React e Vite de página única com grade de projetos, vídeos em reprodução automática e contato.',
		},
		stack: ['React', 'Vite', 'Tailwind'],
		services: ['seo'],
		mock: 'site',
	},
	{
		slug: 'mastra-cloudflare',
		name: { en: 'Mastra on Cloudflare', pt: 'Mastra na Cloudflare' },
		credit: 'rubrion',
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
		services: ['agents', 'chatbots'],
		mock: 'chat',
	},
	{
		slug: 'colmeia',
		name: { en: 'Colmeia', pt: 'Colmeia' },
		credit: 'mt2',
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
		services: ['agents', 'chatbots', 'data'],
		mock: 'chat',
	},
	{
		slug: 'dexplan',
		name: { en: 'Dexplan', pt: 'Dexplan' },
		credit: 'mt2',
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
		services: ['data'],
		mock: 'table',
	},
	{
		slug: 'mt2-allocation',
		name: { en: 'MT2 Allocation', pt: 'MT2 Allocation' },
		credit: 'mt2',
		kind: { en: 'Team allocation hub', pt: 'Central de alocação de equipe' },
		summary: {
			en: 'Who is on which project, at what capacity, with every project’s resources in one place.',
			pt: 'Quem está em qual projeto, com qual dedicação, e os recursos de cada projeto num só lugar.',
		},
		problem: {
			en: 'Allocation across billable and demo projects lived in chats and memory.',
			pt: 'A alocação entre projetos faturáveis e demonstrações vivia em conversas e na memória.',
		},
		built: {
			en: 'An Astro app on a Worker behind Cloudflare Access, tracking people, capacity and project links.',
			pt: 'Um app em Astro num Worker atrás do Cloudflare Access, com pessoas, dedicação e links de cada projeto.',
		},
		stack: ['Astro', 'Cloudflare Workers', 'Cloudflare Access'],
		services: ['crm'],
		mock: 'dashboard',
	},
	{
		slug: 'mt2-datalake-gateway',
		name: { en: 'MT2 Datalake Gateway', pt: 'MT2 Datalake Gateway' },
		credit: 'mt2',
		kind: { en: 'Datalake access gateway', pt: 'Gateway de acesso ao datalake' },
		summary: {
			en: 'Clients reach exactly the datasets their API key allows, by API or through visual apps.',
			pt: 'Cada cliente acessa exatamente os conjuntos de dados que sua chave permite, por API ou por apps visuais.',
		},
		problem: {
			en: 'Sharing datalake extracts by hand was slow and hard to audit.',
			pt: 'Compartilhar extrações do datalake à mão era lento e difícil de auditar.',
		},
		built: {
			en: 'An API Worker with index-file access control, an admin for keys and permissions, and client-specific forecast apps.',
			pt: 'Uma API em Worker com controle de acesso por arquivo de índice, um painel de chaves e permissões, e apps de previsão por cliente.',
		},
		stack: ['Cloudflare Workers', 'TypeScript', 'React'],
		services: ['data'],
		mock: 'table',
	},
	{
		slug: 'avilink',
		name: { en: 'Avilink', pt: 'Avilink' },
		credit: 'sennatech',
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
		services: ['crm', 'data'],
		mock: 'mobile',
	},
	{
		slug: 'bccc',
		name: { en: 'BCCC', pt: 'BCCC' },
		credit: 'sennatech',
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
			en: 'A static Astro site on a Worker with three languages, event and news sections migrated from the old site, and structured data.',
			pt: 'Um site estático em Astro num Worker com três idiomas, eventos e notícias migrados do site antigo e dados estruturados.',
		},
		stack: ['Astro', 'Cloudflare Workers'],
		services: ['seo', 'publishing'],
		mock: 'site',
	},
	{
		slug: 'mvm-war-room',
		name: { en: 'MVM War Room', pt: 'MVM War Room' },
		credit: 'sennatech',
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
		services: ['data'],
		url: 'https://mvmwarroom.io',
		image: 'mvm-war-room',
	},
];

export const heroWork = work.filter((w) => w.hero && w.image).sort((a, b) => a.hero! - b.hero!);
