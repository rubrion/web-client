/**
 * Booking a call on Samuel's Google Calendar, for /book on both sites.
 *
 * GET  /api/book/slots  the open slots for the next HORIZON_DAYS, as UTC ISO
 *                       strings: every half hour, day and night (clients are
 *                       anywhere), minus whatever any of Samuel's calendars
 *                       has busy (free/busy only: event details never leave
 *                       Google).
 * POST /api/book        { start, name, email, company?, note?, source?, lang,
 *                       turnstile } → checks Turnstile and that the slot is
 *                       still free, then creates the event with a Google Meet
 *                       link; Google emails the invite to both sides.
 *
 * Access is one OAuth refresh token for samuel@rubrion.ai with only the
 * calendar.freebusy and calendar.events scopes (tools/google-auth.mjs makes
 * it). The OAuth app is Internal to the rubrion.ai Workspace, so the token
 * doesn't expire after a week as a testing-mode app's would.
 *
 * BOOKING_CALENDARS (a secret, since this repo is public) lists the calendars
 * checked for busy times, comma-separated: `primary` plus the other Google
 * accounts, each of which shares its free/busy with samuel@rubrion.ai. One
 * that can't be read (sharing revoked) fails the whole check rather than risk
 * a double booking. Events are always created on `primary`.
 */
export interface BookingEnv {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REFRESH_TOKEN: string;
	NEWSLETTER_TURNSTILE_SECRET: string;
	BOOKING_CALENDARS?: string;
}

// Bookable hours, in São Paulo time. Brazil dropped daylight saving in 2019,
// so São Paulo is UTC-3 all year and a fixed offset is enough. Open around the
// clock for now; narrow DAYS or the hours to block some off.
const OFFSET_H = -3;
const DAYS = [0, 1, 2, 3, 4, 5, 6];
const OPEN_H = 0;
const CLOSE_H = 24;
const CALL_MIN = 30;
const BUFFER_MIN = 15; // kept clear around other events
const NOTICE_H = 12; // earliest bookable slot from now
const HORIZON_DAYS = 14;

const MIN = 60_000;
// The Workers default cache (the DOM's CacheStorage type doesn't know it).
const cache = (caches as unknown as { default: Cache }).default;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

let token: { value: string; until: number } | undefined;

async function accessToken(env: BookingEnv) {
	if (token && token.until > Date.now() + MIN) return token.value;
	const res = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		body: new URLSearchParams({
			client_id: env.GOOGLE_CLIENT_ID,
			client_secret: env.GOOGLE_CLIENT_SECRET,
			refresh_token: env.GOOGLE_REFRESH_TOKEN,
			grant_type: 'refresh_token',
		}),
	});
	if (!res.ok) throw new Error(`google token ${res.status}`);
	const j = (await res.json()) as { access_token: string; expires_in: number };
	token = { value: j.access_token, until: Date.now() + j.expires_in * 1000 };
	return token.value;
}

const google = async (env: BookingEnv, path: string, body: unknown) =>
	fetch(`https://www.googleapis.com/calendar/v3${path}`, {
		method: 'POST',
		headers: { authorization: `Bearer ${await accessToken(env)}`, 'content-type': 'application/json' },
		body: JSON.stringify(body),
	});

const calendars = (env: BookingEnv) => (env.BOOKING_CALENDARS || 'primary').split(',').map((id) => ({ id: id.trim() })).filter((c) => c.id);

async function busy(env: BookingEnv, from: number, to: number) {
	const res = await google(env, '/freeBusy', { timeMin: new Date(from).toISOString(), timeMax: new Date(to).toISOString(), items: calendars(env) });
	if (!res.ok) throw new Error(`google freebusy ${res.status}`);
	const j = (await res.json()) as { calendars: Record<string, { busy?: { start: string; end: string }[]; errors?: { reason: string }[] }> };
	const all = Object.entries(j.calendars);
	const broken = all.filter(([, c]) => c.errors?.length);
	if (broken.length) throw new Error(`google freebusy: can't read ${broken.map(([id, c]) => `${id} (${c.errors![0].reason})`).join(', ')}`);
	return all.flatMap(([, c]) => c.busy ?? []).map((b) => [Date.parse(b.start) - BUFFER_MIN * MIN, Date.parse(b.end) + BUFFER_MIN * MIN]);
}

/** Every slot start in working hours from `from` to `to`, before removing busy times. */
function grid(from: number, to: number) {
	const out: number[] = [];
	const day = new Date(from + OFFSET_H * 3_600_000);
	day.setUTCHours(0, 0, 0, 0);
	for (let d = day.getTime(); d < to + OFFSET_H * 3_600_000; d += 86_400_000) {
		if (!DAYS.includes(new Date(d).getUTCDay())) continue;
		for (let m = OPEN_H * 60; m + CALL_MIN <= CLOSE_H * 60; m += CALL_MIN) {
			const start = d + m * MIN - OFFSET_H * 3_600_000;
			if (start >= from && start < to) out.push(start);
		}
	}
	return out;
}

const free = (start: number, taken: number[][]) => !taken.some(([s, e]) => start < e && start + CALL_MIN * MIN > s);

async function slots(req: Request, env: BookingEnv, ctx: ExecutionContext) {
	// Cached for a minute: every visitor would otherwise cost a call to Google.
	const key = new Request(new URL('/api/book/slots', req.url).href);
	const hit = await cache.match(key);
	if (hit) return hit;
	const from = Date.now() + NOTICE_H * 3_600_000;
	const to = Date.now() + HORIZON_DAYS * 86_400_000;
	const taken = await busy(env, from, to);
	const res = Response.json(
		{ call: CALL_MIN, slots: grid(from, to).filter((s) => free(s, taken)).map((s) => new Date(s).toISOString()) },
		{ headers: { 'cache-control': 'public, max-age=60' } },
	);
	ctx.waitUntil(cache.put(key, res.clone()));
	return res;
}

async function book(req: Request, env: BookingEnv, ctx: ExecutionContext) {
	const body = (await req.json().catch(() => null)) as Record<string, string | undefined> | null;
	if (!body) return reply({ error: 'invalid body' }, 400);
	if (body.website?.trim()) return reply({ ok: true }); // honeypot
	const name = body.name?.trim().slice(0, 100) ?? '';
	const email = body.email?.trim().toLowerCase() ?? '';
	const company = body.company?.trim().slice(0, 100) ?? '';
	const note = body.note?.trim().slice(0, 1000) ?? '';
	const source = body.source?.trim().slice(0, 60) ?? '';
	const pt = body.lang === 'pt';
	const start = Date.parse(body.start ?? '');
	if (!name || !EMAIL.test(email) || email.length > 254) return reply({ error: 'invalid' }, 400);
	// Only a slot the grid would offer: on the half hour, in hours, in range.
	const from = Date.now() + NOTICE_H * 3_600_000;
	const to = Date.now() + HORIZON_DAYS * 86_400_000;
	if (!grid(start, start + 1).includes(start) || start < from || start > to) return reply({ error: 'slot' }, 409);

	const check = new FormData();
	check.append('secret', env.NEWSLETTER_TURNSTILE_SECRET);
	check.append('response', body.turnstile ?? '');
	check.append('remoteip', req.headers.get('cf-connecting-ip') ?? '');
	const verdict = (await (await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: check })).json()) as { success?: boolean };
	if (!verdict.success) return reply({ error: 'captcha' }, 403);

	// Taken since the visitor loaded the page?
	if (!free(start, await busy(env, start, start + CALL_MIN * MIN))) return reply({ error: 'slot' }, 409);

	const res = await google(env, '/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all', {
		summary: `${company || name} × Rubrion`,
		description: [
			pt ? 'Conversa de 30 minutos com a Rubrion.' : 'A 30-minute call with Rubrion.',
			note && `\n${note}`,
			`\n${name}${company ? ` (${company})` : ''} · ${email}`,
			source && `Source: ${source}`,
		]
			.filter(Boolean)
			.join('\n'),
		start: { dateTime: new Date(start).toISOString() },
		end: { dateTime: new Date(start + CALL_MIN * MIN).toISOString() },
		attendees: [{ email, displayName: name }],
		conferenceData: { createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
		reminders: { useDefault: true },
	});
	if (!res.ok) return reply({ error: 'calendar' }, 502);
	const event = (await res.json()) as { hangoutLink?: string };
	// The slot is gone: drop the cached list so the next visitor doesn't see it.
	ctx.waitUntil(cache.delete(new Request(new URL('/api/book/slots', req.url).href)));
	return reply({ ok: true, start: new Date(start).toISOString(), meet: event.hangoutLink });
}

export function booking(req: Request, env: BookingEnv, ctx: ExecutionContext, pathname: string) {
	const run = pathname === '/api/book/slots' && req.method === 'GET' ? slots : pathname === '/api/book' && req.method === 'POST' ? book : null;
	if (!run) return new Response(null, { status: 405 });
	return run(req, env, ctx).catch((e) => (console.error(String(e)), reply({ error: 'calendar' }, 502)));
}
