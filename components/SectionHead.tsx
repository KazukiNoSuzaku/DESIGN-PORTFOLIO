import type { ReactNode } from "react";
import RevealText from "./RevealText";
import Rule from "./Rule";
import Barcode from "./Barcode";

type Props = { index: string; label: string; title: string; intro?: string; aside?: ReactNode; extra?: ReactNode };

export default function SectionHead({ index, label, title, intro, aside, extra }: Props) {
  return (
    <div className={`section-head grid${aside ? " has-aside" : ""}`}>
      <div className="section-head__meta mono">
        <span>§{index}</span>
        <span>{label}</span>
        <Barcode value={`${index}${title}`} />
        <span className="section-head__fig">Fig. {index} / 05</span>
      </div>
      <RevealText as="h2" className="section-head__title display">
        {title}
      </RevealText>
      {intro && (
        <RevealText className="section-head__intro" delay={0.15}>
          {intro}
        </RevealText>
      )}
      {aside && <div className="section-head__aside">{aside}</div>}
      {extra && <div className="section-head__extra">{extra}</div>}
      <Rule className="section-head__rule" />
    </div>
  );
}
