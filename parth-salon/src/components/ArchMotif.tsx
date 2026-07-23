/* The salon's signature architecture is its row of plaster arches. This
   redraws that arch as a set of concentric silver hairlines — a quiet,
   subject-grounded motif rather than a generic decorative blob. Decorative
   only, so it is hidden from assistive tech. */
export function ArchMotif({
  className = "",
  stroke = "var(--color-silver)",
  opacity = 0.5,
}: {
  className?: string;
  stroke?: string;
  opacity?: number;
}) {
  const arches = [0, 1, 2, 3];
  return (
    <svg
      className={className}
      viewBox="0 0 300 420"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {arches.map((i) => {
        const inset = i * 26;
        const x = 20 + inset;
        const w = 260 - inset * 2;
        const radius = w / 2;
        const top = 40 + inset;
        const bottom = 420;
        return (
          <path
            key={i}
            d={`M ${x} ${bottom} L ${x} ${top + radius} A ${radius} ${radius} 0 0 1 ${
              x + w
            } ${top + radius} L ${x + w} ${bottom}`}
            stroke={stroke}
            strokeWidth={1}
            opacity={opacity - i * 0.08}
          />
        );
      })}
    </svg>
  );
}
