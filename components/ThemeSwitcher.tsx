"use client";

// TEMPORARY — palette picker for choosing the final duotone. Remove once decided.

import { useEffect, useState } from "react";
import { applyTheme, THEME_KEY, themes } from "@/lib/theme";

export default function ThemeSwitcher() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    let saved = 0;
    try {
      saved = Math.max(0, themes.findIndex((t) => t.id === localStorage.getItem(THEME_KEY)));
    } catch {}
    setIndex(saved);
    applyTheme(themes[saved]);

    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "t" || e.metaKey || e.ctrlKey) return;
      setIndex((i) => {
        const next = (i + (e.shiftKey ? themes.length - 1 : 1)) % themes.length;
        applyTheme(themes[next]);
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (i: number) => {
    setIndex(i);
    applyTheme(themes[i]);
  };

  const t = themes[index];

  return (
    <div className={`theme-switch mono${open ? "" : " is-closed"}`} role="group" aria-label="Colour palette (temporary)">
      <button className="theme-switch__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {open ? "×" : "◐"}
      </button>
      {open && (
        <>
          <div className="theme-switch__swatches">
            {themes.map((th, i) => (
              <button
                key={th.id}
                className={`theme-switch__swatch${i === index ? " is-active" : ""}`}
                onClick={() => pick(i)}
                aria-label={`${th.name} — ${th.ink} / ${th.paper}`}
                aria-pressed={i === index}
                title={`${th.name} (${th.by === "you" ? "your pick" : "suggested"})`}
                style={{ background: `linear-gradient(135deg, ${th.ink} 50%, ${th.paper} 50%)` }}
              >
                {th.by === "you" && <span className="theme-switch__dot" />}
              </button>
            ))}
          </div>
          <div className="theme-switch__info">
            <span>
              {String(index + 1).padStart(2, "0")} {t.name}
            </span>
            <span className="theme-switch__hex">
              {t.ink} / {t.paper}
            </span>
          </div>
          <span className="theme-switch__hint">T to cycle</span>
        </>
      )}
    </div>
  );
}
