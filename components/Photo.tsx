import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  sizes?: string;
};

/** Monochrome photo frame. Without `src` it renders a specimen placeholder. */
export default function Photo({ src, alt, label, className = "", sizes = "50vw" }: Props) {
  return (
    <figure className={`photo ${className}`}>
      <div className="photo__inner" data-parallax>
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} className="photo__img" />
        ) : (
          <div className="photo__placeholder" role="img" aria-label={alt}>
            <span className="photo__cross" />
            <span className="photo__label mono">{label}</span>
          </div>
        )}
      </div>
    </figure>
  );
}
