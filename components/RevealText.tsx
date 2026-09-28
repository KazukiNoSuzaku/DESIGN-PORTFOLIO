"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
};

/** Line-by-line masked reveal when scrolled into view. */
export default function RevealText({ as = "p", className, children, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(ref.current!, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.3,
              ease: "expo.out",
              stagger: 0.09,
              delay,
              scrollTrigger: { trigger: ref.current, start: "top 88%" },
            }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}
