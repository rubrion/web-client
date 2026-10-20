/**
 * Folds the Portuguese build (dist-pt/) into the English one (dist/) so one
 * Worker serves both domains (worker/index.ts):
 *   - pages and per-site files (sitemap, robots.txt, llms.txt, 404) go under
 *     dist/__pt/
 *   - hashed bundles (_astro/) merge into dist/_astro/ (names are content
 *     hashes, so a shared name is the same file)
 *   - public files identical to the English copy are not duplicated
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const en = join(root, 'dist');
const pt = join(root, 'dist-pt');
const out = join(en, '__pt');

const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const same = (a, b) => existsSync(b) && readFileSync(a).equals(readFileSync(b));

rmSync(out, { recursive: true, force: true });
let pages = 0;
let bundles = 0;
for (const file of walk(pt)) {
	const rel = relative(pt, file);
	if (rel.startsWith('_astro/')) {
		const target = join(en, rel);
		if (!existsSync(target)) {
			cpSync(file, target);
			bundles++;
		}
		continue;
	}
	if (same(file, join(en, rel))) continue;
	const target = join(out, rel);
	mkdirSync(dirname(target), { recursive: true });
	cpSync(file, target);
	pages++;
}
rmSync(pt, { recursive: true, force: true });
console.log(`merge-pt: ${pages} Portuguese files under /__pt, ${bundles} extra bundles`);
