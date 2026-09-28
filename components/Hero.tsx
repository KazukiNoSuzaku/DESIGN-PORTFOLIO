"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { useFluidType } from "@/lib/useFluidType";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import SplitLetters from "./SplitLetters";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(true);

  useFluidType(name, { squeezeRef: progress });

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
        gsap.set(letters, { yPercent: 110 });
        gsap.set(fades, { autoAlpha: 0, y: 20 });
        gsap.set(canvas, { autoAlpha: 0, scale: 0.8 });

        const off = onIntroDone(() => {
          const tl = gsap.timeline({ delay: 0.35 });
          tl.to(letters, { yPercent: 0, duration: 1.6, ease: "expo.out", stagger: 0.035 })
            .to(canvas, { autoAlpha: 1, scale: 1, duration: 2.2, ease: "expo.out" }, 0.1)
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
            onToggle: (self) => setActive(self.isActive || self.progress < 1),
          },
        });
        tl.to(".hero__intro, .hero__scroll", { autoAlpha: 0, y: -40, ease: "none", duration: 0.25 }, 0)
          .to(".hero__name", { yPercent: -18, ease: "none", duration: 1 }, 0)
          .fromTo(
            ".hero__tagline-line",
            { yPercent: 110 },
            { yPercent: 0, ease: "power2.out", duration: 0.25, stagger: 0.05 },
            0.55,
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

        <div className="hero__top grid mono">
          <span className="hero__fade">§01 — Index</span>
          <span className="hero__fade">{site.role}</span>
          <span className="hero__fade">{site.location}</span>
          <span className="hero__fade hero__coords">{site.coords}</span>
        </div>

        <div className="hero__tagline display" aria-hidden="true">
          {site.tagline.split(" ").map((w, i) => (
            <span className="mask" key={i}>
              <span className="hero__tagline-line">{w}</span>
            </span>
          ))}
        </div>

        <div className="hero__bottom">
          <div className="hero__meta grid">
            <p className="hero__intro hero__fade">{site.intro}</p>
            <button
              className="hero__scroll hero__fade mono"
              data-cursor="Scroll"
              onClick={() => scrollToTarget("#academia")}
            >
              <span className="hero__scroll-line" />
              Scroll to order
            </button>
          </div>
          <h1 className="hero__name display" ref={name}>
            <SplitLetters text={site.name.first} className="hero__first" />
            <SplitLetters text={site.name.last} className="hero__last" />
          </h1>
        </div>
      </div>
    </section>
  );
}
