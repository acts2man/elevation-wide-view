interface ContourBackdropProps {
  className?: string;
  variant?: "light" | "dark";
}

export function ContourBackdrop({
  className,
  variant = "light",
}: ContourBackdropProps) {
  const stroke =
    variant === "dark" ? "rgba(247,246,242,0.12)" : "rgba(17,19,21,0.10)";

  const rings = [12, 26, 42, 60, 80, 102, 126, 152];

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <g fill="none" stroke={stroke} strokeWidth="1">
        {rings.map((r) => (
          <circle key={`l-${r}`} cx="310" cy="250" r={r} />
        ))}
        {rings.map((r) => (
          <circle key={`r-${r}`} cx="500" cy="250" r={r} />
        ))}
      </g>
    </svg>
  );
}

export default ContourBackdrop;
