import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, ShoppingBag, Star, ChevronRight, Play, Sparkles, Heart, ShieldCheck, Leaf } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useCartStore, useWishlistStore, useProductStore } from "@/stores"
import { toast } from "sonner"



const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
  Leaf: <Leaf className="w-8 h-8" />,
  Heart: <Heart className="w-8 h-8" />
}

export default function Home() {
  const { featuredProducts, services, brand } = useProductStore()
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    toast.success(`${product.name} added to bag`)
  }

  const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    const inWishlist = isInWishlist(product.id)
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
      icon: inWishlist ? "💔" : "❤️"
    })
  }

  return (
    <main className="bg-ivory text-foreground font-sans selection:bg-accent selection:text-foreground">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-70">
          <img
            src="https://e-majestic.com/cdn/shop/files/WhatsAppImage2025-09-01at15.31.20.jpg?v=1756738172&width=900"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory via-ivory/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block text-taupe tracking-widest uppercase text-xs mb-4 font-semibold">
              {brand.tagline}
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-foreground leading-[1.1] mb-8">
              Authentic Beauty <br />
              <span className="italic text-taupe font-light">Across</span> Egypt
            </h1>
            <p className="text-xl text-taupe max-w-lg mb-10 leading-relaxed">
              Majestics is your trusted Egyptian marketplace for 100% original skincare and beauty essentials, delivering premium world-class brands to every corner of Egypt.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/shop">
                <button className="px-10 py-4 bg-foreground text-ivory rounded-full hover:bg-taupe transition-colors duration-300 flex items-center gap-2 group shadow-lg shadow-foreground/5">
                  Shop All Creams
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/about">
                <button className="flex items-center gap-3 text-foreground font-medium group">
                  <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </span>
                  Our Philosophy
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES CAROUSEL */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-taupe tracking-widest uppercase text-xs mb-3 block font-semibold">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Dedicated Care</h2>
              <p className="text-taupe">Experience wellness beyond products. Discover our range of personalized skincare services designed for your skin's health.</p>
            </div>
            <div className="hidden md:flex gap-4">
              {/* Controls will be tied to carousel if we add more UI, for now standard arrows are inside container */}
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {services.map((service) => (
                <CarouselItem key={service.id} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] bg-muted mb-8 shadow-sm group-hover:shadow-xl transition-all duration-700">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm">
                        {iconMap[service.icon]}
                      </div>
                    </div>
                    <div className="px-4">
                      <h3 className="text-2xl font-serif mb-3 flex items-center gap-3">
                        {service.title}
                      </h3>
                      <p className="text-taupe text-sm mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <button className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2 group-hover:text-accent transition-colors">
                        Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-4 mt-12 pr-6">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="py-24 bg-ivory overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-taupe tracking-widest uppercase text-xs mb-3 block font-semibold">Favorites</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">The Best Sellers</h2>
            <p className="text-taupe">Loved by our community for their exceptional results from world-class brands.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product: any, idx: number) => {
              const inWishlist = isInWishlist(product.id)
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white mb-6 border border-border/50 group-hover:shadow-2xl group-hover:shadow-taupe/10 transition-all duration-500">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 backdrop-blur-sm text-foreground rounded-xl opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 font-medium flex items-center justify-center gap-2 z-10"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button
                        onClick={(e) => handleToggleWishlist(e, product)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10 ${inWishlist ? "bg-accent/20 text-accent" : "bg-white/80 text-foreground/40 hover:text-accent"
                          } opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity`}
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                      </button>
                    </div>
                  </Link>
                  <div className="px-2">
                    <span className="text-xs uppercase tracking-wider text-taupe font-medium">{product.category}</span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-serif mt-1 mb-2 hover:text-accent transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-xl font-medium text-foreground">${product.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCT HIGHLIGHT */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-accent/20 rounded-full blur-[100px] z-0" />
              <img
                src="https://e-majestic.com/cdn/shop/files/retinol_pirlome.png?v=1764809595&width=900"
                alt="Featured Product"
                className="relative z-10 w-full rounded-[3rem] shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-4 md:bottom-8 md:-right-8 bg-white p-4 md:p-8 rounded-3xl shadow-xl z-20 max-w-[160px] md:max-w-[200px]">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-[10px] md:text-sm font-medium italic leading-snug">"I finally found a place in Egypt that I can trust for 100% original international beauty products."</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-taupe tracking-widest uppercase text-xs mb-4 block font-semibold">Curated Collections</span>
              <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Global Beauty & <br /> <span className="italic font-light">Wellness Rituals</span></h2>
              <p className="text-lg text-taupe mb-10 leading-relaxed max-w-lg">
                We bridge the gap between world-class brands and the Egyptian market. Explore 100% original formulations, from high-performance retinol treatments to essential beauty supplements.
              </p>

              <ul className="space-y-4 mb-10">
                {["Authenticity Verified", "Top International Brands", "Fast Delivery Across Egypt"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
                              <Link to="/collections">
                <button className="px-12 py-5 bg-foreground text-ivory rounded-full hover:bg-taupe transition-colors duration-300 flex items-center gap-2 group shadow-xl">
                  Explore The Marketplace
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BRAND VALUES / STATEMENT */}
      <section className="py-32 bg-ivory">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-serif mb-12 leading-relaxed">
              "We believe that authenticity is the core of true <span className="italic text-taupe font-light">beauty</span> and <span className="text-accent underline decoration-1 underline-offset-[12px]">care</span>."
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-border/50">
              {[
                { label: "Founded", value: "2024" },
                { label: "Community", value: "120k+" },
                { label: "Products", value: "Original" },
                { label: "Sourcing", value: "Verified" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-taupe text-sm uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-serif">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    </main>
  )
}
