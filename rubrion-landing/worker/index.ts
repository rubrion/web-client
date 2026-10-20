/**
 * One Worker for both sites. The English build is at the root of the assets;
 * the Portuguese build sits under /__pt (tools/merge-pt.mjs). Requests for
 * rubrion.com.br are answered from /__pt first, then from the shared root
 * (images, /_astro bundles, fonts), with the Portuguese 404 page as the last
 * resort. /__pt is never reachable directly, so each domain shows exactly one
 * language at clean URLs and search engines see two separate sites.
 */
interface Env {
	ASSETS: Fetcher;
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
