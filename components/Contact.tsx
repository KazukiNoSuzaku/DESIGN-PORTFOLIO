"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useFluidType } from "@/lib/useFluidType";
import { scrollToTarget } from "@/lib/scroll";
import { site } from "@/content/site";
import SplitLetters from "./SplitLetters";
import Clock from "./Clock";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const big = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  useFluidType(big);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".contact__big .letter", {
          yPercent: 110,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".contact__big", start: "top 85%" },
        });
        gsap.from(".contact__reveal", {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.contact.email}`;
    }
  };

  return (
    <footer className="contact tone-ink" id="contact" ref={root}>
      <div className="contact__reveal">
        <div className="contact__top grid mono">
          <span>§05 — Contact</span>
          <span>Open to collaborations, residencies & good conversations.</span>
        </div>

        <h2 className="contact__big display" ref={big}>
          <SplitLetters text="Say hello" />
        </h2>

        <div className="contact__grid grid">
          <button className="contact__email" onClick={copy} data-cursor={copied ? "Copied" : "Copy"}>
            <span className="mono">{copied ? "Copied to clipboard ✓" : "Email — click to copy"}</span>
            <span className="contact__email-addr display">{site.contact.email}</span>
          </button>

          <ul className="contact__socials">
            {site.contact.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="contact__social">
                  <span>{s.label}</span>
                  <span className="mono">↗</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="contact__local mono">
            <span>Local time</span>
            <span className="contact__clock display">
              <Clock />
            </span>
            <span>{site.location}</span>
          </div>
        </div>

        <div className="contact__foot grid mono">
          <span>
            © {site.year} {site.name.first} {site.name.last}
          </span>
          <span>Designed & built by hand — Next.js, GSAP, Three.js</span>
          <span className="contact__hint">Press G for grid</span>
          <button className="contact__top-btn" onClick={() => scrollToTarget(0)}>
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
