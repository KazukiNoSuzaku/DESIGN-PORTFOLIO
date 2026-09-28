"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { getLenis } from "@/lib/scroll";
import { Enso } from "@/lib/enso";
import { site } from "@/content/site";

/**
 * Wabi-sabi preloader: an ensō is brushed onto washi as the counter climbs
 * 000 → 100, a hanko seal is stamped, then ink blooms out to reveal the site.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const seal = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.display = "none";
        markIntroDone();
        return;
      }

      getLenis()?.stop();
      const q = gsap.utils.selector(el);
      const css = getComputedStyle(document.documentElement);
      const enso = new Enso(canvas.current!, {
        ink: css.getPropertyValue("--ink").trim() || "#0b0b0b",
        paper: css.getPropertyValue("--paper").trim() || "#efefed",
      });

      // The seal sits just off the lower-right of the circle, like a signature.
      const placeSeal = () => {
        const { cx, cy, R } = enso.circle;
        const s = seal.current!;
        s.style.left = `${cx + R * 0.86}px`;
        s.style.top = `${cy + R * 0.62}px`;
      };
      placeSeal();
      const onResize = () => {
        enso.resize();
        placeSeal();
      };
      window.addEventListener("resize", onResize);

      const counter = { v: 0 };
      const bloom = { p: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          el.style.display = "none";
          window.removeEventListener("resize", onResize);
          getLenis()?.start();
        },
      });

      tl.from(q(".preloader__hud .mask > *"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06 })
        .to(
          counter,
          {
            v: 100,
            duration: 3.4,
            // Deliberate press, steady body, quicker lift — how an ensō is painted.
            ease: "power1.inOut",
            onUpdate: () => {
              enso.setProgress(counter.v / 100);
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.35,
        )
        // Stamp the hanko.
        .fromTo(
          seal.current,
          { autoAlpha: 0, scale: 1.35, rotate: -9 },
          { autoAlpha: 1, scale: 1, rotate: -4, duration: 0.32, ease: "power4.in" },
          "+=0.15",
        )
        .to(seal.current, { x: "+=1", y: "+=1", duration: 0.05, yoyo: true, repeat: 1 })
        // Ma — a held pause — then the ink blooms out from the circle.
        .to([q(".preloader__hud"), seal.current], { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, "+=0.6")
        .to(bloom, { p: 1, duration: 1.15, ease: "power2.in", onUpdate: () => enso.bleed(bloom.p) }, "<0.1")
        .add(markIntroDone, "-=0.2")
        .to(el, { autoAlpha: 0, duration: 0.5, ease: "power1.out" });

      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  return (
    <div className="preloader tone-paper" ref={root} aria-hidden="true">
      <canvas className="preloader__canvas" ref={canvas} />

      <div className="preloader__seal" ref={seal}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            {/* Rough, hand-carved edges and uneven ink take. */}
            <filter id="seal-rough" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="4" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" />
            </filter>
            <filter id="seal-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="9" />
              <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.25 1.5" />
              <feComposite in="SourceGraphic" operator="in" />
            </filter>
            <mask id="seal-mask">
              <rect width="100" height="100" fill="white" filter="url(#seal-grain)" />
              <g filter="url(#seal-rough)" fill="black">
                <rect x="11" y="11" width="78" height="78" fill="none" stroke="black" strokeWidth="3" />
                <text x="50" y="66" textAnchor="middle" className="preloader__seal-text">
                  {site.initials}
                </text>
              </g>
            </mask>
          </defs>
          <rect x="4" y="4" width="92" height="92" rx="3" className="preloader__seal-ink" mask="url(#seal-mask)" filter="url(#seal-rough)" />
        </svg>
      </div>

      <div className="preloader__hud">
        <div className="preloader__top">
          <div className="preloader__id">
            <span className="mask">
              <span className="preloader__name">
                {site.name.first} {site.name.last}
              </span>
            </span>
            <span className="mask mono">
              <span>{site.tagline}</span>
            </span>
          </div>
          <span className="mask mono">
            <span>Index — {site.year}</span>
          </span>
        </div>

        <span className="preloader__vertical" lang="ja">
          円相
        </span>

        <div className="preloader__bottom">
          <span className="mask mono">
            <span>
              {site.location} — {site.timezoneLabel}
            </span>
          </span>
          <span className="mask">
            <span className="preloader__count" ref={count}>
              000
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
