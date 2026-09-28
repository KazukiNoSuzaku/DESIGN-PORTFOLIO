"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import SectionHead from "./SectionHead";
import Rule from "./Rule";

export default function Academia() {
  const root = useRef<HTMLElement>(null);
  const { academia } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".edu__row, .honours__item").forEach((row) => {
          gsap.from(row.querySelectorAll(".cell > span"), {
            yPercent: 110,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.05,
            scrollTrigger: { trigger: row, start: "top 90%" },
          });
        });

        // Oversized year numerals drift at different speeds.
        gsap.utils.toArray<HTMLElement>(".edu__ghost").forEach((el, i) => {
          gsap.fromTo(
            el,
            { yPercent: 30 + i * 10 },
            {
              yPercent: -30 - i * 10,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="academia tone-paper section" id="academia" ref={root}>
      <SectionHead index="02" label="Education & honours" title={academia.title} intro={academia.intro} />

      <div className="edu">
        <div className="edu__head grid mono" aria-hidden="true">
          <span className="c-no">No.</span>
          <span className="c-years">Years</span>
          <span className="c-prog">Programme</span>
          <span className="c-inst">Institution</span>
          <span className="c-focus">Focus</span>
        </div>
        <ol className="edu__list">
          {academia.education.map((e, i) => (
            <li className="edu__row" key={i} data-cursor="Study">
              <Rule />
              <span className="edu__fill" />
              <span className="edu__ghost display" aria-hidden="true">
                {e.years.slice(0, 4)}
              </span>
              <div className="edu__cells grid">
                <span className="cell c-no mono"><span>{String(i + 1).padStart(2, "0")}</span></span>
                <span className="cell c-years mono"><span>{e.years}</span></span>
                <span className="cell c-prog display"><span>{e.programme}</span></span>
                <span className="cell c-inst"><span>{e.institution}, {e.location}</span></span>
                <span className="cell c-focus"><span>{e.focus}</span></span>
              </div>
            </li>
          ))}
        </ol>
        <Rule />
      </div>

      <div className="honours grid">
        <div className="honours__label mono">
          <span>Honours</span>
          <span>({String(academia.honours.length).padStart(2, "0")})</span>
        </div>
        <ul className="honours__list">
          {academia.honours.map((h, i) => (
            <li className="honours__item" key={i}>
              <span className="cell mono"><span>{h.year}</span></span>
              <span className="cell honours__title"><span>{h.title}</span></span>
              <span className="cell mono honours__org"><span>{h.org}</span></span>
              <Rule />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
