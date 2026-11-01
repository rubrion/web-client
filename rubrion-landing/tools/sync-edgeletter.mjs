// Copies the blog (src/content/blog/{en,pt}) into EdgeLetter, so posts and the
// newsletter list are managed in one place. The posts stay written here; in
// EdgeLetter each one links back to its page on rubrion.ai / rubrion.com.br,
// keeps its real date, and is sent only to subscribers in its language.
//
//   npm run sync:edgeletter              publish new posts and email them
//   npm run sync:edgeletter -- --no-send import without emailing anyone
//   npm run sync:edgeletter -- --dry     list what would happen
//
// A post already in EdgeLetter is only updated, never emailed again
// (EdgeLetter's /api/publish matches it by slug). The Portuguese copy's slug
// gets "-pt", since EdgeLetter slugs are unique. Auth: EDGELETTER_SYNC_KEY, or
// the file .edgeletter-sync-key (gitignored), equal to EdgeLetter's SYNC_API_KEY.
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const API = 'https://edgeletter.rubrion.ai/api/publish';
const SITES = { en: 'https://rubrion.ai', pt: 'https://rubrion.com.br' };
const DIR = new URL('../src/content/blog/', import.meta.url);
const KEY_FILE = new URL('../.edgeletter-sync-key', import.meta.url);

const send = !process.argv.includes('--no-send');
const dry = process.argv.includes('--dry');
const key = process.env.EDGELETTER_SYNC_KEY ?? (existsSync(KEY_FILE) ? readFileSync(KEY_FILE, 'utf8').trim() : '');
if (!key && !dry) {
	console.error('No EDGELETTER_SYNC_KEY and no .edgeletter-sync-key file.');
	process.exit(1);
}

/** The frontmatter's flat `key: value` lines, and the Markdown after it. */
function parse(raw) {
	const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!m) throw new Error('no frontmatter');
	const meta = Object.fromEntries(
		m[1].split('\n').map((line) => {
			const i = line.indexOf(':');
			return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^"(.*)"$/, '$1')];
		}),
	);
	return { meta, body: m[2] };
}

for (const lang of ['en', 'pt']) {
	const site = SITES[lang];
	for (const file of readdirSync(new URL(`${lang}/`, DIR)).filter((f) => f.endsWith('.md')).sort()) {
		const slug = file.replace(/\.md$/, '');
		const { meta, body } = parse(readFileSync(new URL(`${lang}/${file}`, DIR), 'utf8'));
		// Site-relative links and images work in an email only as full addresses.
		const md = `![](${site}${meta.cover})\n\n*${meta.excerpt}*\n\n${body.replace(/\]\(\//g, `](${site}/`)}`;
		const post = {
			title: meta.title,
			slug: lang === 'pt' ? `${slug}-pt` : slug,
			content_md: md,
			publish: true,
			lang,
			canonical_url: `${site}/blog/${slug}`,
			published_at: new Date(`${meta.date}T12:00:00Z`).toISOString(),
			send,
		};
		if (dry) {
			console.log(`${lang} ${post.slug} ${meta.date} → ${post.canonical_url}`);
			continue;
		}
		const res = await fetch(API, {
			method: 'POST',
			headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
			body: JSON.stringify(post),
		});
		const j = await res.json().catch(() => ({}));
		const what = !res.ok ? `FAILED ${res.status} ${j.error ?? ''}` : j.dispatch ? `emailed ${j.dispatch.sent}` : j.alreadySent ? 'updated (sent before)' : 'saved, not emailed';
		console.log(`${lang} ${post.slug}: ${what}`);
	}
}
