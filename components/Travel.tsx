"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { formatCoords, site } from "@/content/site";
import SectionHead from "./SectionHead";
import Photo from "./Photo";
import AsciiGlobe from "./AsciiGlobe";

export default function Travel() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const { travel } = site;
  const total = String(travel.places.length).padStart(2, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal gallery.
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".travel__pin",
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: true, // Lenis already smooths; extra lag desyncs nested triggers
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(".travel__progress-bar", { scaleX: self.progress });
              const i = Math.min(travel.places.length, Math.floor(self.progress * travel.places.length) + 1);
              if (counter.current) counter.current.textContent = String(i).padStart(2, "0");
            },
          },
        });

        gsap.utils.toArray<HTMLElement>(".place").forEach((card) => {
          const inner = card.querySelector("[data-parallax]");
          gsap.fromTo(
            inner,
            { xPercent: -12 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        // Caption reveals: an IntersectionObserver sees the card's real on-screen
        // position (transforms included), so no card is missed however it arrives.
        const reveals = new Map<Element, gsap.core.Tween>();
        gsap.utils.toArray<HTMLElement>(".place").forEach((card) => {
          reveals.set(
            card,
            gsap.from(card.querySelectorAll(".place__name .mask > span, .place__meta > span"), {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.04,
              paused: true,
            }),
          );
        });
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              if (!e.isIntersecting) return;
              reveals.get(e.target)?.play();
              io.unobserve(e.target);
            }),
          { threshold: 0 }, // reveal as soon as any part of the card is on screen
        );
        reveals.forEach((_, card) => io.observe(card));
        return () => io.disconnect();
      });

      // Mobile: simple vertical parallax.
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".place [data-parallax]").forEach((inner) => {
          gsap.fromTo(
            inner,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: inner.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section className="travel tone-ink section" id="travel" ref={root}>
      <SectionHead index="03" label="Travel" title={travel.title} intro={travel.intro} aside={<AsciiGlobe />} />

      <div className="travel__pin">
        <div className="travel__track" ref={track}>
          {travel.places.map((p, i) => (
            <article className={`place is-${p.orientation}`} key={p.place} data-cursor={p.place}>
              <Photo
                src={p.src}
                alt={`${p.place}, ${p.country}`}
                label={`/travel/${p.place.toLowerCase().replace(/[^a-z]/g, "")}.jpg`}
                className="place__photo"
                sizes="(min-width: 900px) 50vw, 100vw"
                revealSrc={p.hover?.src}
                revealAlt={`${p.place}, ${p.country} — in colour`}
              />
              <div className="place__caption">
                <div className="place__meta mono">
                  <span>
                    {String(i + 1).padStart(2, "0")} / {total}
                  </span>
                  <span>{formatCoords(p.lat, p.lon)}</span>
                </div>
                <h3 className="place__name display">
                  <span className="mask">
                    <span>{p.place}</span>
                  </span>
                </h3>
                <p className="place__note">
                  <span className="mono">{p.country}</span>
                  {p.note && <> — {p.note}</>}
                </p>
                {(p.credit || p.hover?.credit) && (
                  <p className="place__credit mono">
                    {p.credit && (
                      <a href={p.credit.url} target="_blank" rel="noreferrer">
                        Photo — {p.credit.name}
                      </a>
                    )}
                    {p.hover?.credit && (
                      <a href={p.hover.credit.url} target="_blank" rel="noreferrer">
                        Colour — {p.hover.credit.name}
                      </a>
                    )}
                    <span>/ Unsplash</span>
                  </p>
                )}
              </div>
            </article>
          ))}
          <div className="place-end display" aria-hidden="true">
            <span>More</span>
            <span>soon.</span>
          </div>
        </div>

        <div className="travel__progress mono" aria-hidden="true">
          <span ref={counter}>01</span>
          <div className="travel__progress-track">
            <div className="travel__progress-bar" />
          </div>
          <span>{total}</span>
        </div>
      </div>
    </section>
  );
}
