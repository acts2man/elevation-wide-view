interface VennMarkProps {
  className?: string;
}

export function VennMark({ className }: VennMarkProps) {
  return (
    <svg
      viewBox="0 0 320 180"
      width="100%"
      height="auto"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="God and Man overlap in Jesus"
    >
      <g fill="none" stroke="rgba(247,246,242,0.85)" strokeWidth="2">
        <circle cx="118" cy="90" r="72" />
        <circle cx="202" cy="90" r="72" />
      </g>
      <g
        fontFamily="'Bricolage Grotesque',sans-serif"
        fontWeight="700"
        fill="#f7f6f2"
      >
        <text x="78" y="97" fontSize="20" textAnchor="middle">
          GOD
        </text>
        <text x="242" y="97" fontSize="20" textAnchor="middle">
          MAN
        </text>
      </g>
      <g
        fontFamily="'Bricolage Grotesque',sans-serif"
        fontWeight="700"
        fill="#5e8b8f"
        textAnchor="middle"
      >
        <text x="160" y="58" fontSize="13">
          J
        </text>
        <text x="160" y="74" fontSize="13">
          E
        </text>
        <text x="160" y="90" fontSize="13">
          S
        </text>
        <text x="160" y="106" fontSize="13">
          U
        </text>
        <text x="160" y="122" fontSize="13">
          S
        </text>
      </g>
    </svg>
  );
}

export default VennMark;
