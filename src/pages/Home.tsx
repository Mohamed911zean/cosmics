import { Categories } from "@/components/Categories"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { HeroSection } from "@/components/HeroSection"

export function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary">
        <HeroSection />
      </section>

      {/* CONTENT */}
      <Categories />
      <FeaturedProducts />
    </main>
  )
}
