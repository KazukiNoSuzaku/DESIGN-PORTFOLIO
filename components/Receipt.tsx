"use client";

import type { ReceiptData } from "@/content/site";
import { useInView } from "@/lib/useInView";
import Barcode from "./Barcode";


/** Thermal-paper receipt that "prints" out when it scrolls into view. */
export default function Receipt({ data, tilt = -3, className = "" }: { data: ReceiptData; tilt?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`receipt mono${inView ? " is-printed" : ""} ${className}`}
      style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="receipt__paper">
        <p className="receipt__head">{data.head}</p>
        <p className="receipt__sub">{data.sub}</p>
        <p className="receipt__meta">{data.meta}</p>
        <hr />
        {data.lines.map(([l, r]) => (
          <p className="receipt__row" key={l}>
            <span>{l}</span>
            <span>{r}</span>
          </p>
        ))}
        <hr />
        <p className="receipt__row receipt__total">
          <span>{data.total[0]}</span>
          <span>{data.total[1]}</span>
        </p>
        <p className="receipt__foot">{data.foot}</p>
        <div className="receipt__code">
          <Barcode value={data.code} height={30} />
          <span>{data.code}</span>
        </div>
      </div>
    </div>
  );
}
