"use client";

import { useEffect, useState } from "react";

/** Press G to toggle the 12-column layout grid. */
export default function GridOverlay() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "g" || e.metaKey || e.ctrlKey) return;
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`grid-overlay grid${on ? " is-on" : ""}`} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}
