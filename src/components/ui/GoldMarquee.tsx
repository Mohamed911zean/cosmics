type GoldMarqueeProps = {
  items?: string[]
  speed?: number
  /** "gold" = gold background dark text | "dark" = dark background gold text */
  variant?: "gold" | "dark"
  className?: string
}

const DEFAULT_ITEMS = [
  "FREE DELIVERY ACROSS EGYPT",
  "100% AUTHENTIC PRODUCTS",
  "PREMIUM INTERNATIONAL BRANDS",
  "VERIFIED QUALITY GUARANTEED",
  "FAST & SECURE CHECKOUT",
  "LUXURY BEAUTY & SKINCARE",
]

/**
 * Infinite scrolling marquee strip — inspired by the Sineen reference design.
 * Uses pure CSS animation for performance. Renders items twice for seamless loop.
 */
export function GoldMarquee({
  items = DEFAULT_ITEMS,
  speed = 28,
  variant = "gold",
  className = "",
}: GoldMarqueeProps) {
  const isDark = variant === "dark"

  // Separator diamond SVG between items
  const Diamond = () => (
    <svg
      viewBox="0 0 12 12"
      width="10"
      height="10"
      className="mx-6 shrink-0"
      aria-hidden="true"
    >
      <path
        d="M6 0 L12 6 L6 12 L0 6 Z"
        fill={isDark ? "var(--color-gold)" : "var(--color-foreground)"}
        opacity="0.6"
      />
    </svg>
  )

  return (
    <div
      className={`relative overflow-hidden py-3.5 ${
        isDark
          ? "bg-foreground border-y border-gold/20"
          : "bg-gold"
      } ${className}`}
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${isDark ? "var(--color-foreground)" : "var(--color-gold)"}, transparent)`,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${isDark ? "var(--color-foreground)" : "var(--color-gold)"}, transparent)`,
        }}
      />

      {/* Scrolling track — duplicated for seamless loop */}
      <div
        className="flex items-center whitespace-nowrap animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] ${
                isDark ? "text-gold-light" : "text-foreground"
              }`}
            >
              {item}
            </span>
            <Diamond />
          </span>
        ))}
      </div>
    </div>
  )
}
