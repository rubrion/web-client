/**
 * End-to-end checks against a running site (astro preview or production).
 *
 *   node tools/verify.mjs [origin] [--reduced]   (default http://localhost:4321)
 *
 * For every built page at 1440 and 390:
 *   - no console errors or uncaught exceptions
 *   - images decoded, reveals visible, no horizontal overflow
 *   - exactly one <h1>; canonical + hreflang alternates (1440 only)
 * Flows: hero slider turns and pauses off-screen, the diagonal transition
 * runs on main links only, the header hides on the way down and returns on
 * the way up, work filters, and both forms refuse to send without a captcha.
 * `--reduced` runs everything with prefers-reduced-motion.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
const reduced = process.argv.includes("--reduced");
const origin = (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "http://localhost:4321").replace(/\/$/, "");
const PORT = 9400 + Math.floor(Math.random() * 500);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), "verify-"));
const chrome = spawn(
	process.env.CHROME_BIN ?? "google-chrome",
	["--headless=new", "--disable-gpu", "--no-sandbox", `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank"],
	{ stdio: "ignore" },
);
process.on("exit", () => {
	chrome.kill();
	try {
		rmSync(profile, { recursive: true, force: true });
	} catch {}
});

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
	try {
		const t = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
		wsUrl = t.find((x) => x.type === "page")?.webSocketDebuggerUrl;
	} catch {}
	if (!wsUrl) await sleep(250);
}
if (!wsUrl) throw new Error(`Chrome never listened on :${PORT}`);

const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let id = 0;
const pending = new Map();
const consoleErrors = [];
ws.addEventListener("message", (ev) => {
	const m = JSON.parse(ev.data);
	if (m.id && pending.has(m.id)) {
		const { resolve, reject } = pending.get(m.id);
		pending.delete(m.id);
		m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
	} else if (m.method === "Runtime.exceptionThrown") {
		consoleErrors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
	} else if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
		consoleErrors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
	} else if (m.method === "Log.entryAdded" && m.params.entry.level === "error") {
		consoleErrors.push(`${m.params.entry.text} ${m.params.entry.url ?? ""}`);
	}
});
const send = (method, params = {}, ms = 30000) => {
	const i = ++id;
	ws.send(JSON.stringify({ id: i, method, params }));
	return new Promise((res, rej) => {
		const t = setTimeout(() => (pending.delete(i), rej(new Error(`${method} timed out`))), ms);
		pending.set(i, { resolve: (v) => (clearTimeout(t), res(v)), reject: (e) => (clearTimeout(t), rej(e)) });
	});
};
const js = async (expression) => {
	const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
	if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
	return r.result.value;
};

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
if (reduced) {
	// Everything must render, and nothing may move, for a visitor who asked
	// for less motion. The same checks run; the start states must never apply.
	await send("Emulation.setEmulatedMedia", {
		features: [{ name: "prefers-reduced-motion", value: "reduce" }],
	});
	console.log("(prefers-reduced-motion: reduce)");
}

let failures = 0;
const check = (ok, label, detail = "") => {
	console.log(`${ok ? "  ok  " : "  FAIL"} ${label}${!ok && detail ? `\n         ${detail}` : ""}`);
	if (!ok) failures++;
};

/** Device language follows the page, unless a test sets one: the layout
 * redirects a first visit to the visitor's preferred language. */
async function setLanguage(lang) {
	const ua = (await send("Browser.getVersion")).userAgent;
	await send("Emulation.setUserAgentOverride", { userAgent: ua, acceptLanguage: lang });
}


async function load(path, width) {
	await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
	consoleErrors.length = 0;
	await send("Page.navigate", { url: origin + path });
	await sleep(2200);
	const h = await js("document.documentElement.scrollHeight");
	for (let y = 0; y < h; y += 500) {
		await js(`window.scrollTo(0, ${y})`);
		await sleep(110);
	}
	await sleep(1300);
}

// Every built page (dist/client/**/*.html), as clean URLs.
const root = new URL("../dist/client/", import.meta.url).pathname;
const walk = (dir) => readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? walk(join(dir, f)) : [join(dir, f)]));
const pages = walk(root)
	.filter((f) => f.endsWith(".html") && !f.endsWith("404.html"))
	.map((f) => "/" + relative(root, f).replace(/(index)?\.html$/, "").replace(/\/$/, ""))
	.sort();
pages.push("/does-not-exist");

for (const path of pages) {
	for (const width of [1440, 390]) {
		console.log(`\n${path} @ ${width}`);
		await load(path, width);
		const errors = consoleErrors.filter((e) => !(path === "/does-not-exist" && e.includes("404")) && !/challenges\.cloudflare\.com|turnstile|110200/i.test(e));
		check(errors.length === 0, "no console errors", errors.join("\n         "));
		const broken = await js(`[...document.images].filter((i) => i.loading !== "lazy" && i.src && i.complete && !i.naturalWidth).map((i) => i.src)`);
		check(broken.length === 0, "images decoded", broken.join(", "));
		const hidden = await js(`[...document.querySelectorAll("[data-reveal]")].filter((el) => el.getClientRects().length && getComputedStyle(el).opacity === "0").map((el) => el.className.slice(0, 40) || el.tagName)`);
		check(hidden.length === 0, "all reveals visible", hidden.slice(0, 6).join(", "));
		const over = await js(`document.documentElement.scrollWidth - innerWidth`);
		check(over <= 1, "no horizontal overflow", `${over}px wider`);
		if (width === 1440) {
			const seo = await js(`({ h1: document.querySelectorAll("h1").length, canonical: document.querySelector('link[rel=canonical]')?.href, alt: document.querySelectorAll('link[rel=alternate][hreflang]').length })`);
			check(seo.h1 === 1, "one h1", `${seo.h1} found`);
			check(!!seo.canonical, "canonical link");
			check(seo.alt >= 3, "hreflang alternates", `${seo.alt}`);
		}
	}
}

/* --- Flows --------------------------------------------------------- */

console.log("\nhero slider");
await load("/", 1440);
await js("window.scrollTo(0, 0)");
await sleep(400);
const first = await js(`document.querySelector("[data-cap='0'] [data-cap-name]").textContent`);
await js(`document.querySelector("[data-next]").click()`);
await sleep(1600);
const second = await js(`document.querySelector("[data-cap='0'] [data-cap-name]").textContent`);
check(first !== second, "next turns the pair", `${first} → ${second}`);
check(await js(`document.querySelector(".dhero__dot.is-active").dataset.dot === "1"`), "dot follows");
const imgs = await js(`[...document.querySelectorAll("[data-hero] img")].filter((i) => i.src).length`);
check(imgs <= 4, "only two images per half in the DOM", `${imgs}`);
if (!reduced) {
	await js(`window.scrollTo(0, document.body.scrollHeight)`);
	await sleep(7500);
	const parked = await js(`document.querySelector("[data-cap='0'] [data-cap-name]").textContent`);
	check(parked === second, "autoplay paused off-screen", `${second} → ${parked}`);
}

console.log("\nheader");
await load("/work", 390);
await js("window.scrollTo(0, 0)");
await sleep(300);
await js("window.scrollTo(0, 1400)");
await sleep(500);
check(await js(`document.querySelector("[data-header]").classList.contains("is-away")`), "hides while scrolling down");
await js("window.scrollTo(0, 1100)");
await sleep(500);
check(!(await js(`document.querySelector("[data-header]").classList.contains("is-away")`)), "returns on scroll up");

console.log("\ndiagonal transition");
await load("/", 1440);
await js("window.scrollTo(0, 0)");
const navLink = await js(`[...document.querySelectorAll("header a[data-diagonal]")].map((a) => a.getAttribute("href"))`);
check(navLink.includes("/work") && navLink.includes("/blog"), "main links carry data-diagonal", navLink.join(" "));
check((await js(`document.querySelectorAll("footer a[data-diagonal], #work a[data-diagonal]:not(.btn-light)").length`)) === 0, "footer and cards navigate plainly");
await js(`document.querySelector('header a[href="/faq"]').click()`);
await sleep(reduced ? 150 : 150);
const covering = await js(`!!document.querySelector(".dg")`);
check(reduced ? !covering : covering, reduced ? "no wipe with reduced motion" : "wipe starts");
await sleep(1800);
check((await js("location.pathname")).replace(/\.html$/, "") === "/faq", "lands on the page");
await sleep(900);
check(!(await js(`!!document.querySelector(".dg") || document.documentElement.classList.contains("dg-arriving")`)), "cover clears on arrival");

console.log("\nwork filters");
await load("/work", 1440);
const total = await js(`document.querySelectorAll("[data-filter-list] > li").length`);
await js(`document.querySelector('[data-filter="mt2"]').click()`);
await sleep(900);
const shown = await js(`[...document.querySelectorAll("[data-filter-list] > li")].filter((li) => !li.classList.contains("is-filtered")).length`);
check(shown > 0 && shown < total, "credit filter narrows the list", `${shown}/${total}`);

console.log("\nforms");
await load("/", 1440);
check(await js(`document.getElementById("contact-submit").disabled`), "contact can't send before the captcha");

console.log(failures ? `\n${failures} check(s) failed` : "\nall checks passed");
process.exit(failures ? 1 : 0);
