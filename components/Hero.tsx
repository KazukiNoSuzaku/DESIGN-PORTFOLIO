"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import Clock from "./Clock";

/** Swiss hero: the name, three facts, one rule, the tagline. Nothing else. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Resolve now: the intro callback fires inside the preloader's GSAP context.
        const q = gsap.utils.selector(root);
        const lines = q(".hero__line");
        const fades = q(".hero__fade");
        const rule = q(".hero__rule");
        gsap.set(lines, { yPercent: 105 });
        gsap.set(fades, { autoAlpha: 0, y: 12 });
        gsap.set(rule, { scaleX: 0 });

        return onIntroDone(() => {
          gsap
            .timeline({ delay: 0.25 })
            .to(lines, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.09 })
            .to(rule, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.2)
            .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.05 }, 0.45);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hero tone-paper" id="index" ref={root}>
      <div className="hero__grid grid">
        <h1 className="hero__name" aria-label={`${site.name.first} ${site.name.last}`}>
          {[site.name.first, site.name.last].map((w) => (
            <span className="mask" key={w} aria-hidden="true">
              <span className="hero__line">{w}</span>
            </span>
          ))}
        </h1>
        <dl className="hero__facts">
          <div className="hero__fade">
            <dt className="mono">Role</dt>
            <dd>{site.role}</dd>
          </div>
          <div className="hero__fade">
            <dt className="mono">Based</dt>
            <dd>Bengaluru, India</dd>
          </div>
          <div className="hero__fade">
            <dt className="mono">Local time</dt>
            <dd>
              <Clock /> {site.timezoneLabel}
            </dd>
          </div>
        </dl>
      </div>

      <div className="hero__foot grid">
        <span className="hero__rule" aria-hidden="true" />
        <p className="hero__tag hero__fade">{site.tagline}.</p>
        <span className="hero__idx hero__fade mono">Index — 01 / 05</span>
      </div>
    </section>
  );
}
