import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowRight, ShoppingBag, Star, ChevronRight, Play, Sparkles, Heart, ShieldCheck, Leaf } from "lucide-react"
import heroBg from "@/assets/Gemini_Generated_Image_a5ahsxa5ahsxa5ah.png"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



const services = [
  {
    id: 1,
    title: "Virtual Consultation",
    description: "Personalized beauty advice from our experts, tailored to your unique skin profile.",
    icon: <Sparkles className="w-8 h-8" />,
    image: "/brand_story_hero_1768887993377.png"
  },
  {
    id: 2,
    title: "Custom Formulation",
    description: "Bespoke skincare solutions crafted specifically for your skin's needs and goals.",
    icon: <ShieldCheck className="w-8 h-8" />,
    image: "/majestic_face_cream_1768888244741.png"
  },
  {
    id: 3,
    title: "Ritual Workshops",
    description: "Master the art of the perfect skincare routine with our guided masterclasses.",
    icon: <Leaf className="w-8 h-8" />,
    image: "/skincare_category_1768886611429.png"
  },
  {
    id: 4,
    title: "Gifting Experience",
    description: "Premium packaging and personalized notes to make every gift truly majestic.",
    icon: <Heart className="w-8 h-8" />,
    image: "/makeup_category_1768886635160.png"
  }
]

const bestSellers = [
  {
    id: 1,
    name: "Radiant Essence Serum",
    price: 84.00,
    category: "Skincare",
    image: "/luxury_cosmetics_hero_1768886590255.png",
    rating: 4.9
  },
  {
    id: 2,
    name: "Silk Foundation No. 02",
    price: 62.00,
    category: "Makeup",
    image: "/skincare_category_1768886611429.png",
    rating: 4.8
  },
  {
    id: 3,
    name: "Velvet Lip Tint",
    price: 32.00,
    category: "Makeup",
    image: "/makeup_category_1768886635160.png",
    rating: 5.0
  },
  {
    id: 4,
    name: "Rose Quartz Roller",
    price: 45.00,
    category: "Tools",
    image: "/tools_category_1768886662535.png",
    rating: 4.7
  }
]

export default function Home() {
  return (
    <main className="bg-ivory text-foreground font-sans selection:bg-accent selection:text-foreground">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-70">
          <img
            src={heroBg}
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
              The Art of Self-Care
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-foreground leading-[1.1] mb-8">
              Elegance in <br />
              Every <span className="italic text-taupe font-light">Ritual</span>
            </h1>
            <p className="text-xl text-taupe max-w-lg mb-10 leading-relaxed">
              Curated beauty collections designed to celebrate your unique radiance. Minimal, natural, and timeless.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <Link to="/shop">
                <button className="px-10 py-4 bg-foreground text-ivory rounded-full hover:bg-taupe transition-colors duration-300 flex items-center gap-2 group shadow-lg shadow-foreground/5">
                  Explore Collection
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/about">
                <button className="flex items-center gap-3 text-foreground font-medium group">
                  <span className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </span>
                  Watch Our Story
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
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Exclusive Services</h2>
              <p className="text-taupe">Experience beauty beyond products. Discover our range of personalized services designed for your well-being.</p>
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
                        {service.icon}
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
            <p className="text-taupe">Loved by our community for their exceptional results and premium feel.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-white mb-6 border border-border/50 group-hover:shadow-2xl group-hover:shadow-taupe/10 transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <button className="absolute bottom-4 left-4 right-4 py-3 bg-white/95 backdrop-blur-sm text-foreground rounded-xl opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-2 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-300 font-medium flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                  </div>
                </div>
                <div className="px-2">
                  <span className="text-xs uppercase tracking-wider text-taupe font-medium">{product.category}</span>
                  <h3 className="text-lg font-serif mt-1 mb-2">{product.name}</h3>
                  <p className="text-xl font-medium text-foreground">${product.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
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
                src="/skincare_category_1768886611429.png"
                alt="Featured Product"
                className="relative z-10 w-full rounded-[3rem] shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-4 md:bottom-8 md:-right-8 bg-white p-4 md:p-8 rounded-3xl shadow-xl z-20 max-w-[160px] md:max-w-[200px]">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-gold text-gold" />)}
                </div>
                <p className="text-[10px] md:text-sm font-medium italic leading-snug">"The most luxurious serum I've ever used. My skin is glowing."</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-taupe tracking-widest uppercase text-xs mb-4 block font-semibold">Featured Ritual</span>
              <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">The Midnight <br /> <span className="italic font-light">Revival Elixir</span></h2>
              <p className="text-lg text-taupe mb-10 leading-relaxed max-w-lg">
                Harnessing the power of cold-pressed botanicals and rare minerals to stimulate nocturnal restoration. Wake up to skin that feels reborn, hydrated, and luminous.
              </p>

              <ul className="space-y-4 mb-10">
                {["100% Organic Ingredients", "Clinically Proven Results", "Sustainable Glass Packaging"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              <button className="px-12 py-5 bg-foreground text-ivory rounded-full hover:bg-taupe transition-colors duration-300 flex items-center gap-2 group shadow-xl">
                Discover More
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
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
              "We believe that beauty is a reflection of <span className="italic text-taupe font-light">well-being</span> and <span className="text-accent underline decoration-1 underline-offset-[12px]">authenticity</span>."
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-border/50">
              {[
                { label: "Founded", value: "2024" },
                { label: "Community", value: "120k+" },
                { label: "Ingredients", value: "Pure" },
                { label: "Ethics", value: "Vegan" }
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
