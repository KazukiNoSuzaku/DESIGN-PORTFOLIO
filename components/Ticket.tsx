"use client";

import type { TicketData } from "@/content/site";
import { useInView } from "@/lib/useInView";
import Barcode from "./Barcode";

/** Boarding pass with a perforated stub. Slides in on view; the stub tears off on hover. */
export default function Ticket({ data, tilt = -3 }: { data: TicketData; tilt?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const code = `${data.from[0]}${data.to[0]}${data.flight}`.replace(/\s/g, "");

  return (
    <div
      ref={ref}
      className={`ticket mono${inView ? " is-in" : ""}`}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      aria-label={`Boarding pass, ${data.from[1]} to ${data.to[1]}`}
    >
      <div className="ticket__main">
        <div className="ticket__top">
          <span>Boarding pass / {data.carrier}</span>
          <span>{data.date}</span>
        </div>
        <div className="ticket__route">
          <span className="ticket__iata display">{data.from[0]}</span>
          <span className="ticket__arrow">
            <i />
          </span>
          <span className="ticket__iata display">{data.to[0]}</span>
        </div>
        <div className="ticket__cities">
          <span>{data.from[1]}</span>
          <span>{data.to[1]}</span>
        </div>
        <dl className="ticket__grid">
          <div>
            <dt>Flight</dt>
            <dd>{data.flight}</dd>
          </div>
          <div>
            <dt>Gate</dt>
            <dd>{data.gate}</dd>
          </div>
          <div>
            <dt>Boards</dt>
            <dd>{data.boarding}</dd>
          </div>
          <div>
            <dt>Seat</dt>
            <dd>{data.seat}</dd>
          </div>
          <div>
            <dt>Class</dt>
            <dd>{data.cls}</dd>
          </div>
        </dl>
      </div>
      <div className="ticket__stub" aria-hidden="true">
        <span className="ticket__stub-seat display">{data.seat}</span>
        <span>
          {data.from[0]} → {data.to[0]}
        </span>
        <Barcode value={code} height={24} />
      </div>
    </div>
  );
}
