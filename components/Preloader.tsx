"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { getLenis } from "@/lib/scroll";
import { site } from "@/content/site";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.display = "none";
        markIntroDone();
        return;
      }

      getLenis()?.stop();
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          el.style.display = "none";
          getLenis()?.start();
        },
      });

      tl.from(".preloader__meta > *", { yPercent: 100, duration: 0.8, ease: "expo.out", stagger: 0.06 })
        .to(
          counter,
          {
            v: 100,
            duration: 2,
            ease: "power3.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            },
          },
          0.1,
        )
        .to(".preloader__bar", { scaleX: 1, duration: 2, ease: "power3.inOut" }, 0.1)
        .to(".preloader__meta > *, .preloader__count", { yPercent: -100, duration: 0.6, ease: "expo.in" })
        .add(markIntroDone, "-=0.05")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, "<");
    },
    { scope: root },
  );

  return (
    <div className="preloader tone-ink" ref={root} aria-hidden="true">
      <div className="preloader__meta mono">
        <span>{site.name.first} {site.name.last}</span>
        <span>Index — {site.year}</span>
        <span>Loading specimen</span>
      </div>
      <div className="preloader__foot">
        <div className="preloader__track">
          <div className="preloader__bar" />
        </div>
        <div className="preloader__countwrap">
          <span className="preloader__count" ref={count}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
