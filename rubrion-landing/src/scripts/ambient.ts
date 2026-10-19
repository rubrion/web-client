/**
 * Ambient background for `canvas[data-ambient]`: slow, domain-warped bands of
 * warm paper tones with a faint red glow, that arrive by settling out of a
 * strong distortion (the "fade in by distortion") and then drift.
 *
 * `data-ambient="paper"` follows the theme (paper light, graphite dark);
 * `data-ambient="slab"` is always dark (contact, footer). Rendered at a
 * fraction of the screen's pixels, capped at 30fps, paused off-screen; with
 * reduced motion it draws one settled frame and stops.
 */
import { NOISE, createGL, fit, loop, reducedMotion } from './gl';

const FRAG = `
uniform vec2 uRes; uniform float uTime; uniform float uIntro;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uGlow;
${NOISE}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.6;
  float t = uTime * 0.035;
  // Strong warp while arriving, settling to a gentle one.
  float warp = mix(3.2, 0.9, uIntro);
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + warp * q + vec2(1.7, 9.2) + t * 0.6), fbm(p + warp * q + vec2(8.3, 2.8)));
  float f = fbm(p + warp * r);
  // Diagonal bands, like light through blinds, bent by the noise.
  float band = smoothstep(0.25, 0.85, sin((uv.x - uv.y) * 3.2 + f * 4.0 + t * 2.0) * 0.5 + 0.5);
  vec3 col = mix(uA, uB, smoothstep(0.2, 0.9, f));
  col = mix(col, uC, band * 0.55);
  // Faint red glow in the upper right.
  float g = exp(-3.2 * length((uv - vec2(0.85, 0.95)) * vec2(1.0, 1.4)));
  col = mix(col, uGlow, g * 0.22 * uIntro);
  gl_FragColor = vec4(col * uIntro, uIntro);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
const PALETTES = {
	paper: [hex('#f3f2ee'), hex('#e6e3db'), hex('#d8d4ca'), hex('#e0473f')],
	graphite: [hex('#0f0f0e'), hex('#1c1b19'), hex('#2a2825'), hex('#c2302b')],
	slab: [hex('#121211'), hex('#1e1d1b'), hex('#2e2b28'), hex('#c2302b')],
};

function mount(canvas: HTMLCanvasElement) {
	let ctx;
	try {
		ctx = createGL(canvas, FRAG);
	} catch {
		ctx = null;
	}
	if (!ctx) return;
	const { gl, u } = ctx;
	const reduced = reducedMotion();
	const kind = canvas.dataset.ambient;
	const palette = () => (kind === 'slab' ? PALETTES.slab : document.documentElement.classList.contains('dark') ? PALETTES.graphite : PALETTES.paper);
	let start = -1;
	const draw = (t: number) => {
		if (start < 0) start = t;
		const [w, h] = fit(canvas, gl, 0.5);
		const [a, b, c, glow] = palette();
		const k = reduced ? 1 : Math.min(1, (t - start) / 2.2);
		gl.uniform2f(u('uRes'), w, h);
		gl.uniform1f(u('uTime'), reduced ? 12 : t);
		gl.uniform1f(u('uIntro'), 1 - Math.pow(1 - k, 3));
		gl.uniform3fv(u('uA'), a);
		gl.uniform3fv(u('uB'), b);
		gl.uniform3fv(u('uC'), c);
		gl.uniform3fv(u('uGlow'), glow);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	};
	canvas.classList.add('is-live');
	if (reduced) {
		draw(0);
		// Redraw for a theme switch, nothing else.
		new MutationObserver(() => draw(0)).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		return;
	}
	loop(canvas, draw, 30);
}

export function initAmbient() {
	const canvases = document.querySelectorAll<HTMLCanvasElement>('canvas[data-ambient]');
	if (!canvases.length) return;
	const io = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (!e.isIntersecting) continue;
			io.unobserve(e.target);
			mount(e.target as HTMLCanvasElement);
		}
	}, { rootMargin: '300px' });
	canvases.forEach((c) => io.observe(c));
}
