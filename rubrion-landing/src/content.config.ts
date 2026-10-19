import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts live in the repo now (they used to be an EdgeLetter iframe), one
// folder per language with the same file name in both: en/<slug>.md, pt/<slug>.md.
const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		excerpt: z.string(),
		date: z.coerce.date(),
		category: z.enum(['product', 'engineering', 'company']),
		minutes: z.number(),
		cover: z.string(),
	}),
});

export const collections = { blog };
