"use client";

import { useEffect, useRef } from "react";
import { formatCoords, site } from "@/content/site";
import { getLenis } from "@/lib/scroll";

const COLS = 64;
const ROWS = 32;
const RAMP = " .,:;-=+*#%@";
const DEG = Math.PI / 180;
const TILT = 0.38;

const cities = site.travel.places.map((p) => ({
  name: p.place,
  lat: p.lat * DEG,
  lon: p.lon * DEG,
  coords: formatCoords(p.lat, p.lon),
}));

/** Rotating ASCII globe with graticule; visited cities burn through as "@". */
export default function AsciiGlobe() {
  const pre = useRef<HTMLPreElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = pre.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rot = -0.3;
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let lastCity = "";

    const light = { x: -0.55, y: 0.45, z: 0.7 };
    const ll = Math.hypot(light.x, light.y, light.z);
    light.x /= ll;
    light.y /= ll;
    light.z /= ll;

    const render = () => {
      const cosT = Math.cos(TILT);
      const sinT = Math.sin(TILT);
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      let out = "";
      let front = { name: "", z: -2, coords: "" };

      // Project visited cities into screen space for this frame.
      const marks = cities.map((c) => {
        const x0 = Math.cos(c.lat) * Math.sin(c.lon);
        const y0 = Math.sin(c.lat);
        const z0 = Math.cos(c.lat) * Math.cos(c.lon);
        // rotate around Y by rot, then tilt around X
        const x1 = x0 * cosR + z0 * sinR;
        const z1 = -x0 * sinR + z0 * cosR;
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;
        if (z2 > front.z) front = { name: c.name, z: z2, coords: c.coords };
        return { col: Math.round(((x1 + 1) / 2) * COLS - 0.5), row: Math.round(((1 - y2) / 2) * ROWS - 0.5), z: z2 };
      });

      for (let j = 0; j < ROWS; j++) {
        const y = 1 - (2 * (j + 0.5)) / ROWS;
        for (let i = 0; i < COLS; i++) {
          const x = (2 * (i + 0.5)) / COLS - 1;
          const r2 = x * x + y * y;
          if (r2 > 1) {
            out += r2 < 1.06 ? "·" : " ";
            continue;
          }
          const z = Math.sqrt(1 - r2);
          const mark = marks.find((m) => m.z > 0.05 && m.col === i && m.row === j);
          if (mark) {
            out += "@";
            continue;
          }
          // undo tilt, then undo rotation → point in globe space
          const y1 = y * cosT + z * sinT;
          const z1 = -y * sinT + z * cosT;
          const gx = x * cosR - z1 * sinR;
          const gz = x * sinR + z1 * cosR;
          const lat = Math.asin(Math.max(-1, Math.min(1, y1)));
          const lon = Math.atan2(gx, gz);

          const b = Math.max(0, x * light.x + y * light.y + z * light.z);
          const onLat = Math.abs(((lat / DEG + 90) % 30) - 15) > 13.4;
          const onLon = Math.abs((((lon / DEG + 360) % 30) + 30) % 30 - 15) > 13.6;
          if (onLat || onLon) {
            out += b > 0.15 ? (onLat && onLon ? "+" : onLat ? "-" : "|") : ":";
            continue;
          }
          out += RAMP[Math.min(RAMP.length - 1, Math.floor(b * b * 7))];
        }
        out += "\n";
      }
      el.textContent = out;
      if (label.current && front.name !== lastCity) {
        lastCity = front.name;
        label.current.textContent = `→ ${front.name.toUpperCase()}  ${front.coords}`;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(64, now - last);
      last = now;
      if (!visible) return;
      const v = getLenis()?.velocity ?? 0;
      rot += dt * (0.00035 + Math.min(Math.abs(v), 60) * 0.00004);
      acc += dt;
      if (acc < 40) return; // ~25fps is plenty for ASCII
      acc = 0;
      render();
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    render();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <figure className="ascii-globe">
      <pre className="ascii-globe__pre" ref={pre} aria-hidden="true" />
      <figcaption className="ascii-globe__cap mono">
        <span>Fig. 03 — Visited</span>
        <span ref={label} />
        <span>
          {cities.length} cities / {new Set(site.travel.places.map((p) => p.country)).size} countries
        </span>
      </figcaption>
    </figure>
  );
}
