// Renders video/scene.html to public/video/agent-libraries-<lang>.mp4 (and a poster
// .webp) with Playwright and ffmpeg, with the sound track from sfx.mjs (the
// pages play it muted until the viewer turns the sound on). Run from rubrion-landing:
//   node video/render.mjs [en|pt] [--frame=12.5]
// --frame writes one PNG at that second to check a scene without encoding.
// Playwright is the one in ~/rubrion/cerne (internal/operations.md).
import { chromium } from '/home/samuel/rubrion/cerne/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { track } from './sfx.mjs';
import { fileURLToPath } from 'node:url';

const lang = process.argv[2] === 'pt' ? 'pt' : 'en';
const at = process.argv.find((a) => a.startsWith('--frame='))?.slice(8);
const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = fileURLToPath(new URL('../public/video/', import.meta.url));
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`file://${here}scene.html?lang=${lang}`);
await page.evaluate(() => window.ready);
const { DURATION, FPS, cues } = await page.evaluate(() => window.meta);
const frame = async (t) => Buffer.from((await page.evaluate((s) => window.draw(s), t)).split(',')[1], 'base64');

if (at) {
	writeFileSync(`${here}frame-${lang}.png`, await frame(Number(at)));
} else {
	const wav = `${tmpdir()}/agent-libraries-${lang}.wav`;
	writeFileSync(wav, track(cues, DURATION));
	const ff = spawn(
		'ffmpeg',
		['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', wav, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow', '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', `${outDir}agent-libraries-${lang}.mp4`],
		{ stdio: ['pipe', 'inherit', 'inherit'] },
	);
	const total = Math.round(DURATION * FPS);
	for (let i = 0; i < total; i++) {
		if (!ff.stdin.write(await frame(i / FPS))) await new Promise((r) => ff.stdin.once('drain', r));
	}
	ff.stdin.end();
	await new Promise((r) => ff.on('close', r));
	rmSync(wav);
	// The poster: the assistant answering inside the app.
	const poster = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-i', '-', '-c:v', 'libwebp', '-quality', '85', `${outDir}agent-libraries-${lang}.webp`], { stdio: ['pipe', 'inherit', 'inherit'] });
	poster.stdin.end(await frame(3.5 + 5.5 + 5.5 + 8));
	await new Promise((r) => poster.on('close', r));
	console.log(`agent-libraries-${lang}.mp4: ${total} frames, ${DURATION}s, ${cues.length} sounds`);
}
await browser.close();
