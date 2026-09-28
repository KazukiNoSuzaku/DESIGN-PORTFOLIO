/** Wraps each character in a span so it can be animated / variably weighted. */
export default function SplitLetters({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text} role="text">
      {Array.from(text).map((ch, i) => (
        <span key={i} className="letter-mask" aria-hidden="true">
          <span className="letter" data-letter>
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}
