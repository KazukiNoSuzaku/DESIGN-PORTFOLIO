"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import Clock from "./Clock";

// "Adapt, Improvise and Align" → three stepped lines.
const STEPS = ["Adapt,", "Improvise", "and Align"];

/** Size the name so that, once aligned, it spans ~9 of 12 columns (full width on mobile). */
function useFitName(ref: React.RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const box = el.parentElement!;
      const cs = getComputedStyle(box);
      const inner = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const avail = inner * (window.innerWidth < 900 ? 1 : 0.72); // desktop: ~9 of 12 columns
      const word = el.firstElementChild as HTMLElement; // the inline-block word, not the full-width h1
      el.style.fontSize = "100px";
      el.style.fontSize = `${Math.min((99 * avail) / word.offsetWidth, (window.innerHeight * 0.4) / 0.8)}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

/**
 * Swiss poster hero. It opens misaligned — tagline stepped across the grid,
 * name oversized and bleeding off the edges — and scrolling pulls everything
 * into one flush-left column: the page literally aligns.
 * One CSS variable drives it all: --k (1 = stepped, 0 = aligned).
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useFitName(name);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // Resolve now: the intro callback fires inside the preloader's GSAP context.
        const q = gsap.utils.selector(root);
        const rise = q(".hero__rise");
        const fades = q(".hero__fade");
        gsap.set(rise, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 16 });

        const off = onIntroDone(() => {
          gsap
            .timeline({ delay: 0.3 })
            .to(rise, { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.08 })
            .to(fades, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.05 }, 0.4);
        });

        gsap.fromTo(
          root.current,
          { "--k": 1 },
          {
            "--k": 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              onUpdate: (self) => {
                if (readout.current) readout.current.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
              },
            },
          },
        );

        return off;
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(root.current, { "--k": 0 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero tone-ink" id="index" ref={root}>
      <div className="hero__sticky">
        <div className="hero__facts grid mono">
          <span className="hero__fade">{site.role}</span>
          <span className="hero__fade">{site.location}</span>
          <span className="hero__fade">
            <Clock /> {site.timezoneLabel}
          </span>
          <span className="hero__fade">Index / {site.year}</span>
        </div>

        <p className="hero__steps display" aria-label={site.tagline}>
          {STEPS.map((w, i) => (
            <span className="hero__step" key={w} style={{ "--n": i } as React.CSSProperties} aria-hidden="true">
              <span className="mask">
                <span className="hero__rise">
                  <sup className="mono">0{i + 1}</sup>
                  {w}
                </span>
              </span>
            </span>
          ))}
        </p>

        <div className="hero__foot">
          <h1 className="hero__name display" ref={name} aria-label={`${site.name.first} ${site.name.last}`}>
            <span className="hero__rise hero__word" aria-hidden="true">
              {site.name.first}
            </span>
          </h1>
        </div>

        <button className="hero__scroll hero__fade mono" data-cursor="Scroll" onClick={() => scrollToTarget("#academia")}>
          Scroll to align — <span ref={readout}>000</span>%
        </button>
      </div>
    </section>
  );
}
