import { CategoryCard } from "./CategoryCard"
import { useInView } from "@/hooks/useInView"
import { useProductStore } from "@/stores"
import { motion } from "framer-motion"

export function Categories() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 })
  const [gridRef, gridInView] = useInView({ threshold: 0.1 })
  const categories = useProductStore((state) => state.categories)

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-secondary/50 to-secondary/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/3" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 space-y-4 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block text-[10px] text-accent uppercase tracking-[0.3em] font-bold"
          >
            Browse Collections
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground text-balance">
            Shop By Category
          </h2>
          <p className="text-base sm:text-lg text-foreground/50 max-w-2xl mx-auto font-light">
            Explore our curated collections designed to meet all your beauty needs
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.15 + 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
