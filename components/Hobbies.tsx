"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { site } from "@/content/site";
import SectionHead from "./SectionHead";
import Photo from "./Photo";
import Receipt from "./Receipt";

export default function Hobbies() {
  const root = useRef<HTMLElement>(null);
  const { hobbies } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".hobby");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (next) {
            // As the next card slides over, this one recedes.
            gsap.to(card.querySelector(".hobby__card"), {
              scale: 0.9,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true },
            });
            gsap.to(card.querySelector(".hobby__shade"), {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top 12%", scrub: true },
            });
          }
          gsap.from(card.querySelectorAll(".hobby__title .mask > span"), {
            yPercent: 110,
            rotate: 4,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 70%" },
          });
          gsap.fromTo(
            card.querySelector("[data-parallax]"),
            { scale: 1.25 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="hobbies tone-paper section" id="hobbies" ref={root}>
      <SectionHead index="04" label="Hobbies" title={hobbies.title} />

      <div className="hobbies__stack">
        {hobbies.items.map((h, i) => (
          <article className="hobby" key={h.title} style={{ "--i": i } as React.CSSProperties}>
            <div className={`hobby__card grid${i % 2 ? " tone-ink" : ""}`}>
              <div className="hobby__num display" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </div>
              {h.receipt && <Receipt data={h.receipt} tilt={-4} className="hobby__receipt" />}
              <div className="hobby__text">
                <span className="mono hobby__kicker">{h.kicker}</span>
                <h3 className="hobby__title display">
                  <span className="mask">
                    <span>{h.title}</span>
                  </span>
                </h3>
                <p className="hobby__desc">{h.description}</p>
                {(h.credit || h.hover?.credit) && (
                  <p className="place__credit mono">
                    {h.credit && (
                      <a href={h.credit.url} target="_blank" rel="noreferrer">
                        Photo — {h.credit.name}
                      </a>
                    )}
                    {h.hover?.credit && (
                      <a href={h.hover.credit.url} target="_blank" rel="noreferrer">
                        Colour — {h.hover.credit.name}
                      </a>
                    )}
                  </p>
                )}
              </div>
              <Photo
                src={h.src}
                alt={h.title}
                label={`/hobbies/${h.title.toLowerCase().replace(/[^a-z]/g, "")}.jpg`}
                className="hobby__photo"
                sizes="(min-width: 900px) 40vw, 100vw"
                revealSrc={h.hover?.src}
                revealAlt={`${h.title}, in colour`}
              />
              <span className="hobby__shade" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
