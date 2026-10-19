// Blog posts for this build's language, newest first.
import { getCollection, type CollectionEntry } from 'astro:content';
import { LANG, LOCALE, type L, l } from './locale';

export type Post = CollectionEntry<'blog'> & { slug: string };

export async function getPosts(): Promise<Post[]> {
	const all = await getCollection('blog', (p) => p.id.startsWith(`${LANG}/`));
	return all
		.map((p) => Object.assign(p, { slug: p.id.slice(LANG.length + 1) }))
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const categories: Record<CollectionEntry<'blog'>['data']['category'], L> = {
	product: { en: 'Product', pt: 'Produto' },
	engineering: { en: 'Engineering', pt: 'Engenharia' },
	company: { en: 'Company', pt: 'Empresa' },
};

export const category = (k: CollectionEntry<'blog'>['data']['category']) => l(categories[k]);

export const formatDate = (d: Date) => d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
