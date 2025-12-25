import { ProductCard } from "./ProductCard"
import { useInView } from "@/hooks/useInView"

const featuredProducts = [
  {
    id: 1,
    name: "Radiant Glow Serum",
    price: 89.0,
    category: "Skincare",
    image: "/luxury-serum-bottle-on-clean-background.jpg",
  },
  {
    id: 2,
    name: "Velvet Matte Lipstick",
    price: 42.0,
    category: "Makeup",
    image: "/elegant-matte-lipstick-on-soft-background.jpg",
  },
  {
    id: 3,
    name: "Luminous Face Cream",
    price: 95.0,
    category: "Skincare",
    image: "/face_cream_product_mockup_1766625009300.png",
  },
  {
    id: 4,
    name: "Natural Glow Palette",
    price: 78.0,
    category: "Makeup",
    image: "/eyeshadow_palette_product_mockup_1766625024551.png",
  },
]

export function FeaturedProducts() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 })
  const [gridRef, gridInView] = useInView({ threshold: 0.1 })

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-12 sm:mb-16 space-y-4 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground text-balance">
            Bestselling Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved cosmetics, carefully selected for their exceptional quality
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`transition-all duration-700 delay-${index * 100} ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
