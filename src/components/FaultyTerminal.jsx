import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform vec3 iResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
uniform float uBottomFade;

// Hash / noise functions
float hash21(vec2 p){p=fract(p*234.56);p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){ return sin(p.x*10.)*sin(p.y*(3.+sin(iTime*0.090909)))+0.2; }
mat2 rotate(float a){ float c=cos(a); float s=sin(a); return mat2(c,-s,s,c); }
float fbm(vec2 p){
  p*=1.1; float f=0.; float amp=0.5*uNoiseAmp;
  mat2 m=rotate(iTime*0.02);
  f+=amp*noise(p); p=m*p*2.; amp*=0.454545;
  m=rotate(iTime*0.02); f+=amp*noise(p); p=m*p*2.; amp*=0.454545;
  m=rotate(iTime*0.08); f+=amp*noise(p);
  return f;
}
float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 o1=vec2(1.), o0=vec2(0.);
  mat2 r01=rotate(0.1*iTime); mat2 r1=rotate(0.1);
  q=vec2(fbm(p+o1), fbm(r01*p+o1));
  r=vec2(fbm(r1*q+o0), fbm(q+o0));
  return fbm(p+r);
}
float digit(vec2 p){
  vec2 grid=uGridMul*15.; vec2 s=floor(p*grid)/grid; p*=grid;
  vec2 q,r; float intensity=pattern(s*0.1,q,r)*1.3-0.03;
  if(uUseMouse>0.5){
    vec2 mw=uMouse*uScale; float dist=distance(s,mw);
    float mi=exp(-dist*8.)*uMouseStrength*10.; intensity+=mi;
    float ripple=sin(dist*20.-iTime*5.)*0.1*mi; intensity+=ripple;
  }
  if(uUsePageLoadAnimation>0.5){
    float cr=fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);
    float cd=cr*0.8; float cp=clamp((uPageLoadProgress-cd)/0.2,0.,1.);
    intensity*=smoothstep(0.,1.,cp);
  }
  p=fract(p)*uDigitSize;
  float px5=p.x*5.; float py5=(1.-p.y)*5.;
  float i=floor(py5)-2.; float j=floor(px5)-2.;
  float n=i*i+j*j; float f=n*0.0625;
  float isOn=step(0.1,intensity-f);
  return step(0.,p.x)*step(p.x,1.)*step(0.,p.y)*step(p.y,1.)*(isOn*(0.2+p.y*0.8)*(0.75+p.x*0.25));
}
float onOff(float a,float b,float c){ return step(c,sin(iTime+a*cos(iTime*b)))*uFlickerAmount; }
float displace(vec2 look){
  float y=look.y-mod(iTime*0.25,1.); float w=1./(1.+50.*y*y);
  return sin(look.y*20.+iTime)*0.0125*onOff(4.,2.,0.8)*(1.+cos(iTime*60.))*w;
}
vec3 getColor(vec2 p){
  float bar=step(mod(p.y+iTime*20.,1.),0.2)*0.4+1.; bar*=uScanlineIntensity;
  float disp=displace(p); p.x+=disp;
  if(uGlitchAmount!=1.){ p.x+=disp*(uGlitchAmount-1.); }
  float mid=digit(p);
  const float off=0.002;
  float sum=digit(p+vec2(-off,-off))+digit(p+vec2(0.,-off))+digit(p+vec2(off,-off))+
            digit(p+vec2(-off,0.))+digit(p+vec2(0.,0.))+digit(p+vec2(off,0.))+
            digit(p+vec2(-off,off))+digit(p+vec2(0.,off))+digit(p+vec2(off,off));
  return vec3(0.9)*mid + sum*0.1*vec3(1.)*bar;
}
vec2 barrel(vec2 uv){ vec2 c=uv*2.-1.; float r2=dot(c,c); c*=(1.+uCurvature*r2); return c*0.5+0.5; }
void main(){
  vec2 uv=vUv; float time=iTime*0.3333;
  if(uCurvature!=0.) uv=barrel(uv);
  vec2 p=uv*uScale; vec3 col=getColor(p);
  if(uChromaticAberration!=0.){
    vec2 ca=vec2(uChromaticAberration)/iResolution.xy;
    col.r=getColor(p+ca).r;
    col.b=getColor(p-ca).b;
  }
  col*=uTint*uBrightness;
  if(uDither>0.){ float rnd=hash21(gl_FragCoord.xy); col+=(rnd-0.5)*(uDither*0.003922); }
  float fade=smoothstep(1.-uBottomFade,1.,vUv.y);
  col*=fade;
  gl_FragColor=vec4(col,1.);
}
`;

function hexToRgb(hex) {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(c => c+c).join('');
    const num = parseInt(h, 16);
    return [((num >> 16) & 255)/255, ((num >> 8) & 255)/255, (num & 255)/255];
}

export default function FaultyTerminal({
                                           scale = 1,
                                           gridMul = [2, 1],
                                           digitSize = 1.5,
                                           timeScale = 0.3,
                                           pause = false,
                                           scanlineIntensity = 0.3,
                                           glitchAmount = 1,
                                           flickerAmount = 1,
                                           noiseAmp = 1,
                                           chromaticAberration = 0,
                                           dither = 0,
                                           curvature = 0.2,
                                           tint = '#ffffff',
                                           mouseReact = true,
                                           mouseStrength = 0.2,
                                           dpr = Math.min(window.devicePixelRatio || 1, 2),
                                           pageLoadAnimation = true,
                                           brightness = 1,
                                           bottomFade = 0.2,
                                           className,
                                           style,
                                           ...rest
                                       }) {
    const containerRef = useRef(null);
    const geometryRef = useRef(null);
    const meshRef = useRef(null);
    const programRef = useRef(null);
    const rendererRef = useRef(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
    const frozenTimeRef = useRef(0);
    const rafRef = useRef(0);
    const loadAnimationStartRef = useRef(0);
    const timeOffsetRef = useRef(Math.random() * 100);

    const tintVec = useMemo(() => hexToRgb(tint), [tint]);
    const ditherValue = useMemo(() => typeof dither === 'boolean' ? (dither ? 1 : 0) : dither, [dither]);

    const handleMouseMove = useCallback(e => {
        const ctn = containerRef.current;
        if (!ctn) return;
        const rect = ctn.getBoundingClientRect();
        mouseRef.current = {
            x: (e.clientX - rect.left) / rect.width,
            y: 1 - (e.clientY - rect.top) / rect.height
        };
    }, []);

    useEffect(() => {
        const ctn = containerRef.current;
        if (!ctn) return;

        const renderer = new Renderer({ dpr });
        rendererRef.current = renderer;
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 1);

        geometryRef.current = new Triangle(gl);
        programRef.current = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height]) },
                uScale: { value: scale },
                uGridMul: { value: new Float32Array(gridMul) },
                uDigitSize: { value: digitSize },
                uScanlineIntensity: { value: scanlineIntensity },
                uGlitchAmount: { value: glitchAmount },
                uFlickerAmount: { value: flickerAmount },
                uNoiseAmp: { value: noiseAmp },
                uChromaticAberration: { value: chromaticAberration },
                uDither: { value: ditherValue },
                uCurvature: { value: curvature },
                uTint: { value: new Float32Array(tintVec) },
                uMouse: { value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y]) },
                uMouseStrength: { value: mouseStrength },
                uUseMouse: { value: mouseReact ? 1 : 0 },
                uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
                uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
                uBrightness: { value: brightness },
                uBottomFade: { value: bottomFade }
            }
        });

        meshRef.current = new Mesh(gl, { geometry: geometryRef.current, program: programRef.current });

        function resize() {
            if (!ctn || !rendererRef.current || !programRef.current) return;
            const w = ctn.offsetWidth;
            const h = ctn.offsetHeight;
            rendererRef.current.setSize(w, h);
            programRef.current.uniforms.iResolution.value.set([w, h, w / h]);
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(ctn);
        resize();

        const update = t => {
            rafRef.current = requestAnimationFrame(update);
            if (pageLoadAnimation && loadAnimationStartRef.current === 0) loadAnimationStartRef.current = t;
            if (!programRef.current) return;

            if (!pause) {
                const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale;
                programRef.current.uniforms.iTime.value = elapsed;
                frozenTimeRef.current = elapsed;
            } else {
                programRef.current.uniforms.iTime.value = frozenTimeRef.current;
            }

            if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
                const prog = Math.min((t - loadAnimationStartRef.current) / 2000, 1);
                programRef.current.uniforms.uPageLoadProgress.value = prog;
            }

            if (mouseReact) {
                const sm = smoothMouseRef.current;
                const m = mouseRef.current;
                sm.x += (m.x - sm.x) * 0.08;
                sm.y += (m.y - sm.y) * 0.08;
                programRef.current.uniforms.uMouse.value.set([sm.x, sm.y]);
            }

            if (rendererRef.current && meshRef.current) {
                rendererRef.current.render({ scene: meshRef.current });
            }
        };

        rafRef.current = requestAnimationFrame(update);
        ctn.appendChild(gl.canvas);
        if (mouseReact) ctn.addEventListener('mousemove', handleMouseMove);

        return () => {
            // Stop animation
            cancelAnimationFrame(rafRef.current);

            // Stop observing container size
            resizeObserver.disconnect();

            // Remove mouse listener
            if (mouseReact && ctn) ctn.removeEventListener('mousemove', handleMouseMove);

            // Remove the WebGL canvas
            if (ctn && gl.canvas.parentElement === ctn) {
                ctn.removeChild(gl.canvas);
            }

            // Null references so GC can clean up
            meshRef.current = null;
            programRef.current = null;
            geometryRef.current = null;
            rendererRef.current = null;
        };

    }, [
        dpr, pause, timeScale, scale, gridMul, digitSize,
        scanlineIntensity, glitchAmount, flickerAmount, noiseAmp,
        chromaticAberration, ditherValue, curvature, tintVec,
        mouseReact, mouseStrength, pageLoadAnimation, brightness,
        bottomFade, handleMouseMove
    ]);

    return <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`} style={style} {...rest} />;
}
