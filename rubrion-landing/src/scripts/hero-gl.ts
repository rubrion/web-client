/**
 * Hero slider renderer: both halves of the diagonal in one WebGL canvas.
 *
 * Each half shows its project's screenshot cover-fitted into the box that half
 * can see (top-anchored, so a site's own header and hero are what show). On a
 * change, the next pair opens from the seam outward on a straight diagonal
 * edge, and the thin red seam (with a brief glow) is drawn in the shader. Images are
 * decoded off the main thread (createImageBitmap) before a change starts, so
 * a transition never opens onto a half-loaded image.
 */
import { createGL, fit } from './gl';

const FRAG = `
uniform vec2 uRes; uniform float uTime; uniform float uP; uniform float uIntro; uniform float uNarrow;
uniform vec2 uSeam;                 // seam y (from top) at x=0 and x=1
uniform sampler2D uCurA; uniform sampler2D uCurB; uniform sampler2D uNextA; uniform sampler2D uNextB;
uniform vec4 uAspCur; uniform vec4 uAspNext;  // image aspects: (curA, curB) (nextA, nextB) in .xy
// Wide screens anchor the screenshot to its top (the site's own header and
// hero); phones centre it, since only a narrow band of each half shows.
vec2 cover(vec2 local, float boxAsp, float imgAsp){
  vec2 uv = local;
  if (imgAsp > boxAsp) uv.x = (local.x - 0.5) * boxAsp / imgAsp + 0.5;
  else uv.y = mix(local.y, local.y - 0.5, uNarrow) * imgAsp / boxAsp + 0.5 * uNarrow;
  return uv;
}
vec3 tap(bool top, bool isCur, vec2 uv){
  if (isCur) return top ? texture2D(uCurA, uv).rgb : texture2D(uCurB, uv).rgb;
  return top ? texture2D(uNextA, uv).rgb : texture2D(uNextB, uv).rgb;
}
vec3 sampleHalf(bool top, bool isCur, vec2 uv, vec2 px){
  if (px.x <= 0.0) return tap(top, isCur, uv);
  vec3 c = tap(top, isCur, uv) * 0.2;
  c += tap(top, isCur, uv + vec2(px.x, 0.0)) * 0.1;
  c += tap(top, isCur, uv - vec2(px.x, 0.0)) * 0.1;
  c += tap(top, isCur, uv + vec2(0.0, px.y)) * 0.1;
  c += tap(top, isCur, uv - vec2(0.0, px.y)) * 0.1;
  c += tap(top, isCur, uv + px) * 0.1;
  c += tap(top, isCur, uv - px) * 0.1;
  c += tap(top, isCur, uv + vec2(px.x, -px.y)) * 0.1;
  c += tap(top, isCur, uv + vec2(-px.x, px.y)) * 0.1;
  return c;
}
void main(){
  vec2 frag = gl_FragCoord.xy;
  float x = frag.x / uRes.x;
  float v = 1.0 - frag.y / uRes.y;
  float a = uSeam.x, b = uSeam.y;
  float s = mix(a, b, x);
  bool top = v < s;

  // Box each half can show, and this pixel's position inside it.
  float y0 = top ? 0.0 : min(a, b);
  float y1 = top ? max(a, b) : 1.0;
  vec2 local = vec2(x, (v - y0) / (y1 - y0));
  float boxAsp = uRes.x / (uRes.y * (y1 - y0));

  // The original sweep: the incoming image opens from the seam outward with
  // a straight edge, the lower half a beat behind the upper.
  float pt = clamp(uP * 1.12, 0.0, 1.0);
  float pb = clamp(uP * 1.12 - 0.12, 0.0, 1.0);
  float aa = 1.0 / uRes.y;
  float m = top
    ? smoothstep(s * (1.0 - pt) - aa, s * (1.0 - pt) + aa, v)
    : 1.0 - smoothstep(s + (1.0 - s) * pb - aa, s + (1.0 - s) * pb + aa, v);
  if (uP <= 0.0) m = 0.0;

  float aCur = top ? uAspCur.x : uAspCur.y;
  float aNext = top ? uAspNext.x : uAspNext.y;
  vec2 uvCur = cover(local, boxAsp, aCur);
  vec2 uvNext = cover(local, boxAsp, aNext);
  // Behind the copy (upper half, left side) the image is softly blurred, so
  // a screenshot's own text never competes with ours.
  float soft = top ? mix(1.0, 0.25, smoothstep(0.35, 0.85, x)) : 0.0;
  soft = max(soft, uNarrow * (top ? 1.0 : 0.0));
  vec2 px = vec2(5.0 / uRes.x, 5.0 / uRes.y) * soft * mix(1.0, 0.4, uNarrow);
  vec3 cur = sampleHalf(top, true, uvCur, px);
  vec3 nxt = sampleHalf(top, false, uvNext, px);
  vec3 col = mix(cur, nxt, m);

  // Legibility: the copy sits on the upper half's left; captions low right.
  if (top) {
    float shade = mix(mix(0.13, 0.72, smoothstep(0.05, 0.85, x)), 0.24, uNarrow);
    col *= shade * mix(0.35, 1.0, smoothstep(0.0, 0.18, v));
  } else {
    col *= mix(0.8, 0.3, smoothstep(0.5, 1.0, v));
  }
  // Phones: darker left and right edges frame the narrow slice.
  col *= mix(1.0, mix(0.2, 1.0, smoothstep(0.0, 0.32, min(x, 1.0 - x))), uNarrow);

  // The seam: a hairline with a soft red glow, drawn in left to right.
  float W = uRes.x, H = uRes.y;
  float dy = (b - a) * H;
  float dist = abs(v - s) * H * W / sqrt(W * W + dy * dy);
  float drawn = step(x, uIntro * 1.05);
  float core = (1.0 - smoothstep(0.4, 1.3, dist)) * drawn;
  float glow = exp(-dist * 0.18) * 0.28 * drawn * (1.0 + 1.4 * sin(3.14159 * uP));
  col = mix(col, vec3(0.92, 0.22, 0.2), clamp(core + glow, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}`;

export interface Slide {
	src: string;
	small: string;
}

export function createHeroGL(canvas: HTMLCanvasElement, narrow: () => boolean) {
	let ctx;
	try {
		ctx = createGL(canvas, FRAG);
	} catch {
		return null;
	}
	if (!ctx) return null;
	const { gl, u } = ctx;
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

	const tex = () => {
		const t = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 19]));
		return t;
	};
	// Four texture units: current A/B, next A/B. Swapping is just relabelling.
	let cur = [tex(), tex()];
	let next = [tex(), tex()];
	let aspCur = [16 / 9, 16 / 9];
	let aspNext = [16 / 9, 16 / 9];

	const cache = new Map<string, Promise<ImageBitmap>>();
	const bitmap = (url: string) => {
		if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.blob()).then((b) => createImageBitmap(b)));
		return cache.get(url)!;
	};
	const pick = (s: Slide) => (canvas.clientWidth < 1000 ? s.small : s.src);
	const upload = (t: WebGLTexture, bmp: ImageBitmap) => {
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, bmp);
	};

	let p = 0;
	let intro = 0;
	const seam = () => (narrow() ? [0.72, 0.56] : [0.78, 0.38]);

	const draw = (time: number) => {
		const [w, h] = fit(canvas, gl, 0.75);
		const [a, b] = seam();
		gl.uniform2f(u('uRes'), w, h);
		gl.uniform1f(u('uTime'), time);
		gl.uniform1f(u('uP'), p);
		gl.uniform1f(u('uIntro'), intro);
		gl.uniform1f(u('uNarrow'), narrow() ? 1 : 0);
		gl.uniform2f(u('uSeam'), a, b);
		gl.uniform4f(u('uAspCur'), aspCur[0], aspCur[1], 0, 0);
		gl.uniform4f(u('uAspNext'), aspNext[0], aspNext[1], 0, 0);
		[cur[0], cur[1], next[0], next[1]].forEach((t, i) => {
			gl.activeTexture(gl.TEXTURE0 + i);
			gl.bindTexture(gl.TEXTURE_2D, t);
		});
		gl.uniform1i(u('uCurA'), 0);
		gl.uniform1i(u('uCurB'), 1);
		gl.uniform1i(u('uNextA'), 2);
		gl.uniform1i(u('uNextB'), 3);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	};

	return {
		draw,
		/** Show a pair immediately (first paint, reduced motion). */
		async set(pair: [Slide, Slide]) {
			const bmps = await Promise.all(pair.map((s) => bitmap(pick(s))));
			bmps.forEach((b, i) => upload(cur[i], b));
			aspCur = bmps.map((b) => b.width / b.height);
			p = 0;
		},
		/** Decode the next pair into the spare textures; resolves when ready. */
		async load(pair: [Slide, Slide]) {
			const bmps = await Promise.all(pair.map((s) => bitmap(pick(s))));
			bmps.forEach((b, i) => upload(next[i], b));
			aspNext = bmps.map((b) => b.width / b.height);
		},
		preload(pair: [Slide, Slide]) {
			pair.forEach((s) => bitmap(pick(s)).catch(() => {}));
		},
		setProgress(v: number) {
			p = v;
		},
		setIntro(v: number) {
			intro = v;
		},
		/** The incoming pair becomes current. */
		commit() {
			[cur, next] = [next, cur];
			[aspCur, aspNext] = [aspNext, aspCur];
			p = 0;
		},
	};
}
