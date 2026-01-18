import { ProductCard } from "./ProductCard"
import { useInView } from "@/hooks/useInView"
import { useProductStore } from "@/stores"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function FeaturedProducts() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 })
  const [gridRef, gridInView] = useInView({ threshold: 0.1 })
  const featuredProducts = useProductStore((state) => state.featuredProducts)

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2" />

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
            className="inline-block text-[10px] text-accent uppercase tracking-[0.3em] font-bold bg-accent/10 px-4 py-2"
          >
            Curated Selection
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground text-balance">
            Bestselling Products
          </h2>
          <p className="text-base sm:text-lg text-foreground/50 max-w-2xl mx-auto font-light">
            Discover our most loved cosmetics, carefully selected for their exceptional quality and performance
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.1 + 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button className="group inline-flex items-center gap-3 text-[10px] text-foreground/60 uppercase tracking-[0.25em] font-bold hover:text-accent transition-colors duration-300 py-3 px-6 border border-border/50 hover:border-accent/30 hover:bg-accent/5">
            View All Products
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
