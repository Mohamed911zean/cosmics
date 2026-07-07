import { motion } from "framer-motion"

type EdgeArcProps = {
    side: "left" | "right"
    /** Vertical position from top of the section/page, e.g. "10%", "120px" */
    top?: string
    size?: number
    color?: string
    opacity?: number
    /** Rotate the whole shape for variation between repeats */
    rotate?: number
    className?: string
}

/**
 * Decorative half-ring accent, bleeding off the edge of the viewport.
 * Purely visual — aria-hidden, non-interactive, sits behind content.
 * Matches the soft-luxury brand palette (champagne/blush tones).
 */
export function EdgeArc({
    side,
    top = "10%",
    size = 340,
    color = "var(--color-champagne)",
    opacity = 0.5,
    rotate = 0,
    className = "",
}: EdgeArcProps) {
    const isLeft = side === "left"

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute z-0 hidden md:block ${className}`}
            style={{
                top,
                [isLeft ? "left" : "right"]: `-${size * 0.32}px`,
                width: size,
                height: size,
            }}
        >
            <motion.svg
                viewBox="0 0 200 200"
                width={size}
                height={size}
                style={{
                    transform: `scaleX(${isLeft ? 1 : -1}) rotate(${rotate}deg)`,
                }}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Outer freeform ring stroke */}
                <path
                    d="M 100 8
                       C 145 8, 182 32, 190 78
                       C 197 118, 186 158, 152 180
                       C 130 194, 108 190, 92 178"
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    opacity="0.9"
                />
                {/* Inner filled crescent */}
                <path
                    d="M 100 40
                       C 128 40, 152 58, 157 86
                       C 162 114, 150 140, 126 152
                       C 112 159, 98 157, 88 150
                       C 108 140, 118 118, 114 94
                       C 110 70, 96 54, 78 48
                       C 85 43, 92 40, 100 40 Z"
                    fill={color}
                    opacity="0.55"
                />
            </motion.svg>
        </div>
    )
}
