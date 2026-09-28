"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 120;
const ROWS = 64;

// Ashima simplex noise (MIT)
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uRadius;
uniform float uSize;
uniform float uPixelRatio;
uniform vec2 uGrid;
uniform vec3 uMouse;
attribute vec3 aGrid;
attribute float aRand;
varying float vAlpha;
${noise}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
void main(){
  // Organic state: a breathing noise sphere
  float n = snoise(position * 1.4 + vec3(uTime * 0.18));
  vec3 sph = position * uRadius * (1.0 + 0.28 * n);
  sph = rotY(uTime * 0.14) * rotX(0.35) * sph;

  // Ordered state: the Swiss grid
  vec3 grid = vec3(aGrid.xy * uGrid, 0.0);
  grid.z = sin(aGrid.x * 14.0 + uTime * 1.1) * cos(aGrid.y * 9.0 + uTime * 0.8) * 0.06;

  float t = clamp(uProgress * 1.5 - aRand * 0.5, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 pos = mix(sph, grid, t);

  // Cursor pushes points away
  vec2 d = pos.xy - uMouse.xy;
  float f = smoothstep(1.3, 0.0, length(d));
  pos.xy += normalize(d + 0.0001) * f * 0.5;
  pos.z += f * 0.8;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float s = mix(0.8 + aRand * 1.8, 1.2 + f * 2.0, t);
  gl_PointSize = uSize * s * uPixelRatio / -mv.z;
  float depth = smoothstep(-uRadius * 1.2, uRadius * 1.2, sph.z);
  vAlpha = mix(0.18 + 0.82 * depth, 0.55 + f * 0.45, t);
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(uColor, smoothstep(0.5, 0.3, d) * vAlpha);
}`;

type Refs = {
  progress: RefObject<number>;
  mouse: RefObject<{ x: number; y: number; active: boolean }>;
};

function Field({ progress, mouse }: Refs) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const geometry = useMemo(() => {
    const count = COLS * ROWS;
    const sphere = new Float32Array(count * 3);
    const grid = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      sphere.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
      const c = i % COLS;
      const row = Math.floor(i / COLS);
      grid.set([c / (COLS - 1) - 0.5, 0.5 - row / (ROWS - 1), 0], i * 3);
      rand[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sphere, 3));
    g.setAttribute("aGrid", new THREE.BufferAttribute(grid, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uRadius: { value: 1.6 },
      uSize: { value: 16 },
      uPixelRatio: { value: 1 },
      uGrid: { value: new THREE.Vector2(8, 4.5) },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uColor: { value: new THREE.Color().setStyle("#efefed", THREE.LinearSRGBColorSpace) },
    }),
    [],
  );

  // Points take the site's light colour (--paper).
  useEffect(() => {
    const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
    // Raw shader: keep sRGB values untouched so the dots match the CSS colour exactly.
    if (paper) material.current?.uniforms.uColor.value.setStyle(paper, THREE.LinearSRGBColorSpace);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const u = material.current?.uniforms as typeof uniforms | undefined;
    if (!u) return;
    u.uTime.value += delta;
    u.uProgress.value += ((progress.current ?? 0) - u.uProgress.value) * 0.08;
    u.uPixelRatio.value = gl.getPixelRatio();
    // Smaller on portrait screens so the name stays the dominant element.
    u.uRadius.value = Math.min(viewport.width, viewport.height) * (viewport.aspect < 1 ? 0.27 : 0.34);
    u.uGrid.value.set(viewport.width * 0.92, viewport.height * 0.84);
    const m = mouse.current;
    const tx = m?.active ? (m.x * viewport.width) / 2 : 99;
    const ty = m?.active ? (m.y * viewport.height) / 2 : 99;
    u.uMouse.value.x += (tx - u.uMouse.value.x) * 0.1;
    u.uMouse.value.y += (ty - u.uMouse.value.y) * 0.1;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene({ progress, active }: { progress: RefObject<number>; active: boolean }) {
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.current.active = e.pointerType === "mouse";
    };
    const leave = () => (mouse.current.active = false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <Canvas
      className="hero__canvas"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      aria-hidden
    >
      <Field progress={progress} mouse={mouse} />
    </Canvas>
  );
}
