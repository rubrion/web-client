/**
 * Ambient background for `canvas[data-ambient]`: a staggered field of cut
 * rubies (Rubrion's and Rubry's shape) with hairline outlines and facet
 * lines, each gem slowly changing tone, and a faint red light in one corner.
 * It arrives pulled apart by a strong distortion that settles into place
 * (the "fade in by distortion").
 *
 * `data-ambient="paper"` follows the theme (paper light, graphite dark);
 * `data-ambient="slab"` is always dark (contact, footer). Rendered at a
 * fraction of the screen's pixels, capped at 30fps, paused off-screen; with
 * reduced motion it draws one settled frame and stops.
 */
import { NOISE, createGL, fit, loop, reducedMotion } from './gl';

const FRAG = `
uniform vec2 uRes; uniform float uTime; uniform float uIntro;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uGlow; uniform vec3 uLine;
${NOISE}
// Signed distance to the ruby outline (convex pentagon, flat table on top,
// point at the bottom), in cell units. Negative inside.
float plane(vec2 p, vec2 a, vec2 b){
  vec2 e = normalize(b - a);
  // Vertices run clockwise, so inside is where every edge gives a negative.
  return (p - a).y * e.x - (p - a).x * e.y;
}
float ruby(vec2 p){
  vec2 v0 = vec2(-0.27, 0.36), v1 = vec2(0.27, 0.36), v2 = vec2(0.44, 0.1), v3 = vec2(0.0, -0.44), v4 = vec2(-0.44, 0.1);
  float d = plane(p, v0, v1);
  d = max(d, plane(p, v1, v2));
  d = max(d, plane(p, v2, v3));
  d = max(d, plane(p, v3, v4));
  d = max(d, plane(p, v4, v0));
  return d + 0.025;
}
// Facet lines inside a gem: the girdle, crown and pavilion cuts.
float seg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}
float facets(vec2 p){
  float d = seg(p, vec2(-0.4, 0.1), vec2(0.4, 0.1));
  d = min(d, seg(p, vec2(-0.13, 0.33), vec2(-0.2, 0.1)));
  d = min(d, seg(p, vec2(0.13, 0.33), vec2(0.2, 0.1)));
  d = min(d, seg(p, vec2(-0.2, 0.1), vec2(0.0, -0.41)));
  d = min(d, seg(p, vec2(0.2, 0.1), vec2(0.0, -0.41)));
  return d;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  float t = uTime * 0.05;
  // Gem space: about three rows per screen height, odd rows offset by half
  // a gem so they interlock.
  vec2 p = vec2(uv.x * asp, uv.y) * 3.4;
  // Arriving, the field is pulled apart by a strong distortion that settles.
  float amp = (1.0 - uIntro) * 1.6;
  p += (vec2(fbm(p * 0.6 + 3.1), fbm(p * 0.6 + 7.7)) - 0.5) * amp;
  const float H = 0.62;
  float d = 1e3; vec2 id = vec2(0.0); vec2 lp = vec2(0.0);
  float row = floor(p.y / H);
  for (int k = -1; k <= 1; k++) {
    float r = row + float(k);
    float off = mod(r, 2.0) * 0.5;
    float c = floor(p.x - off + 0.5);
    vec2 q = p - vec2(c + off, r * H + H * 0.5);
    float dk = ruby(q);
    if (dk < d) { d = dk; id = vec2(c, r); lp = q; }
  }
  // Each gem carries its own slowly changing tone.
  float k = noise(id * 1.37 + vec2(t, -t * 0.7));
  k = smoothstep(0.2, 0.95, k);
  // Calmer on the left, where page titles sit.
  float calm = mix(0.35, 1.0, smoothstep(0.15, 0.85, uv.x));
  float inside = 1.0 - smoothstep(-0.004, 0.004, d);
  vec3 col = mix(uA, mix(uB, uC, k), k * calm * inside);
  // Hairline outlines, fainter facet cuts inside.
  float px = 3.4 / uRes.y;
  float line = 1.0 - smoothstep(px * 0.6, px * 1.6, abs(d));
  float cut = (1.0 - smoothstep(px * 0.5, px * 1.4, facets(lp))) * inside;
  col = mix(col, uLine, (line * 0.6 + cut * 0.3) * calm);
  // A faint red light in the upper right.
  float g = exp(-3.0 * length((uv - vec2(0.9, 1.0)) * vec2(1.0, 1.5)));
  col = mix(col, uGlow, g * 0.2);
  gl_FragColor = vec4(col * uIntro, uIntro);
}`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
// [base, facet, deep facet, glow, edge]
const PALETTES = {
	paper: [hex('#f3f2ee'), hex('#ebe8e1'), hex('#ddd9cf'), hex('#e0473f'), hex('#cfcac0')],
	graphite: [hex('#0f0f0e'), hex('#171715'), hex('#22211e'), hex('#c2302b'), hex('#2c2b27')],
	slab: [hex('#121211'), hex('#191917'), hex('#24231f'), hex('#c2302b'), hex('#2e2d29')],
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
		const [a, b, c, glow, line] = palette();
		const k = reduced ? 1 : Math.min(1, (t - start) / 2.2);
		gl.uniform2f(u('uRes'), w, h);
		gl.uniform1f(u('uTime'), reduced ? 12 : t);
		gl.uniform1f(u('uIntro'), 1 - Math.pow(1 - k, 3));
		gl.uniform3fv(u('uA'), a);
		gl.uniform3fv(u('uB'), b);
		gl.uniform3fv(u('uC'), c);
		gl.uniform3fv(u('uGlow'), glow);
		gl.uniform3fv(u('uLine'), line);
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
