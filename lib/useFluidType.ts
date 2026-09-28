"use client";

import { useEffect, type RefObject } from "react";

type Options = {
  /** 0..1 value that compresses the letters (e.g. scroll progress). */
  squeezeRef?: RefObject<number>;
  baseWidth?: number;
  baseWeight?: number;
  /** Keep each line's total width constant: letters near the cursor widen,
   *  the rest narrow to compensate (accordion). */
  conserve?: boolean;
};

/**
 * Letters marked with [data-letter] widen and thicken near the cursor,
 * using Archivo's variable width + weight axes.
 */
export function useFluidType(containerRef: RefObject<HTMLElement | null>, opts: Options = {}) {
  const { squeezeRef, baseWidth = 100, baseWeight = 720, conserve = false } = opts;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-letter]"));
    const state = letters.map(() => ({ w: baseWidth, g: baseWeight, cx: 0, cy: 0 }));
    // Group letters by line (SplitLetters wrapper) for width conservation.
    const lineOf = letters.map((el) => el.parentElement?.parentElement ?? container);
    const groups = Array.from(new Set(lineOf)).map((line) =>
      letters.map((_, i) => i).filter((i) => lineOf[i] === line),
    );
    const tw = new Array<number>(letters.length).fill(baseWidth);
    const tg = new Array<number>(letters.length).fill(baseWeight);
    const maxWeight = conserve ? 860 : 900;
    const mouse = { x: -9999, y: -9999 };
    let visible = false;
    let raf = 0;

    const measure = () => {
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        state[i].cx = r.left + r.width / 2;
        state[i].cy = r.top + r.height / 2;
      });
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      measure(); // letters move with scroll, so read positions before writing
      const squeeze = squeezeRef?.current ?? 0;
      const sigma = window.innerWidth * 0.11;
      const base = baseWidth - squeeze * 38;
      letters.forEach((_, i) => {
        const s = state[i];
        const dx = mouse.x - s.cx;
        const dy = (mouse.y - s.cy) * 0.6;
        const influence = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
        tw[i] = base + (125 - base) * influence;
        tg[i] = baseWeight + (maxWeight - baseWeight) * influence - squeeze * 250;
      });
      if (conserve) {
        groups.forEach((g) => {
          const mean = g.reduce((a, i) => a + tw[i], 0) / g.length;
          g.forEach((i) => (tw[i] = Math.max(62, Math.min(125, (tw[i] * base) / mean))));
        });
      }
      letters.forEach((el, i) => {
        const s = state[i];
        s.w += (tw[i] - s.w) * 0.12;
        s.g += (tg[i] - s.g) * 0.12;
        el.style.fontVariationSettings = `"wdth" ${s.w.toFixed(1)}, "wght" ${s.g.toFixed(0)}`;
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) measure();
    });
    io.observe(container);

    measure();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, squeezeRef, baseWidth, baseWeight, conserve]);
}
