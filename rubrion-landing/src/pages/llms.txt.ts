import type { APIRoute } from 'astro';
import { SITE_URL, SUPPORT_EMAIL, l } from '../data/locale';
import { DEFAULT_DESCRIPTION } from '../data/seo';
import { c } from '../data/site';
import { credits, work } from '../data/work';

// llms.txt for AI crawlers, generated from the same data as the pages so it
// can't drift (the hand-written one listed products that went offline).
export const prerender = true;

export const GET: APIRoute = () => {
	const services = Object.values(c.services.items).map(([name, text]) => `- **${name}**: ${text}`);
	const cases = work.map((w) => `- [${l(w.name)}](${SITE_URL}/work/${w.slug}): ${l(w.kind)}. ${l(w.summary)} (${credits[w.credit].name}${w.url ? `, live: ${w.url}` : ''})`);
	const faq = c.faq.items.map(([q, a]) => `- **${q}** ${a}`);
	const body = `# Rubrion

> ${DEFAULT_DESCRIPTION}

Tagline: ${c.tagline}

## ${c.services.kicker}

${services.join('\n')}

## ${c.products.kicker}

- **EdgeLetter**: ${c.products.edgeletter} https://edgeletter.rubrion.ai
- **CurriClean**: ${c.products.curriclean} https://curriclean.rubrion.ai
- **Rubot / Brad**: ${c.products.rubotText} https://chat.rubrion.ai, https://brad.rubrion.ai

## ${c.work.kicker}

${cases.join('\n')}

## ${c.faq.kicker}

${faq.join('\n')}

## ${c.contact.kicker}

- ${c.contact.emailLabel}: ${SUPPORT_EMAIL}
- Site: ${SITE_URL}
`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
