"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { scrollToTarget } from "@/lib/scroll";
import { nav, site } from "@/content/site";
import Clock from "./Clock";

export default function Nav() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".nav__roll");
      gsap.set(items, { yPercent: 110 });
      return onIntroDone(() => {
        gsap.to(items, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.04, delay: 0.5 });
      });
    },
    { scope: root },
  );

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToTarget(id === "index" ? 0 : `#${id}`);
  };

  return (
    <header className="nav mono" ref={root}>
      <a href="#index" className="nav__mark mask" onClick={(e) => go(e, "index")}>
        <span className="nav__roll">
          {site.initials}
          <sup>®</sup>
        </span>
      </a>
      <nav className="nav__links" aria-label="Sections">
        {nav.map((item, i) => (
          <a key={item.id} href={`#${item.id}`} className="nav__link mask" onClick={(e) => go(e, item.id)}>
            <span className="nav__roll">
              <span className="nav__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="nav__label">
                <span data-text={item.label}>{item.label}</span>
              </span>
            </span>
          </a>
        ))}
      </nav>
      <div className="nav__time mask">
        <span className="nav__roll">
          <Clock /> {site.timezoneLabel}
        </span>
      </div>
    </header>
  );
}
