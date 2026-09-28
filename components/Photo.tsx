"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
  /** Full-colour image that opens up from the cursor on hover (tap on touch). */
  revealSrc?: string;
  revealAlt?: string;
};

/** Duotone photo frame. Without `src` it renders a specimen placeholder. */
export default function Photo({ src, alt, label, className = "", sizes = "50vw", revealSrc, revealAlt }: Props) {
  const reveal = useRef<HTMLDivElement>(null);
  const open = useRef(false);

  const animate = (show: boolean, e?: React.PointerEvent | React.MouseEvent) => {
    const el = reveal.current;
    if (!el || open.current === show) return;
    open.current = show;
    // Circle grows from (or collapses towards) the pointer position.
    if (e) {
      const r = el.getBoundingClientRect();
      gsap.set(el, {
        "--rx": `${((e.clientX - r.left) / r.width) * 100}%`,
        "--ry": `${((e.clientY - r.top) / r.height) * 100}%`,
      });
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { "--r": show ? "150%" : "0%", duration: reduce ? 0 : show ? 1.1 : 0.8, ease: show ? "expo.out" : "expo.inOut", overwrite: true });
    gsap.to(el.querySelector("img"), { scale: show ? 1 : 1.18, duration: reduce ? 0 : 1.4, ease: "expo.out", overwrite: true });
  };

  const handlers = revealSrc
    ? {
        onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && animate(true, e),
        onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && animate(false, e),
        onClick: (e: React.MouseEvent) => {
          if (window.matchMedia("(hover: none)").matches) animate(!open.current, e);
        },
      }
    : {};

  return (
    <figure className={`photo ${className}${revealSrc ? " has-reveal" : ""}`} {...handlers}>
      <div className="photo__inner" data-parallax>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className="photo__img" />
        ) : (
          <div className="photo__placeholder" role="img" aria-label={alt}>
            <span className="photo__cross" />
            <span className="photo__label mono">{label}</span>
          </div>
        )}
        {revealSrc && (
          <div className="photo__reveal" ref={reveal}>
            <Image src={revealSrc} alt={revealAlt ?? alt} fill sizes={sizes} className="photo__reveal-img" />
          </div>
        )}
      </div>
    </figure>
  );
}
