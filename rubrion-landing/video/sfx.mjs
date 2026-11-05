// The video's sound track: chiptune effects synthesized from square waves and
// noise at the scene's cues (scene.html `cues()`), mixed into a mono WAV.
// No samples, so nothing to license. render.mjs muxes it into the MP4.
const RATE = 44100;

// A note: frequency (or a [from, to] sweep), length in seconds, loudness.
// Square wave, quick attack, exponential decay, so each one plinks.
function note(freq, dur, vol = 0.18, { duty = 0.5, noise = 0 } = {}) {
	const n = Math.round(dur * RATE);
	const out = new Float32Array(n);
	const [f0, f1] = Array.isArray(freq) ? freq : [freq, freq];
	let phase = 0;
	for (let i = 0; i < n; i++) {
		const p = i / n;
		phase += (f0 + (f1 - f0) * p) / RATE;
		const sq = phase % 1 < duty ? 1 : -1;
		const env = Math.min(1, i / (RATE * 0.002)) * Math.exp(-4 * p);
		out[i] = (sq * (1 - noise) + (Math.random() * 2 - 1) * noise) * vol * env;
	}
	return out;
}

// Notes in a row, each `step` seconds after the last.
const run = (freqs, step, dur, vol) => freqs.map((f, i) => [i * step, note(f, dur, vol)]);

const C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.5, E6 = 1318.5, G6 = 1568;

/** Each sound: parts at an offset from its cue. */
const SOUNDS = {
	blip: () => [[0, note(880, 0.03, 0.07, { duty: 0.25 })]],
	blip2: () => [[0, note(988, 0.03, 0.07, { duty: 0.25 })]],
	tick: () => [[0, note(1200, 0.03, 0.08, { duty: 0.25 })]],
	pop: () => [[0, note([500, 950], 0.07, 0.14)]],
	hop: () => [[0, note([280, 620], 0.08, 0.12, { duty: 0.25 })]],
	ding: () => [[0, note(E6, 0.16, 0.12)], [0, note(E5, 0.16, 0.06)]],
	chime: () => [[0, note(C6, 0.08, 0.13)], [0.07, note(G6, 0.18, 0.13)]],
	buzz: () => [[0, note([120, 85], 0.2, 0.13, { noise: 0.25 })]],
	jingle: () => run([C5, E5, G5, C6], 0.09, 0.12, 0.13),
	fanfare: () => [...run([C5, E5, G5], 0.1, 0.12, 0.13), [0.3, note(C6, 0.45, 0.14)], [0.3, note(G5, 0.45, 0.07)]],
};

/** The WAV for `cues` ([second, sound][]) over `duration` seconds. */
export function track(cues, duration) {
	const mix = new Float32Array(Math.ceil(duration * RATE));
	for (const [t, name] of cues) {
		for (const [offset, part] of SOUNDS[name]()) {
			const start = Math.round((t + offset) * RATE);
			for (let i = 0; i < part.length && start + i < mix.length; i++) mix[start + i] += part[i];
		}
	}
	const pcm = Buffer.alloc(44 + mix.length * 2);
	pcm.write('RIFF', 0);
	pcm.writeUInt32LE(36 + mix.length * 2, 4);
	pcm.write('WAVEfmt ', 8);
	pcm.writeUInt32LE(16, 16);
	pcm.writeUInt16LE(1, 20); // PCM
	pcm.writeUInt16LE(1, 22); // mono
	pcm.writeUInt32LE(RATE, 24);
	pcm.writeUInt32LE(RATE * 2, 28);
	pcm.writeUInt16LE(2, 32);
	pcm.writeUInt16LE(16, 34);
	pcm.write('data', 36);
	pcm.writeUInt32LE(mix.length * 2, 40);
	// A soft limit where sounds overlap, so nothing clips.
	for (let i = 0; i < mix.length; i++) pcm.writeInt16LE(Math.round(Math.tanh(mix[i] * 2.4) * 32000), 44 + i * 2);
	return pcm;
}
