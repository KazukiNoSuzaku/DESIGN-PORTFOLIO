"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { getLenis } from "@/lib/scroll";
import { formatCoords, site } from "@/content/site";

const places = site.travel.places;
const total = String(places.length).padStart(2, "0");

/**
 * City flash: the frame cuts through every travel photo as the counter
 * climbs 000 → 100, lands on home (BLR), then expands and wipes away.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const idx = useRef<HTMLSpanElement>(null);
  const city = useRef<HTMLSpanElement>(null);
  const country = useRef<HTMLSpanElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const credit = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.display = "none";
        markIntroDone();
        return;
      }

      getLenis()?.stop();
      const q = gsap.utils.selector(el);
      const imgs = q(".preloader__shot");
      const rows = q(".preloader__row");
      const frame = q(".preloader__frame")[0] as HTMLElement;
      let current = -1;

      const show = (i: number) => {
        if (i === current) return;
        current = i;
        imgs.forEach((img, j) => (img.style.opacity = j === i ? "1" : "0")); // home shot is last, never matched
        rows.forEach((r, j) => r.classList.toggle("is-active", j === i));
        const p = places[i];
        if (idx.current) idx.current.textContent = `${String(i + 1).padStart(2, "0")} / ${total}`;
        if (city.current) city.current.textContent = p.place;
        if (country.current) country.current.textContent = p.country;
        if (coords.current) coords.current.textContent = formatCoords(p.lat, p.lon);
      };

      const home = () => {
        rows.forEach((r) => r.classList.remove("is-active"));
        if (idx.current) idx.current.textContent = "Home";
        if (city.current) city.current.textContent = site.location.split(",")[0];
        if (country.current) country.current.textContent = site.location.split(",").slice(1).join(",").trim();
        if (coords.current) coords.current.textContent = site.coords;
        if (credit.current) credit.current.textContent = `Photo — ${site.homePhoto.credit.name} / Unsplash`;
        // Cut to the home shot; this is the one that zooms to full screen.
        imgs.forEach((img) => (img.style.opacity = img.classList.contains("is-home") ? "1" : "0"));
      };

      show(0);
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          el.style.display = "none";
          getLenis()?.start();
        },
      });

      tl.from(q(".preloader__meta > *, .preloader__info .mask > *, .preloader__row > *"), {
        yPercent: 110,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.02,
      })
        .from(frame, { clipPath: "inset(50% 50% 50% 50%)", duration: 1, ease: "expo.inOut" }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 2.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
              show(Math.min(places.length - 1, Math.floor((counter.v / 100) * places.length)));
            },
          },
          0.2,
        )
        .to(q(".preloader__bar"), { scaleX: 1, duration: 2.6, ease: "power2.inOut" }, 0.2)
        .add(home)
        // Hold on home, then everything clears and the frame fills the screen.
        .to(
          q(".preloader__meta > *, .preloader__info .mask > *, .preloader__row > *, .preloader__count"),
          { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.01 },
          "+=0.45",
        )
        .to(
          frame,
          {
            scale: () => {
              const r = frame.getBoundingClientRect();
              return Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.02;
            },
            x: () => {
              const r = frame.getBoundingClientRect();
              return window.innerWidth / 2 - (r.left + r.width / 2);
            },
            y: () => {
              const r = frame.getBoundingClientRect();
              return window.innerHeight / 2 - (r.top + r.height / 2);
            },
            duration: 1.1,
            ease: "expo.inOut",
          },
          "<0.35",
        )
        .add(markIntroDone, "-=0.15")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "<");
    },
    { scope: root },
  );

  return (
    <div className="preloader tone-ink" ref={root} aria-hidden="true">
      <div className="preloader__meta mono">
        <span>
          {site.name.first} {site.name.last}
        </span>
        <span>Index — {site.year}</span>
        <span>{places.length} cities / loading</span>
      </div>

      <div className="preloader__stage">
        <ol className="preloader__list mono">
          {places.map((p, i) => (
            <li className="preloader__row mask" key={p.place}>
              <span>
                <span className="preloader__row-n">{String(i + 1).padStart(2, "0")}</span>
                {p.place}
              </span>
            </li>
          ))}
        </ol>

        <div className="preloader__frame photo">
          <div className="photo__inner">
            {places.map((p, i) => (
              <Image
                key={p.place}
                src={p.src ?? ""}
                alt=""
                fill
                sizes="(min-width: 900px) 30vw, 60vw"
                loading="eager"
                className="photo__img preloader__shot"
                style={{ opacity: i === 0 ? 1 : 0 }}
              />
            ))}
            {/* Home (BLR) — expands to full screen, so load it large. */}
            <Image
              src={site.homePhoto.src}
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              className="photo__img preloader__shot is-home"
              style={{ opacity: 0 }}
            />
          </div>
          <span className="preloader__corner mono">REC ●</span>
        </div>

        <div className="preloader__info">
          <span className="mask mono">
            <span ref={idx}>01 / {total}</span>
          </span>
          <span className="mask display preloader__city">
            <span ref={city}>{places[0].place}</span>
          </span>
          <span className="mask mono">
            <span ref={country}>{places[0].country}</span>
          </span>
          <span className="mask mono preloader__coords">
            <span ref={coords}>{formatCoords(places[0].lat, places[0].lon)}</span>
          </span>
          <span className="mask mono preloader__credit">
            <span ref={credit}>&nbsp;</span>
          </span>
        </div>
      </div>

      <div className="preloader__foot">
        <div className="preloader__track">
          <div className="preloader__bar" />
        </div>
        <div className="preloader__countwrap">
          <span className="preloader__count" ref={count}>
            000
          </span>
        </div>
      </div>
    </div>
  );
}
