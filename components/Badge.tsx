"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";

/** Rotating circular text stamp; spins faster with scroll velocity. */
export default function Badge({ text, className = "" }: { text: string; className?: string }) {
  const ring = useRef<SVGGElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let rot = 0;
    const tick = (_t: number, dt: number) => {
      const v = getLenis()?.velocity ?? 0;
      rot += (0.012 + Math.min(Math.abs(v), 80) * 0.004) * dt * (v < 0 ? -1 : 1);
      ring.current?.setAttribute("transform", `rotate(${rot % 360} 60 60)`);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  });

  return (
    <svg className={`badge ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <g ref={ring}>
        <text className="badge__text">
          <textPath href="#badge-circle" textLength="289">
            {text}
          </textPath>
        </text>
      </g>
      <path d="M60 46v28M46 60h28M50 50l20 20M70 50L50 70" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
