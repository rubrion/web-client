/**
 * Scripted chat (ChatWidget.astro): a fixed menu of answers, so it costs
 * nothing to run and never makes things up. Anything that needs a person
 * (a budget, a specific project) is handed to WhatsApp or email with a
 * pre-filled message. The transcript survives navigation (sessionStorage).
 */
type Node = 'what' | 'cost' | 'budget' | 'time' | 'work' | 'human';
interface Data {
	s: { hello: string; options: Record<Node, string>; answers: Record<string, string> };
	services: string[];
	count: number;
	whatsapp: string;
	email: string;
}
interface Msg {
	me?: boolean;
	text: string;
	list?: string[];
	note?: string;
	links?: { label: string; href: string; external?: boolean }[];
}

const KEY = 'rubrion-chat';

export function initChat() {
	const root = document.querySelector<HTMLElement>('[data-chat]');
	if (!root || root.dataset.ready) return;
	root.dataset.ready = '';
	const d: Data = JSON.parse(root.querySelector('[data-chat-data]')!.textContent!);
	const panel = root.querySelector<HTMLElement>('[data-chat-panel]')!;
	const toggle = root.querySelector<HTMLButtonElement>('[data-chat-toggle]')!;
	const log = root.querySelector<HTMLElement>('[data-chat-log]')!;
	const opts = root.querySelector<HTMLElement>('[data-chat-options]')!;
	const motion = document.documentElement.classList.contains('has-motion');
	let history: Msg[] = [];

	const save = () => {
		try {
			sessionStorage.setItem(KEY, JSON.stringify(history));
		} catch {
			/* private mode: the chat restarts on the next page */
		}
	};

	const el = (tag: string, text?: string, cls?: string) => {
		const e = document.createElement(tag);
		if (text) e.textContent = text;
		if (cls) e.className = cls;
		return e;
	};

	function render(m: Msg) {
		const li = el('li', undefined, m.me ? 'is-me' : '');
		li.appendChild(el('span', m.text));
		if (m.list) {
			const ul = el('ul');
			m.list.forEach((t) => ul.appendChild(el('li', t)));
			li.appendChild(ul);
		}
		if (m.note) li.appendChild(el('small', m.note));
		if (m.links) {
			const wrap = el('span', undefined, 'chat__actions');
			m.links.forEach((l) => {
				const a = el('a', l.label) as HTMLAnchorElement;
				a.href = l.href;
				if (l.external) {
					a.target = '_blank';
					a.rel = 'noopener';
				}
				wrap.appendChild(a);
			});
			li.appendChild(wrap);
		}
		log.appendChild(li);
		log.scrollTop = log.scrollHeight;
	}

	const push = (m: Msg) => {
		history.push(m);
		save();
		render(m);
	};

	/** Answers arrive after a short typing beat. */
	function say(msgs: Msg[]) {
		menu([]);
		const typing = el('li', undefined, 'chat__typing');
		typing.innerHTML = '<i></i><i></i><i></i>';
		log.appendChild(typing);
		log.scrollTop = log.scrollHeight;
		setTimeout(() => {
			typing.remove();
			msgs.forEach(push);
			menu(Object.keys(d.s.options) as Node[]);
		}, motion ? 600 : 0);
	}

	const a = d.s.answers;
	const people = () => [
		{ label: a.whatsapp, href: `${d.whatsapp}?text=${encodeURIComponent(a.waMessage)}`, external: true },
		{ label: a.email, href: `mailto:${d.email}?subject=${encodeURIComponent('Rubrion')}` },
	];
	const answers: Record<Node, () => Msg[]> = {
		what: () => [{ text: a.what, list: d.services, note: a.whatNote }],
		cost: () => [{ text: a.cost, links: [{ label: a.brief, href: '/#contact' }] }],
		budget: () => [{ text: a.budget, links: people() }],
		time: () => [{ text: a.time }],
		work: () => [{ text: a.work.replace('{n}', String(d.count)), links: [{ label: a.seeWork, href: '/work' }] }],
		human: () => [{ text: a.human, links: people() }],
	};

	function menu(nodes: Node[]) {
		opts.replaceChildren();
		nodes.forEach((n) => {
			const b = el('button', d.s.options[n]) as HTMLButtonElement;
			b.type = 'button';
			b.addEventListener('click', () => {
				push({ me: true, text: d.s.options[n] });
				say(answers[n]());
			});
			opts.appendChild(b);
		});
	}

	function start(fresh: boolean) {
		log.replaceChildren();
		history = [];
		if (!fresh) {
			try {
				history = JSON.parse(sessionStorage.getItem(KEY) ?? '[]');
			} catch {
				history = [];
			}
		}
		if (history.length) history.forEach(render);
		else push({ text: d.s.hello });
		menu(Object.keys(d.s.options) as Node[]);
	}

	function open(state: boolean) {
		root!.classList.toggle('is-open', state);
		panel.hidden = !state;
		toggle.setAttribute('aria-expanded', String(state));
		if (state) {
			if (!log.children.length) start(false);
			opts.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
		}
	}

	toggle.addEventListener('click', () => open(Boolean(panel.hidden)));
	root.querySelector('[data-chat-restart]')!.addEventListener('click', () => {
		try {
			sessionStorage.removeItem(KEY);
		} catch {}
		start(true);
	});
	document.addEventListener('click', (e) => {
		if ((e.target as Element).closest('[data-chat-open]')) open(true);
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && !panel.hidden) {
			open(false);
			toggle.focus();
		}
	});
}
