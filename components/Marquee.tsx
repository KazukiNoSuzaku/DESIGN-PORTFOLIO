"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

type Props = { items: string[]; reverse?: boolean; tone?: "ink" | "paper" };

/** Infinite ticker whose speed and direction follow scroll velocity. */
export default function Marquee({ items, reverse = false, tone = "ink" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = track.current!;
      let x = 0;
      let dir = reverse ? 1 : -1;
      let boost = 0;

      const tick = (_t: number, dt: number) => {
        const v = getLenis()?.velocity ?? 0;
        if (Math.abs(v) > 0.5) dir = (v > 0 ? -1 : 1) * (reverse ? -1 : 1);
        boost += (Math.min(Math.abs(v), 60) * 0.12 - boost) * 0.1;
        const half = el.scrollWidth / 2;
        x += dir * (0.05 + boost * 0.02) * dt;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        gsap.set(el, { x, skewX: -dir * Math.min(boost, 6) });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const row = (key: string) => (
    <div className="marquee__group" key={key} aria-hidden={key === "b"}>
      {items.map((item, i) => (
        <span key={i} className={`marquee__item${i % 2 ? " is-outline" : ""}`}>
          {item}
          <span className="marquee__star">✳</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`marquee tone-${tone}`} ref={root}>
      <div className="marquee__track" ref={track}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
