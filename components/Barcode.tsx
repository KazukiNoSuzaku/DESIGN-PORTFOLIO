/** Decorative barcode generated deterministically from a string. */
export default function Barcode({ value, height = 26 }: { value: string; height?: number }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  let seed = 7;
  for (const ch of value.toUpperCase()) {
    seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
    for (let k = 0; k < 3; k++) {
      const w = 1 + ((seed >> (k * 2)) % 3);
      bars.push({ x, w });
      x += w + 1 + ((seed >> (k + 3)) % 2);
    }
  }
  return (
    <svg className="barcode" width={x} height={height} viewBox={`0 0 ${x} ${height}`} aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={i % 9 === 0 ? height : height - 4} fill="currentColor" />
      ))}
    </svg>
  );
}
