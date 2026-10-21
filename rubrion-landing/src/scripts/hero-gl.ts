/**
 * Hero slider renderer: both halves of the diagonal in one WebGL canvas.
 *
 * Each half shows its project's screenshot cover-fitted into the box that half
 * can see (top-anchored, so a site's own header and hero are what show). A
 * "single" frame instead shows one project over the whole screen, no seam. On a
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
uniform float uSingleCur; uniform float uSingleNext;  // 1.0: that frame is one full-screen image
// Wide screens anchor the screenshot to its top (the site's own header and
// hero); phones centre it, since only a narrow band of each half shows.
vec2 cover(vec2 local, float boxAsp, float imgAsp){
  vec2 uv = local;
  if (imgAsp > boxAsp) uv.x = (local.x - 0.5) * boxAsp / imgAsp + 0.5;
  else uv.y = mix(local.y, local.y - 0.5, uNarrow) * imgAsp / boxAsp + 0.5 * uNarrow;
  return uv;
}
// A single frame on a phone shows a slice of a wide picture: centre it on the
// right side, where the subject of a showcase image sits.
vec2 coverOne(vec2 local, float boxAsp, float imgAsp, float narrow){
  vec2 uv = cover(local, boxAsp, imgAsp);
  if (imgAsp > boxAsp) {
    float hw = 0.5 * boxAsp / imgAsp;
    uv.x += clamp(mix(0.5, 0.66, narrow), hw, 1.0 - hw) - 0.5;
  }
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

  // A pair: each half in its own box, blurred and shaded behind the copy. A
  // single: one image over the whole screen, with the same light shaped
  // smoothly, so nothing breaks along where the seam would be.
  float fullAsp = uRes.x / uRes.y;
  vec2 full = vec2(x, v);
  float softPair = top ? mix(1.0, 0.25, smoothstep(0.35, 0.85, x)) : 0.0;
  // Phones: soften only behind the copy at the top, not the whole half.
  softPair = mix(softPair, 0.6 * (1.0 - smoothstep(0.3, 0.5, v)), uNarrow);
  float softOne = (1.0 - smoothstep(0.3, 0.8, x)) * (1.0 - smoothstep(0.55, 0.85, v)) * 0.6 * (1.0 - uNarrow);
  softOne = max(softOne, uNarrow * 0.6 * (1.0 - smoothstep(0.3, 0.5, v)));
  // Phones: one vertical gradient, darkest at the top (under the navbar and
  // the copy, so a screenshot's own navbar never competes with ours), clear
  // through the middle, a little darker at the bottom for the captions. No
  // side shading: the slice is narrow enough already.
  float shadePhone = mix(0.2, 1.0, smoothstep(0.06, 0.6, v)) * mix(1.0, 0.62, smoothstep(0.8, 1.0, v));
  float shadePair = mix(
    top
      ? mix(0.13, 0.72, smoothstep(0.05, 0.85, x)) * mix(0.35, 1.0, smoothstep(0.0, 0.18, v))
      : mix(0.8, 0.3, smoothstep(0.5, 1.0, v)),
    shadePhone, uNarrow);
  float shadeOne = mix(
    mix(0.16, 0.8, smoothstep(0.05, 0.8, x)) * mix(0.4, 1.0, smoothstep(0.0, 0.18, v)) * mix(1.0, 0.45, smoothstep(0.65, 1.0, v)),
    shadePhone, uNarrow);
  vec2 px0 = vec2(5.0 / uRes.x, 5.0 / uRes.y) * mix(1.0, 0.4, uNarrow);

  bool oneC = uSingleCur > 0.5;
  bool tC = oneC || top;
  vec2 uvCur = oneC ? coverOne(full, fullAsp, uAspCur.x, uNarrow) : cover(local, boxAsp, top ? uAspCur.x : uAspCur.y);
  vec3 cur = sampleHalf(tC, true, uvCur, px0 * (oneC ? softOne : softPair)) * (oneC ? shadeOne : shadePair);

  bool oneN = uSingleNext > 0.5;
  bool tN = oneN || top;
  vec2 uvNext = oneN ? coverOne(full, fullAsp, uAspNext.x, uNarrow) : cover(local, boxAsp, top ? uAspNext.x : uAspNext.y);
  vec3 nxt = sampleHalf(tN, false, uvNext, px0 * (oneN ? softOne : softPair)) * (oneN ? shadeOne : shadePair);

  vec3 col = mix(cur, nxt, m);

  // The seam: a hairline with a soft red glow, drawn in left to right.
  float W = uRes.x, H = uRes.y;
  float dy = (b - a) * H;
  float dist = abs(v - s) * H * W / sqrt(W * W + dy * dy);
  // No seam over a single frame: it fades with the frame that has none.
  float seamOn = mix(1.0 - uSingleCur, 1.0 - uSingleNext, uP);
  float drawn = step(x, uIntro * 1.05) * seamOn;
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
	let singleCur = 0;
	let singleNext = 0;

	const cache = new Map<string, Promise<ImageBitmap>>();
	const bitmap = (url: string) => {
		if (!cache.has(url)) cache.set(url, fetch(url).then((r) => r.blob()).then((b) => createImageBitmap(b)));
		return cache.get(url)!;
	};
	// A single frame shows a slice of its picture on phones, so it always needs the large one.
	const pick = (s: Slide, single = false) => (canvas.clientWidth < 1000 && !single ? s.small : s.src);
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
		gl.uniform1f(u('uSingleCur'), singleCur);
		gl.uniform1f(u('uSingleNext'), singleNext);
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
		/** Show a frame (a pair, or one slide alone) immediately. */
		async set(frame: Slide[]) {
			const pair = frame.length > 1 ? frame : [frame[0], frame[0]];
			const bmps = await Promise.all(pair.map((s) => bitmap(pick(s, frame.length === 1))));
			bmps.forEach((b, i) => upload(cur[i], b));
			aspCur = bmps.map((b) => b.width / b.height);
			singleCur = frame.length > 1 ? 0 : 1;
			p = 0;
		},
		/** Decode the next frame into the spare textures; resolves when ready. */
		async load(frame: Slide[]) {
			const pair = frame.length > 1 ? frame : [frame[0], frame[0]];
			const bmps = await Promise.all(pair.map((s) => bitmap(pick(s, frame.length === 1))));
			bmps.forEach((b, i) => upload(next[i], b));
			aspNext = bmps.map((b) => b.width / b.height);
			singleNext = frame.length > 1 ? 0 : 1;
		},
		preload(frame: Slide[]) {
			frame.forEach((s) => bitmap(pick(s, frame.length === 1)).catch(() => {}));
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
			[singleCur, singleNext] = [singleNext, singleCur];
			p = 0;
		},
	};
}
