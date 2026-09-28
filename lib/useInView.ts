"use client";

import { useEffect, useRef, useState } from "react";

/** True once the element has entered the viewport (or while it's in it, with `live`). */
export function useInView<T extends Element>({ live = false, threshold = 0.25 } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (!live) io.disconnect();
        } else if (live) {
          setInView(false);
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [live, threshold]);

  return [ref, inView] as const;
}
