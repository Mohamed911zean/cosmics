import { CategoryCard } from "./CategoryCard"
import { useInView } from "@/hooks/useInView"

const categories = [
  {
    id: 1,
    name: "Skincare",
    productCount: 48,
    image: "/luxury-skincare-products-minimal-aesthetic.jpg",
  },
  {
    id: 2,
    name: "Makeup",
    productCount: 72,
    image: "/elegant-makeup-products-on-clean-background.jpg",
  },
  {
    id: 3,
    name: "Fragrance",
    productCount: 24,
    image: "/premium-perfume-bottles-sophisticated.jpg",
  },
]

export function Categories() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 })
  const [gridRef, gridInView] = useInView({ threshold: 0.1 })

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 space-y-4 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground text-balance">
            Shop By Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections designed to meet all your beauty needs
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`transition-all duration-700 delay-${index * 100} ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <CategoryCard {...category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
