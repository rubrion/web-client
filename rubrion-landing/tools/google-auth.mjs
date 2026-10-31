// One-time: lets the booking page (worker/booking.ts) read free/busy and add
// events on samuel@rubrion.ai's Google Calendar.
//
//   node tools/google-auth.mjs path/to/client_secret.json
//
// The JSON is the OAuth client (type "Desktop app") downloaded from Google
// Cloud. The script opens Google's consent page, catches the reply on
// localhost, and puts GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and
// GOOGLE_REFRESH_TOKEN straight into the Worker's secrets over stdin. Nothing
// secret is printed. With --print-to <file> it also writes them (mode 600) for
// copying into Infisical; delete the file afterwards.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

const file = process.argv[2];
const out = process.argv.includes('--print-to') ? process.argv[process.argv.indexOf('--print-to') + 1] : '';
if (!file) {
	console.error('usage: node tools/google-auth.mjs client_secret.json [--print-to file]');
	process.exit(1);
}
const json = JSON.parse(readFileSync(file, 'utf8'));
const { client_id, client_secret } = json.installed ?? json.web ?? {};
if (!client_id || !client_secret) throw new Error('not an OAuth client file');

const SCOPES = ['https://www.googleapis.com/auth/calendar.freebusy', 'https://www.googleapis.com/auth/calendar.events'];

const server = createServer(async (req, res) => {
	const url = new URL(req.url, 'http://127.0.0.1');
	const code = url.searchParams.get('code');
	if (!code) return res.end(url.searchParams.get('error') ?? 'waiting');
	const r = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		body: new URLSearchParams({ code, client_id, client_secret, redirect_uri: redirect, grant_type: 'authorization_code' }),
	});
	const j = await r.json();
	if (!j.refresh_token) {
		res.end('No refresh token came back. Remove the app at myaccount.google.com/permissions and run again.');
		console.error('no refresh token:', j.error ?? 'unknown');
		process.exit(1);
	}
	res.end('Done. You can close this tab.');
	server.close();

	const secrets = { GOOGLE_CLIENT_ID: client_id, GOOGLE_CLIENT_SECRET: client_secret, GOOGLE_REFRESH_TOKEN: j.refresh_token };
	for (const [name, value] of Object.entries(secrets)) {
		const p = spawnSync('npx', ['wrangler', 'secret', 'put', name], { input: value, stdio: ['pipe', 'ignore', 'inherit'], env: process.env });
		console.log(p.status === 0 ? `stored ${name}` : `FAILED ${name}`);
	}
	if (out) {
		writeFileSync(out, Object.entries(secrets).map(([k, v]) => `${k}=${v}`).join('\n') + '\n', { mode: 0o600 });
		console.log(`also written to ${out} (delete it after copying to Infisical)`);
	}
});

let redirect = '';
server.listen(0, '127.0.0.1', () => {
	redirect = `http://127.0.0.1:${server.address().port}`;
	const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	auth.search = new URLSearchParams({
		client_id,
		redirect_uri: redirect,
		response_type: 'code',
		scope: SCOPES.join(' '),
		access_type: 'offline',
		prompt: 'consent',
		login_hint: 'samuel@rubrion.ai',
	});
	console.log(`Sign in as samuel@rubrion.ai:\n${auth}`);
	spawn('xdg-open', [auth.href], { stdio: 'ignore', detached: true }).on('error', () => {});
});
