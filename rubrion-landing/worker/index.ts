/**
 * One Worker for both sites. The English build is at the root of the assets;
 * the Portuguese build sits under /__pt (tools/merge-pt.mjs). Requests for
 * rubrion.com.br are answered from /__pt first, then from the shared root
 * (images, /_astro bundles, fonts), with the Portuguese 404 page as the last
 * resort. /__pt is never reachable directly, so each domain shows exactly one
 * language at clean URLs and search engines see two separate sites.
 *
 * POST /api/subscribe is the newsletter form: Turnstile is checked here, then
 * the address goes to EdgeLetter (the blog and newsletter backend, where posts
 * are written and sent) over a service binding, as a trusted subscribe. The
 * list, double opt-in and dispatch all stay in EdgeLetter.
 */
interface Env {
	ASSETS: Fetcher;
	EDGELETTER: Fetcher;
	NEWSLETTER_TURNSTILE_SECRET: string;
	SUBSCRIBE_API_KEY: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

async function subscribe(req: Request, env: Env) {
	const body = (await req.json().catch(() => null)) as { email?: string; turnstile?: string; website?: string } | null;
	if (!body) return reply({ error: 'invalid body' }, 400);
	// Honeypot: quietly accept, never forward.
	if (body.website?.trim()) return reply({ ok: true, pending: true });
	const email = body.email?.trim().toLowerCase() ?? '';
	if (!EMAIL.test(email) || email.length > 254) return reply({ error: 'invalid email' }, 400);

	const check = new FormData();
	check.append('secret', env.NEWSLETTER_TURNSTILE_SECRET);
	check.append('response', body.turnstile ?? '');
	check.append('remoteip', req.headers.get('cf-connecting-ip') ?? '');
	const verdict = (await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: check })).json()) as { success?: boolean };
	if (!verdict.success) return reply({ error: 'captcha' }, 403);

	const res = await env.EDGELETTER.fetch('https://edgeletter.rubrion.ai/api/subscribe', {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'x-subscribe-key': env.SUBSCRIBE_API_KEY, 'cf-connecting-ip': req.headers.get('cf-connecting-ip') ?? '' },
		body: JSON.stringify({ email }),
	});
	return new Response(res.body, { status: res.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

const PT_HOST = /(^|\.)rubrion\.com\.br$/;
const PREFIX = '/__pt';

const at = (req: Request, path: string) => {
	const url = new URL(req.url);
	url.pathname = path;
	return new Request(url, req);
};

export default {
	async fetch(req: Request, env: Env): Promise<Response> {
		const { hostname, pathname } = new URL(req.url);
		if (pathname === '/api/subscribe') return req.method === 'POST' ? subscribe(req, env) : new Response(null, { status: 405, headers: { allow: 'POST' } });
		// /products merged into /work.
		if (pathname === '/products' || pathname === '/products.html') return Response.redirect(new URL('/work', req.url).href, 301);
		// Case renamed back to its real name.
		if (pathname === '/work/dynamication' || pathname === '/work/dynamication.html') return Response.redirect(new URL('/work/mt2-allocation', req.url).href, 301);
		if (pathname === PREFIX || pathname.startsWith(`${PREFIX}/`)) return new Response('Not found', { status: 404 });
		if (!PT_HOST.test(hostname)) return env.ASSETS.fetch(req);

		const own = await env.ASSETS.fetch(at(req, PREFIX + pathname));
		// Clean-URL redirects (/work.html → /work) must not leak the prefix.
		const location = own.headers.get('location');
		if (location?.includes(PREFIX)) {
			const headers = new Headers(own.headers);
			headers.set('location', location.replace(PREFIX, '') || '/');
			return new Response(null, { status: own.status, headers });
		}
		if (own.status !== 404) return own;
		const shared = await env.ASSETS.fetch(req);
		if (shared.status !== 404) return shared;
		const missing = await env.ASSETS.fetch(at(req, `${PREFIX}/404`));
		return new Response(missing.body, { status: 404, headers: missing.headers });
	},
} satisfies ExportedHandler<Env>;
