interface VennMarkProps {
  className?: string;
  stroke?: string;
  labelColor?: string;
  overlapColor?: string;
}

export function VennMark({
  className,
  stroke = "currentColor",
  labelColor = "currentColor",
  overlapColor = "var(--color-summit-2)",
}: VennMarkProps) {
  const letters = ["J", "E", "S", "U", "S"];
  return (
    <svg
      viewBox="0 0 240 160"
      fill="none"
      className={className}
      aria-label="God and Man overlap in Jesus"
      role="img"
    >
      <circle cx="90" cy="80" r="62" stroke={stroke} strokeWidth="1.25" />
      <circle cx="150" cy="80" r="62" stroke={stroke} strokeWidth="1.25" />
      <text
        x="58"
        y="22"
        fill={labelColor}
        fontSize="10"
        fontFamily="var(--font-sans)"
        letterSpacing="0.18em"
      >
        GOD
      </text>
      <text
        x="166"
        y="22"
        fill={labelColor}
        fontSize="10"
        fontFamily="var(--font-sans)"
        letterSpacing="0.18em"
      >
        MAN
      </text>
      <g
        fill={overlapColor}
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize="13"
        textAnchor="middle"
      >
        {letters.map((l, i) => (
          <text key={i} x="120" y={56 + i * 12.5} letterSpacing="0.12em">
            {l}
          </text>
        ))}
      </g>
    </svg>
  );
}

export default VennMark;
