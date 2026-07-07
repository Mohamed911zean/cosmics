import { motion } from "framer-motion"

type GoldOrbProps = {
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  opacity?: number
  className?: string
  animate?: boolean
}

/**
 * Decorative gold orb / glow blob — purely visual, sits behind content.
 * Use as absolute-positioned accent inside relative containers.
 */
export function GoldOrb({
  size = 400,
  top,
  left,
  right,
  bottom,
  opacity = 0.18,
  className = "",
  animate: shouldAnimate = true,
}: GoldOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 ${className}`}
      style={{ top, left, right, bottom, width: size, height: size }}
    >
      <motion.div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(circle at 40% 40%, var(--color-gold-light), var(--color-gold) 40%, transparent 70%)`,
          filter: `blur(${size * 0.18}px)`,
          opacity,
        }}
        animate={shouldAnimate ? {
          scale: [1, 1.08, 1],
          opacity: [opacity, opacity * 1.4, opacity],
        } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
