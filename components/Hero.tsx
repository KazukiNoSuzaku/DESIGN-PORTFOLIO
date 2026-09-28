"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { useFluidType } from "@/lib/useFluidType";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import SplitLetters from "./SplitLetters";
import Badge from "./Badge";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** Scale each name line so it spans the full content width, capped by viewport height. */
function useFitName(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const lines = Array.from(el.querySelectorAll<HTMLElement>(".hero__line"));
      const cs = getComputedStyle(el);
      const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const sizes = lines.map((line) => {
        const probe = document.createElement("span");
        probe.textContent = line.getAttribute("aria-label") ?? "";
        Object.assign(probe.style, {
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "nowrap",
          fontFamily: cs.fontFamily,
          fontSize: "100px",
          letterSpacing: cs.letterSpacing === "normal" ? "0" : `${parseFloat(cs.letterSpacing) / parseFloat(cs.fontSize)}em`,
          textTransform: "uppercase",
          fontVariationSettings: '"wdth" 100, "wght" 720',
          fontKerning: "none",
        });
        document.body.appendChild(probe);
        const w = probe.getBoundingClientRect().width;
        probe.remove();
        return (100 * avail) / w;
      });
      // Keep the name within ~64% of the viewport height on short/wide screens.
      const total = sizes.reduce((a, s) => a + s * 0.8, 0);
      const cap = Math.min(1, (window.innerHeight * 0.64) / total);
      lines.forEach((line, i) => (line.style.fontSize = `${sizes[i] * cap * 0.985}px`));
    };

    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(true);

  useFitName(name);

  // Pause the WebGL loop while the hero is off-screen (robust to scroll jumps).
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);
  useFluidType(name, { squeezeRef: progress, conserve: true });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Resolve elements now: the intro callback fires inside the preloader's
        // GSAP context, where selector strings would be scoped to the preloader.
        const q = gsap.utils.selector(root);
        const letters = q(".letter");
        const fades = q(".hero__fade");
        const canvas = q(".hero__canvas-wrap");
        const ticks = q(".hero__ruler");
        gsap.set(letters, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 20 });
        gsap.set(canvas, { autoAlpha: 0, scale: 0.8 });
        gsap.set(ticks, { scaleX: 0 });

        const off = onIntroDone(() => {
          const tl = gsap.timeline({ delay: 0.35 });
          tl.to(letters, { yPercent: 0, duration: 1.6, ease: "expo.out", stagger: 0.035 })
            .to(canvas, { autoAlpha: 1, scale: 1, duration: 2.2, ease: "expo.out" }, 0.1)
            .to(ticks, { scaleX: 1, duration: 1.6, ease: "expo.inOut" }, 0.2)
            .to(fades, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.06 }, 0.6);
        });

        // Scroll: sphere → grid, name squeezes and lifts, tagline lands.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => (progress.current = self.progress),
          },
        });
        tl.to(".hero__intro, .hero__scroll", { autoAlpha: 0, y: -40, ease: "none", duration: 0.25 }, 0)
          .to(".hero__name", { yPercent: -10, ease: "none", duration: 1 }, 0)
          .to(".hero__badge-wrap", { rotate: 90, ease: "none", duration: 1 }, 0)
          .fromTo(
            ".hero__tagline-line",
            { yPercent: 110 },
            { yPercent: 0, ease: "power2.out", duration: 0.25, stagger: 0.05 },
            0.5,
          );

        return off;
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        progress.current = 1;
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero tone-ink" id="index" ref={root}>
      <div className="hero__sticky">
        <div className="hero__canvas-wrap">
          <HeroScene progress={progress} active={active} />
        </div>

        <div className="hero__top">
          <div className="grid mono">
            <span className="hero__fade">§01 — Index</span>
            <span className="hero__fade">{site.role}</span>
            <span className="hero__fade">{site.location}</span>
            <span className="hero__fade hero__coords">{site.coords}</span>
          </div>
          <div className="hero__ruler-row" aria-hidden="true">
            <span className="hero__reg hero__fade" />
            <div className="hero__ruler">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </div>
            <span className="hero__reg hero__fade" />
          </div>
        </div>

        <div className="hero__badge-wrap hero__fade" aria-hidden="true">
          <Badge text="ADAPT • OVERCOME • ALIGN • EST. 2026 • " />
        </div>

        <div className="hero__tagline display" aria-label={site.tagline}>
          {site.tagline.split(" ").map((w, i) => (
            <span className="mask" key={i} aria-hidden="true">
              <span className="hero__tagline-line">{w}</span>
            </span>
          ))}
        </div>

        <div className="hero__bottom">
          <div className="hero__meta grid">
            <p className="hero__intro hero__fade">{site.intro}</p>
            <div className="hero__specs hero__fade mono" aria-hidden="true">
              <span>Type — Archivo Variable</span>
              <span>Axes — wdth 62–125 / wght 100–900</span>
              <span>Grid — 12 col / fluid gutter</span>
            </div>
            <button
              className="hero__scroll hero__fade mono"
              data-cursor="Scroll"
              onClick={() => scrollToTarget("#academia")}
            >
              <span className="hero__scroll-line" />
              Scroll to align
            </button>
          </div>
          <h1 className="hero__name display" ref={name} aria-label={`${site.name.first} ${site.name.last}`}>
            <SplitLetters text={site.name.first} className="hero__line hero__first" />
            <SplitLetters text={site.name.last} className="hero__line hero__last" />
          </h1>
        </div>
      </div>
    </section>
  );
}
