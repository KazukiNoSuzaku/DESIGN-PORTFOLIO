"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Hairline that draws itself in when scrolled into view. */
export default function Rule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current, {
        scaleX: 0,
        duration: 1.6,
        ease: "expo.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 94%" },
      });
    });
    return () => mm.revert();
  });

  return <span className={`rule ${className}`} ref={ref} aria-hidden="true" />;
}
