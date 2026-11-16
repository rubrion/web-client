// Full-content RSS for this build's language (rubrion.ai → English,
// rubrion.com.br → Portuguese). EdgeLetter imports it, so new posts here show
// up on rubrion.edgeletter.blog and go to newsletter subscribers on their own.
import type { APIRoute } from 'astro';
import { getPosts } from '../data/blog';
import { LANG } from '../data/locale';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
const MIME: Record<string, string> = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', avif: 'image/avif', gif: 'image/gif' };

export const GET: APIRoute = async ({ site }) => {
	const origin = site!.origin;
	const posts = await getPosts();
	// Site-relative links and images only work elsewhere as full addresses.
	const absolute = (html: string) => html.replace(/(\s(?:src|href)=")\//g, `$1${origin}/`);

	const items = posts.map((p) => {
		const url = `${origin}/blog/${p.slug}`;
		const cover = p.data.cover.startsWith('http') ? p.data.cover : `${origin}${p.data.cover}`;
		const type = MIME[cover.split('.').pop()?.toLowerCase() ?? ''] ?? 'image/jpeg';
		const html = `<p><img src="${esc(cover)}" alt="" /></p><p><em>${esc(p.data.excerpt)}</em></p>${absolute(p.rendered?.html ?? '')}`;
		return [
			'<item>',
			`<title>${esc(p.data.title)}</title>`,
			`<link>${url}</link>`,
			`<guid isPermaLink="true">${url}</guid>`,
			`<pubDate>${new Date(Date.UTC(p.data.date.getUTCFullYear(), p.data.date.getUTCMonth(), p.data.date.getUTCDate(), 12)).toUTCString()}</pubDate>`,
			`<description>${esc(p.data.excerpt)}</description>`,
			`<content:encoded>${cdata(html)}</content:encoded>`,
			`<media:content url="${esc(cover)}" medium="image" type="${type}" />`,
			'</item>',
		].join('');
	});

	const title = LANG === 'pt' ? 'Rubrion — Blog' : 'Rubrion — Blog';
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${title}</title><link>${origin}/blog</link><description>Rubrion</description><language>${LANG === 'pt' ? 'pt-BR' : 'en'}</language>
<atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
</channel></rss>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
