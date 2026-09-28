// Ensō (Zen circle) painted with a simulated sumi brush.
//
// Every bristle's path (positions + where it runs dry) is precomputed once.
// Each frame the scene is redrawn from scratch — paper, then each bristle as a
// single continuous path up to the current progress — so there are no seams
// between frames. Dry-brush gaps (kasure) come from coherent 1D noise
// compared against the bristle's remaining ink.

type Colors = { ink: string; paper: string };

type Bristle = {
  xs: Float32Array;
  ys: Float32Array;
  on: Uint8Array;
  /** Sample indices where the bristle's tone/width steps down as it dries. */
  cuts: [number, number];
  alpha: [number, number, number];
  width: [number, number, number];
};

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 1D value noise in [0, 1]. */
function noise1D(seed: number) {
  const r = rng(seed);
  const lattice = Array.from({ length: 1024 }, () => r());
  return (x: number) => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    const a = lattice[i & 1023];
    const b = lattice[(i + 1) & 1023];
    return a + (b - a) * u;
  };
}

const START = 2.15; // radians, lower-left; the brush travels clockwise
const SWEEP = Math.PI * 2 * 0.9; // leave the circle open
const BRISTLES = 96;
const STEP_PX = 1.4; // sample spacing along the stroke

export class Enso {
  private ctx: CanvasRenderingContext2D;
  private paper = document.createElement("canvas");
  private W = 0;
  private H = 0;
  private dpr = 1;
  private N = 0;
  private bristles: Bristle[] = [];
  private spatter: { t: number; x: number; y: number; r: number; a: number }[] = [];
  private pool: { x: number; y: number; rx: number; ry: number; rot: number; a: number }[] = [];
  private hairs: { x0: number; y0: number; cx: number; cy: number; x1: number; y1: number; w: number; a: number }[] = [];
  private tendrils: { angle: number; len: number; bend: number; w: number; a: number }[] = [];
  private noise = noise1D(3);
  private progress = 0;
  private bloom = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private colors: Colors,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
  }

  /** Circle geometry in CSS pixels. */
  get circle() {
    const R = Math.min(this.W * (this.W < this.H ? 0.36 : 0.3), this.H * 0.3);
    return { cx: this.W / 2, cy: this.H * 0.47, R };
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.W = window.innerWidth;
    this.H = window.innerHeight;
    for (const c of [this.canvas, this.paper]) {
      c.width = Math.round(this.W * this.dpr);
      c.height = Math.round(this.H * this.dpr);
    }
    this.canvas.style.width = `${this.W}px`;
    this.canvas.style.height = `${this.H}px`;
    this.paintPaper();
    this.build();
    this.render();
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
    this.render();
  }

  bleed(p: number) {
    this.bloom = Math.min(1, Math.max(0, p));
    this.render();
  }

  // ── geometry ────────────────────────────────────────────────

  private at(t: number) {
    const { cx, cy, R } = this.circle;
    const theta = START + t * SWEEP;
    // Imperfect radius: breathes a little and spirals slightly inward at the end.
    const r = R * (1 + Math.sin(t * 3.1 + 0.8) * 0.025 + Math.sin(t * 9.7) * 0.006 - t * 0.045);
    // Heavy press at the start, full through the body, lifting at the tail.
    const press = t < 0.05 ? 0.72 + (t / 0.05) * 0.3 : 1.02 - Math.pow(Math.max(0, t - 0.05), 1.7) * 0.62;
    return { theta, half: R * 0.105 * press, x: cx + Math.cos(theta) * r, y: cy + Math.sin(theta) * r };
  }

  /** Precompute every bristle path and all the incidental marks. */
  private build() {
    const rand = rng(11);
    const { R } = this.circle;
    this.N = Math.ceil((SWEEP * R) / STEP_PX) + 1;
    const N = this.N;
    const samples = Array.from({ length: N }, (_, i) => this.at(i / (N - 1)));

    this.bristles = Array.from({ length: BRISTLES }, (_, k) => {
      const off = (k / (BRISTLES - 1)) * 2 - 1 + (rand() - 0.5) * 0.02;
      const edge = Math.abs(off);
      const load = 1.05 + rand() * 0.45 - edge * 0.55;
      const decay = 0.55 + rand() * 0.9 + edge * 0.5;
      const tone = 0.78 + rand() * 0.22;
      const w = 0.75 + rand() * 0.6;
      const seed = rand() * 900;
      const xs = new Float32Array(N);
      const ys = new Float32Array(N);
      const on = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        const t = i / (N - 1);
        const s = samples[i];
        xs[i] = s.x + Math.cos(s.theta) * off * s.half;
        ys[i] = s.y + Math.sin(s.theta) * off * s.half;
        const ink = load - t * decay;
        on[i] = ink > 0.06 && this.noise(seed + t * 38) < 0.35 + ink * 0.9 ? 1 : 0;
      }
      // Tone steps down twice as the bristle dries; cut points differ per
      // bristle so the joins never line up into a visible seam.
      const c1 = 0.3 + rand() * 0.15;
      const c2 = 0.6 + rand() * 0.15;
      const look = (t: number) => {
        const ink = Math.max(0, Math.min(1, load - t * decay));
        return {
          a: Math.min(0.94, (0.3 + ink * 0.7) * tone),
          w: ((R * 0.21) / BRISTLES) * 2.4 * w * (0.5 + ink * 0.6),
        };
      };
      const [s0, s1, s2] = [look(c1 / 2), look((c1 + c2) / 2), look((c2 + 1) / 2)];
      return {
        xs,
        ys,
        on,
        cuts: [Math.round(c1 * (N - 1)), Math.round(c2 * (N - 1))],
        alpha: [s0.a, s1.a, s2.a],
        width: [s0.w, s1.w, s2.w],
      };
    });

    // Ink pooling where the brush presses in, elongated along the stroke.
    const s = this.at(0);
    const tx = -Math.sin(s.theta);
    const ty = Math.cos(s.theta);
    this.pool = Array.from({ length: 18 }, () => {
      const along = rand() * s.half * 0.9;
      const across = (rand() - 0.5) * s.half * 1.2;
      return {
        x: s.x + tx * along + Math.cos(s.theta) * across,
        y: s.y + ty * along + Math.sin(s.theta) * across,
        rx: s.half * (0.25 + rand() * 0.35),
        ry: s.half * (0.5 + rand() * 0.45),
        rot: s.theta,
        a: 0.05 + rand() * 0.08,
      };
    });

    // Spatter flicking off as the brush speeds up and lifts.
    this.spatter = [];
    for (let t = 0.7; t < 1; t += 0.012) {
      if (rand() > 0.3) continue;
      const a = this.at(t);
      const d = a.half * (1.3 + rand() * 2.2) * (rand() < 0.5 ? -1 : 1);
      this.spatter.push({ t, x: a.x + Math.cos(a.theta) * d, y: a.y + Math.sin(a.theta) * d, r: 0.5 + rand() * 2, a: 0.35 + rand() * 0.5 });
    }

    // Hair-thin bristles trailing off the tangent as the brush leaves.
    const e = this.at(1);
    const ex = -Math.sin(e.theta);
    const ey = Math.cos(e.theta);
    this.hairs = Array.from({ length: 9 }, () => {
      const off = (rand() * 2 - 1) * e.half * 0.8;
      const len = 14 + rand() * 46;
      const x0 = e.x + Math.cos(e.theta) * off;
      const y0 = e.y + Math.sin(e.theta) * off;
      const curl = (rand() - 0.5) * 0.35;
      return {
        x0,
        y0,
        cx: x0 + ex * len * 0.5 + Math.cos(e.theta) * len * curl,
        cy: y0 + ey * len * 0.5 + Math.sin(e.theta) * len * curl,
        x1: x0 + ex * len,
        y1: y0 + ey * len - len * 0.08,
        w: 0.4 + rand() * 0.9,
        a: 0.25 + rand() * 0.45,
      };
    });

    this.tendrils = Array.from({ length: 90 }, () => ({
      angle: rand() * Math.PI * 2,
      len: 0.04 + rand() * 0.14,
      bend: (rand() - 0.5) * 0.12,
      w: 0.5 + rand() * 1.4,
      a: 0.18 + rand() * 0.3,
    }));
  }

  // ── washi ───────────────────────────────────────────────────

  private paintPaper() {
    const c = this.paper.getContext("2d")!;
    const { W, H } = this;
    const r = rng(29);
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.globalAlpha = 1;
    c.fillStyle = this.colors.paper;
    c.fillRect(0, 0, W, H);
    c.strokeStyle = this.colors.ink;
    c.fillStyle = this.colors.ink;
    // Long kozo fibres and short pulp flecks.
    for (let i = 0; i < (W * H) / 1400; i++) {
      const x = r() * W;
      const y = r() * H;
      const long = r() < 0.25;
      const len = long ? 30 + r() * 90 : 4 + r() * 16;
      const a = r() * Math.PI;
      c.globalAlpha = long ? 0.018 + r() * 0.02 : 0.03 + r() * 0.04;
      c.lineWidth = 0.35 + r() * 0.5;
      c.beginPath();
      c.moveTo(x, y);
      c.bezierCurveTo(
        x + Math.cos(a) * len * 0.33 + (r() - 0.5) * 10,
        y + Math.sin(a) * len * 0.33 + (r() - 0.5) * 10,
        x + Math.cos(a) * len * 0.66 + (r() - 0.5) * 10,
        y + Math.sin(a) * len * 0.66 + (r() - 0.5) * 10,
        x + Math.cos(a) * len,
        y + Math.sin(a) * len,
      );
      c.stroke();
    }
    for (let i = 0; i < (W * H) / 260; i++) {
      c.globalAlpha = 0.015 + r() * 0.045;
      const s = r() < 0.9 ? 0.6 : 1.4;
      c.fillRect(r() * W, r() * H, s, s);
    }
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) * 0.6);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.08)");
    c.globalAlpha = 1;
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
  }

  // ── rendering ───────────────────────────────────────────────

  private render() {
    const c = this.ctx;
    const p = this.progress;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = 1;
    c.drawImage(this.paper, 0, 0);
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (p <= 0) return;
    c.fillStyle = this.colors.ink;
    c.strokeStyle = this.colors.ink;
    c.lineCap = "round";
    c.lineJoin = "round";

    for (const e of this.pool) {
      c.globalAlpha = e.a;
      c.beginPath();
      c.ellipse(e.x, e.y, e.rx, e.ry, e.rot, 0, Math.PI * 2);
      c.fill();
    }

    const last = p * (this.N - 1);
    const end = Math.floor(last);
    const frac = last - end;

    // Faint wet halo around the loaded part of the stroke.
    const haloEnd = Math.min(end, Math.floor(0.6 * (this.N - 1)));
    if (haloEnd > 1) {
      // Layered washes (widest faintest) read as ink soaking into the fibres.
      const mid = this.bristles[BRISTLES >> 1];
      c.beginPath();
      c.moveTo(mid.xs[0], mid.ys[0]);
      for (let i = 1; i <= haloEnd; i += 3) c.lineTo(mid.xs[i], mid.ys[i]);
      for (const [w, a] of [
        [0.3, 0.012],
        [0.26, 0.016],
        [0.23, 0.02],
      ]) {
        c.globalAlpha = a;
        c.lineWidth = this.circle.R * w;
        c.stroke();
      }
    }

    for (const b of this.bristles) {
      const bounds = [0, b.cuts[0], b.cuts[1], this.N - 1];
      for (let s = 0; s < 3; s++) {
        const from = bounds[s];
        const to = Math.min(bounds[s + 1], end);
        if (from > end) break;
        let pen = false;
        c.beginPath();
        for (let i = from; i <= to; i++) {
          if (!b.on[i]) {
            pen = false;
            continue;
          }
          if (pen) c.lineTo(b.xs[i], b.ys[i]);
          else c.moveTo(b.xs[i], b.ys[i]);
          pen = true;
        }
        // Interpolated tip so the stroke advances smoothly between samples.
        if (to === end && end < this.N - 1 && pen && b.on[end + 1]) {
          c.lineTo(b.xs[end] + (b.xs[end + 1] - b.xs[end]) * frac, b.ys[end] + (b.ys[end + 1] - b.ys[end]) * frac);
        }
        c.globalAlpha = b.alpha[s];
        c.lineWidth = b.width[s];
        c.stroke();
      }
    }

    for (const d of this.spatter) {
      if (d.t > p) break;
      c.globalAlpha = d.a;
      c.beginPath();
      c.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      c.fill();
    }

    if (p >= 1) {
      for (const h of this.hairs) {
        c.globalAlpha = h.a;
        c.lineWidth = h.w;
        c.beginPath();
        c.moveTo(h.x0, h.y0);
        c.quadraticCurveTo(h.cx, h.cy, h.x1, h.y1);
        c.stroke();
      }
    }

    if (this.bloom > 0) this.drawBloom();
    c.globalAlpha = 1;
  }

  /** Exit: ink blooms out from the centre, wicking along the fibres. */
  private drawBloom() {
    const c = this.ctx;
    const n = this.noise;
    const { cx, cy } = this.circle;
    const maxR = Math.hypot(Math.max(cx, this.W - cx), Math.max(cy, this.H - cy)) * 1.2;
    const r = maxR * this.bloom;
    // Layered wobble sampled via cos/sin so the outline closes without a seam.
    const band = (a: number, f: number, o: number) =>
      (n(o + (Math.cos(a) + 1) * f) + n(o + 300 + (Math.sin(a) + 1) * f)) / 2 - 0.5;
    const edge = (a: number) => 1 + band(a, 1.2, 200) * 0.34 + band(a, 3.4, 500) * 0.16 + band(a, 12, 800) * 0.05;
    const blot = (scale: number) => {
      c.beginPath();
      for (let i = 0; i <= 360; i++) {
        const a = (i / 360) * Math.PI * 2;
        const k = r * edge(a) * scale;
        if (i === 0) c.moveTo(cx + Math.cos(a) * k, cy + Math.sin(a) * k);
        else c.lineTo(cx + Math.cos(a) * k, cy + Math.sin(a) * k);
      }
      c.closePath();
      c.fill();
    };
    // Wet fringe: stacked translucent rings instead of a costly blur.
    for (const [scale, alpha] of [
      [1.14, 0.06],
      [1.09, 0.08],
      [1.05, 0.12],
      [1.02, 0.25],
      [1, 1],
    ]) {
      c.globalAlpha = alpha;
      blot(scale);
    }
    for (const t of this.tendrils) {
      const k = r * edge(t.angle) * 0.99;
      const len = r * t.len;
      c.globalAlpha = t.a;
      c.lineWidth = t.w;
      c.beginPath();
      c.moveTo(cx + Math.cos(t.angle) * k, cy + Math.sin(t.angle) * k);
      c.quadraticCurveTo(
        cx + Math.cos(t.angle + t.bend) * (k + len * 0.5),
        cy + Math.sin(t.angle + t.bend) * (k + len * 0.5),
        cx + Math.cos(t.angle + t.bend * 1.6) * (k + len),
        cy + Math.sin(t.angle + t.bend * 1.6) * (k + len),
      );
      c.stroke();
    }
  }
}
