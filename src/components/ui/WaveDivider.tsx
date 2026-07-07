type WaveDividerProps = {
  /** "dark-to-light": dark section above → light below. "light-to-dark": light above → dark below */
  direction?: "dark-to-light" | "light-to-dark"
  className?: string
  /** Override fill color */
  fill?: string
}

/**
 * SVG wave divider to create organic transitions between dark and light sections.
 * Place at the BOTTOM of a section; the fill should match the NEXT section's background.
 */
export function WaveDivider({
  direction = "dark-to-light",
  className = "",
  fill,
}: WaveDividerProps) {
  const resolvedFill = fill ?? (direction === "dark-to-light" ? "#FFFEF9" : "var(--color-foreground)")

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden leading-none ${className}`}
      style={{ marginBottom: "-2px" }}
    >
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-12 md:h-16 lg:h-20"
      >
        {direction === "dark-to-light" ? (
          <path
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill={resolvedFill}
          />
        ) : (
          <path
            d="M0,40 C240,0 480,80 720,40 C960,0 1200,80 1440,40 L1440,80 L0,80 Z"
            fill={resolvedFill}
          />
        )}
      </svg>
    </div>
  )
}

/**
 * Organic curved divider — softer than wave.
 */
export function CurveDivider({
  direction = "dark-to-light",
  className = "",
  fill,
}: WaveDividerProps) {
  const resolvedFill = fill ?? (direction === "dark-to-light" ? "#FFFEF9" : "var(--color-foreground)")

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none w-full overflow-hidden leading-none ${className}`}
      style={{ marginBottom: "-2px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14"
      >
        <path
          d="M0,0 Q360,60 720,30 Q1080,0 1440,50 L1440,60 L0,60 Z"
          fill={resolvedFill}
        />
      </svg>
    </div>
  )
}
