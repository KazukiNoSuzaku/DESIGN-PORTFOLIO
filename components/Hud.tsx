"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { nav } from "@/content/site";

const TONES = ".tone-ink, .tone-paper";

/** Tone of the section under a viewport point (ignores fixed chrome). */
function toneAt(x: number, y: number) {
  for (const el of document.elementsFromPoint(x, y)) {
    const t = el.closest(TONES);
    if (t) return t.classList.contains("tone-paper") ? "paper" : "ink";
  }
  return "ink";
}

function sectionAt(y: number) {
  for (const el of document.elementsFromPoint(window.innerWidth / 2, y)) {
    const s = el.closest("section[id], footer[id]");
    if (s) return s.id;
  }
  return "index";
}

/**
 * Fixed corner read-outs (cursor XY, scroll %, current section) and the
 * tone detection that lets nav, HUD and cursor stay duotone without blend modes.
 */
export default function Hud() {
  const xy = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const sec = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const mouse = { x: -1, y: -1 };
    let frame = 0;
    let lastSection = "";

    const move = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (xy.current)
        xy.current.textContent = `X ${String(Math.round(e.clientX)).padStart(4, "0")}  Y ${String(Math.round(e.clientY)).padStart(4, "0")}`;
    };

    const tick = () => {
      if (frame++ % 3) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (pct.current) pct.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;

      root.classList.toggle("nav-paper", toneAt(12, 24) === "paper");
      root.classList.toggle("hud-paper", toneAt(12, window.innerHeight - 20) === "paper");
      if (mouse.x >= 0) root.classList.toggle("cursor-paper", toneAt(mouse.x, mouse.y) === "paper");

      const id = sectionAt(window.innerHeight / 2);
      if (id !== lastSection && sec.current) {
        lastSection = id;
        const i = nav.findIndex((n) => n.id === id);
        sec.current.textContent = i >= 0 ? `§${String(i + 1).padStart(2, "0")} ${nav[i].label}` : "";
      }
    };

    window.addEventListener("pointermove", move, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="hud mono" aria-hidden="true">
      <span className="hud__xy" ref={xy}>
        X 0000  Y 0000
      </span>
      <span className="hud__sec" ref={sec} />
      <span className="hud__scroll">
        <span className="hud__track">
          <span className="hud__bar" ref={bar} />
        </span>
        <span ref={pct}>000%</span>
      </span>
    </div>
  );
}
