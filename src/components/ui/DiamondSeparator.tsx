type DiamondSeparatorProps = {
  className?: string
  color?: string
  size?: number
}

/**
 * Small decorative diamond separator — used between section labels and headings.
 */
export function DiamondSeparator({
  className = "",
  color = "var(--color-gold)",
  size = 8,
}: DiamondSeparatorProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <div
        className="h-[1px] flex-1 opacity-30"
        style={{ background: color }}
      />
      <svg viewBox="0 0 12 12" width={size} height={size}>
        <path d="M6 0 L12 6 L6 12 L0 6 Z" fill={color} />
      </svg>
      <svg viewBox="0 0 8 8" width={size * 0.6} height={size * 0.6}>
        <path d="M4 0 L8 4 L4 8 L0 4 Z" fill={color} opacity="0.5" />
      </svg>
      <svg viewBox="0 0 12 12" width={size} height={size}>
        <path d="M6 0 L12 6 L6 12 L0 6 Z" fill={color} />
      </svg>
      <div
        className="h-[1px] flex-1 opacity-30"
        style={{ background: color }}
      />
    </div>
  )
}

/**
 * Inline diamond dot — used as bullet points or list markers.
 */
export function GoldDiamond({ size = 6, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="M6 0 L12 6 L6 12 L0 6 Z" fill="var(--color-gold)" />
    </svg>
  )
}

/**
 * Section label with gold diamond decoration above a heading.
 * Usage: <SectionLabel label="Our Expertise" dark />
 */
export function SectionLabel({
  label,
  dark = false,
  className = "",
}: {
  label: string
  dark?: boolean
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center gap-2 mb-4 ${className}`}>
      <div className="flex items-center gap-2" aria-hidden="true">
        <div
          className="h-[1px] w-8 opacity-40"
          style={{ background: dark ? "var(--color-gold-light)" : "var(--color-gold)" }}
        />
        <svg viewBox="0 0 10 10" width={7} height={7}>
          <path d="M5 0 L10 5 L5 10 L0 5 Z" fill={dark ? "var(--color-gold-light)" : "var(--color-gold)"} />
        </svg>
        <div
          className="h-[1px] w-8 opacity-40"
          style={{ background: dark ? "var(--color-gold-light)" : "var(--color-gold)" }}
        />
      </div>
      <span
        className={`text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold ${
          dark ? "text-gold-light/70" : "text-gold"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
