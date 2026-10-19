/**
 * Tiny WebGL helpers shared by the ambient background (ambient.ts) and the
 * hero slider (hero-gl.ts): one full-screen triangle, a program, a render
 * loop that only runs while its canvas is on screen and the tab is visible.
 */

/**
 * A software rasteriser (SwiftShader, llvmpipe: no GPU, or a blocklisted one)
 * runs these shaders on the CPU and stalls the page; the CSS fallbacks are
 * better there.
 */
function software(gl: WebGLRenderingContext) {
	// `?gl=force` keeps WebGL on anyway, for reviewing the effects headless.
	if (new URLSearchParams(location.search).get('gl') === 'force') return false;
	const info = gl.getExtension('WEBGL_debug_renderer_info');
	const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
	return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
}

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

/** Value noise + fbm, shared GLSL. */
export const NOISE = `
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
`;

export function createGL(canvas: HTMLCanvasElement, frag: string) {
	const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: new URLSearchParams(location.search).get('gl') !== 'force' });
	if (!gl || software(gl)) return null;
	const shader = (type: number, src: string) => {
		const s = gl.createShader(type)!;
		gl.shaderSource(s, src);
		gl.compileShader(s);
		if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
		return s;
	};
	const prog = gl.createProgram()!;
	gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
	gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, `precision mediump float;\n${frag}`));
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
	gl.useProgram(prog);
	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(prog, 'p');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
	const uniforms = new Map<string, WebGLUniformLocation | null>();
	const u = (name: string) => {
		if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(prog, name));
		return uniforms.get(name)!;
	};
	return { gl, u };
}

/**
 * Keep the canvas backing store matched to its CSS box, at `scale` of the
 * device pixels (ambient art needs far fewer pixels than the screen has).
 */
export function fit(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, scale: number) {
	const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
	const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
	const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
	if (canvas.width !== w || canvas.height !== h) {
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);
	}
	return [w, h] as const;
}

/**
 * Run `frame(t)` on rAF only while the canvas is near the viewport and the
 * tab is visible, at most `fps` times a second. Returns a stop function.
 */
export function loop(canvas: HTMLElement, frame: (t: number) => void, fps = 30) {
	let raf = 0;
	let visible = false;
	let last = 0;
	const step = 1000 / fps;
	const tick = (now: number) => {
		raf = requestAnimationFrame(tick);
		if (now - last < step) return;
		last = now;
		frame(now / 1000);
	};
	const sync = () => {
		const run = visible && !document.hidden;
		if (run && !raf) raf = requestAnimationFrame(tick);
		if (!run && raf) {
			cancelAnimationFrame(raf);
			raf = 0;
		}
	};
	const io = new IntersectionObserver(([e]) => {
		visible = e.isIntersecting;
		sync();
	}, { rootMargin: '120px' });
	io.observe(canvas);
	document.addEventListener('visibilitychange', sync);
	return () => {
		io.disconnect();
		document.removeEventListener('visibilitychange', sync);
		cancelAnimationFrame(raf);
	};
}

export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
