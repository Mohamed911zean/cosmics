import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, ChevronRight, Play, Sparkles, Heart, ShieldCheck, Leaf } from "lucide-react"
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
 
 const { services } = useProductStore()
  {/*
   const navigate = useNavigate()
  
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
    toast.success(`${product.name} added to bag`, {
      action: {
        label: "Checkout",
        onClick: () => navigate("/cart")
      },
    })
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
*/}
  return (
    <main className="bg-ivory text-foreground font-sans selection:bg-accent selection:text-foreground">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
  {/* Background */}
  <div className="absolute inset-0 z-0">
    <img
      src="https://e-majestic.com/cdn/shop/files/WhatsAppImage2025-09-01at15.31.20.jpg?v=1756738172&width=900"
      alt="Hero Background"
      className="w-full h-full object-cover scale-105 transition-transform duration-[12000ms] hover:scale-110"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20 lg:to-transparent" />
  </div>

  {/* Content */}
  <div className="container mx-auto px-6 lg:px-12 relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="max-w-3xl mx-auto text-center lg:mx-0 lg:text-left"
    >
      <h1 className="font-serif font-bold leading-[1.05] text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-foreground mb-6">
        Authentic Beauty
        <br />
        <span className="text-primary">Across Egypt</span>
      </h1>

      <p className="text-foreground/80 font-semibold text-base sm:text-lg md:text-xl leading-8 max-w-xl mx-auto lg:mx-0 mb-10">
        Discover premium skincare and beauty essentials designed to enhance
        your natural glow with trusted products and luxurious care.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
        <Link to="/shop">
          <button className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-medium shadow-lg shadow-primary/20 hover:bg-foreground hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
            Shop All Products
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Link>

        <Link to="/about">
          <button className="group flex items-center gap-3 font-medium text-foreground transition-colors duration-300">
            <span className="w-12 h-12 rounded-full border border-border bg-white/70 backdrop-blur flex items-center justify-center transition-all duration-300 group-hover:bg-secondary group-hover:border-secondary group-hover:scale-110">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </span>

            <span>Our Philosophy</span>
          </button>
        </Link>
      </div>
    </motion.div>
  </div>
</section>


      {/* SERVICES CAROUSEL */}
<section className="relative py-24 bg-surface overflow-hidden">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,197,246,0.08),transparent_70%)]" />

  {/* Left Blob */}
  <div className="absolute -left-24 top-20 w-56 h-56 md:w-80 md:h-80 rounded-full bg-secondary/30 blur-3xl" />

  <div
    className="
    absolute left-0 top-1/2 -translate-y-1/2
    w-32 h-56 md:w-44 md:h-72
    bg-primary/10
    blur-sm
    rounded-[55%_45%_70%_30%/30%_60%_40%_70%]
    rotate-12
    "
  />

  {/* Right Blob */}
  <div className="absolute -right-24 bottom-20 w-56 h-56 md:w-80 md:h-80 rounded-full bg-secondary/30 blur-3xl" />

  <div
    className="
    absolute right-0 top-1/2 -translate-y-1/2
    w-32 h-56 md:w-44 md:h-72
    bg-primary/10
    blur-sm
    rounded-[45%_55%_35%_65%/40%_30%_70%_60%]
    -rotate-12
    "
  />

  {/* Decorative Dots */}
  <div className="absolute top-24 left-[15%] w-3 h-3 rounded-full bg-primary/20" />
  <div className="absolute top-44 right-[20%] w-2 h-2 rounded-full bg-secondary" />
  <div className="absolute bottom-24 left-[12%] w-4 h-4 rounded-full bg-primary/15" />
  <div className="absolute bottom-40 right-[15%] w-3 h-3 rounded-full bg-secondary/70" />

  {/* Decorative Diamonds */}
  <div className="absolute top-36 left-[28%] w-3 h-3 rotate-45 bg-primary/25 rounded-sm" />
  <div className="absolute bottom-32 right-[30%] w-3 h-3 rotate-45 bg-primary/20 rounded-sm" />

  <div className="container relative z-10 mx-auto px-6">

    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
      <div className="max-w-xl">
        <span className="text-muted-foreground tracking-[0.35em] uppercase text-xs font-semibold mb-3 block">
          Our Expertise
        </span>

        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Dedicated Care
        </h2>

        <p className="text-muted-foreground leading-8">
          Experience wellness beyond products. Discover our range of
          personalized skincare services designed for your skin's health.
        </p>
      </div>

      <div className="hidden md:flex gap-4">
        {/* Controls */}
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
          <CarouselItem
            key={service.id}
            className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group h-full cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[16/10] bg-muted mb-8 shadow-sm transition-all duration-700 group-hover:-translate-y-2 group-hover:shadow-2xl">

                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center text-primary shadow-lg">
                  {iconMap[service.icon]}
                </div>
              </div>

              <div className="px-4">
                <h3 className="text-2xl font-serif text-foreground mb-3">
                  {service.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                <button className="group/button text-xs font-bold uppercase tracking-[0.25em] text-primary flex items-center gap-2 transition-colors">
                  Learn More

                  <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex justify-end gap-4 mt-12 pr-6">
        <CarouselPrevious className="static translate-y-0 border-border bg-white/80 backdrop-blur hover:bg-primary hover:text-white" />

        <CarouselNext className="static translate-y-0 border-border bg-white/80 backdrop-blur hover:bg-primary hover:text-white" />
      </div>
    </Carousel>
  </div>
</section>

      {/* BEST SELLERS */}
<section className="relative py-24 bg-surface overflow-hidden">

  {/* Center Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,197,246,0.12),transparent_70%)]" />

  {/* Grid Pattern */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage: `
      linear-gradient(to right, #3b2a60 1px, transparent 1px),
      linear-gradient(to bottom, #3b2a60 1px, transparent 1px)
      `,
      backgroundSize: "70px 70px",
    }}
  />

  {/* Top Left Decoration */}
  <div className="absolute left-0 top-0 w-72 h-72 pointer-events-none">

    <div className="absolute left-8 top-8 w-44 h-44 rounded-full border border-primary/15" />

    <div className="absolute left-16 top-16 w-28 h-28 rounded-full border border-primary/10" />

    <svg
      viewBox="0 0 250 250"
      className="absolute left-0 top-0 w-full h-full"
      fill="none"
    >
      <path
        d="M10 170
        C60 60 170 40 240 110"
        stroke="currentColor"
        className="text-primary/20"
        strokeWidth="1.4"
      />
    </svg>

  </div>

  {/* Bottom Right Decoration */}

  <div className="absolute right-0 bottom-0 w-72 h-72 rotate-180 pointer-events-none">

    <div className="absolute left-8 top-8 w-44 h-44 rounded-full border border-primary/15" />

    <div className="absolute left-16 top-16 w-28 h-28 rounded-full border border-primary/10" />

    <svg
      viewBox="0 0 250 250"
      className="absolute left-0 top-0 w-full h-full"
      fill="none"
    >
      <path
        d="M10 170
        C60 60 170 40 240 110"
        stroke="currentColor"
        className="text-primary/20"
        strokeWidth="1.4"
      />
    </svg>

  </div>

  {/* Floating Diamonds */}

  <div className="absolute left-[18%] top-20 w-3 h-3 rotate-45 rounded-sm bg-primary/25" />
  <div className="absolute right-[22%] top-36 w-2 h-2 rotate-45 rounded-sm bg-secondary" />
  <div className="absolute left-[25%] bottom-24 w-2.5 h-2.5 rotate-45 rounded-sm bg-primary/20" />
  <div className="absolute right-[16%] bottom-20 w-3 h-3 rotate-45 rounded-sm bg-secondary/70" />

  {/* Main Content */}

  <div className="container relative z-10 mx-auto px-6">

    <div className="relative overflow-hidden rounded-[3rem] border border-border/70 bg-white/70 backdrop-blur-xl px-8 py-12 md:px-14 md:py-16 shadow-[0_30px_80px_rgba(59,42,96,0.06)]">

      <div className="flex flex-col lg:flex-row justify-between items-end gap-8">

        <div className="max-w-2xl">

          <span className="text-muted-foreground tracking-[0.35em] uppercase text-xs font-semibold mb-4 block">
            Editor's Choice
          </span>

          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Why Everyone Loves
            <span className="block text-primary italic font-light">
              These Products
            </span>
          </h2>

          <p className="text-muted-foreground text-lg leading-8 max-w-xl">
            Carefully selected skincare essentials loved by thousands for their
            proven results, premium ingredients, and luxurious experience.
          </p>

        </div>

        <Link to="/shop">

          <button className="group rounded-full bg-primary px-8 py-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20">

            <span className="flex items-center gap-2">
              Explore Collection

              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>

          </button>

        </Link>

      </div>

    </div>

  </div>

</section>
      {/* FEATURED PRODUCT HIGHLIGHT */}
     <section className="relative overflow-hidden py-32 bg-surface">

  {/* Background Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,197,246,0.12),transparent_70%)]" />

  {/* Left Blob */}
  <div className="absolute -left-20 sm:-left-24 lg:-left-32 top-24 w-56 h-56 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] rounded-full bg-secondary/30 blur-3xl" />

  {/* Left Organic Shape */}
  <div
    className="absolute left-0 top-1/2 -translate-y-1/2
    w-36 h-64
    sm:w-44 sm:h-72
    lg:w-60 lg:h-[420px]
    bg-primary/10
    blur-sm
    rounded-[55%_45%_70%_30%/30%_60%_40%_70%]
    rotate-12"
  />

  {/* Right Blob */}
  <div className="absolute -right-20 sm:-right-24 lg:-right-32 bottom-20 w-56 h-56 sm:w-72 sm:h-72 lg:w-[420px] lg:h-[420px] rounded-full bg-secondary/30 blur-3xl" />

  {/* Right Organic Shape */}
  <div
    className="absolute right-0 top-1/2 -translate-y-1/2
    w-36 h-64
    sm:w-44 sm:h-72
    lg:w-60 lg:h-[420px]
    bg-primary/10
    blur-sm
    rounded-[45%_55%_35%_65%/40%_30%_70%_60%]
    -rotate-12"
  />

  {/* Decorative Circles */}
  <div className="absolute top-20 left-[18%] w-3 h-3 rounded-full bg-primary/20" />
  <div className="absolute top-40 right-[18%] w-2 h-2 rounded-full bg-secondary" />
  <div className="absolute bottom-20 left-[12%] w-4 h-4 rounded-full bg-primary/15" />
  <div className="absolute bottom-36 right-[12%] w-3 h-3 rounded-full bg-secondary/70" />

  {/* Decorative Diamonds */}
  <div className="absolute top-44 left-[28%] w-3 h-3 rotate-45 bg-primary/30 rounded-sm" />
  <div className="absolute bottom-32 right-[30%] w-3 h-3 rotate-45 bg-primary/20 rounded-sm" />

  <div className="container relative z-10 mx-auto px-6">
    <div className="grid lg:grid-cols-2 gap-16 items-center">

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative"
      >
        <div className="absolute -inset-10 bg-primary/10 rounded-full blur-[120px]" />

        <img
          src="https://e-majestic.com/cdn/shop/files/retinol_pirlome.png?v=1764809595&width=900"
          alt="Featured Product"
          className="relative z-10 w-full rounded-[3rem] shadow-2xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <span className="text-muted-foreground tracking-[0.35em] uppercase text-xs font-semibold mb-4 block">
          Curated Collections
        </span>

        <h2 className="text-4xl md:text-6xl xl:text-7xl font-serif text-foreground leading-tight mb-8">
          Global Beauty &
          <br />
          <span className="italic font-light text-primary">
            Wellness Rituals
          </span>
        </h2>

        <p className="text-muted-foreground text-lg leading-8 max-w-xl mb-10">
          We bridge the gap between world-class brands and the Egyptian market.
          Explore authentic skincare, premium treatments, and beauty essentials
          trusted worldwide.
        </p>

        <ul className="space-y-5 mb-10">
          {[
            "100% Authentic Products",
            "Premium International Brands",
            "Fast Delivery Across Egypt",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-4 text-foreground font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>

        <Link to="/collections">
          <button className="group flex items-center gap-2 rounded-full bg-primary px-10 py-5 text-white shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:bg-foreground">
            Explore The Marketplace

            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </Link>
      </motion.div>

    </div>
  </div>
</section>

      {/* BRAND VALUES / STATEMENT */}
<section className="relative py-32 bg-ivory overflow-hidden">        {/* ================= Decorations ================= */}

<div className="absolute left-[14%] top-20 text-primary/25 text-xl">✦</div>

<div className="absolute right-[18%] top-32 text-secondary text-lg">✦</div>

<div className="absolute left-[20%] bottom-24 text-primary/20">✦</div>

<div className="absolute right-[14%] bottom-28 text-secondary/70">✦</div>

{/* Center Glow */}
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,197,246,0.12),transparent_70%)] pointer-events-none" />

{/* Left Luxury SVG */}
<div className="absolute -left-10 md:left-0 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none">

<svg
width="220"
height="560"
viewBox="0 0 220 560"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>

<path
d="M30 0
C170 120
30 240
170 360
40 470
170 560"
stroke="currentColor"
className="text-primary/20"
strokeWidth="1.2"
/>

<circle
cx="82"
cy="145"
r="55"
stroke="currentColor"
className="text-primary/15"
/>

<circle
cx="130"
cy="420"
r="70"
stroke="currentColor"
className="text-secondary"
/>

<path
d="M90 110
C105 92 115 78 122 58
C108 74 94 89 78 103Z"
fill="currentColor"
className="text-secondary"
/>

<path
d="M126 410
C145 388 156 362 166 338
C150 360 136 382 118 396Z"
fill="currentColor"
className="text-secondary"
/>

</svg>

</div>

{/* Right Luxury SVG */}

<div className="absolute -right-10 md:right-0 top-1/2 -translate-y-1/2 scale-x-[-1] opacity-70 pointer-events-none">

<svg
width="220"
height="560"
viewBox="0 0 220 560"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>

<path
d="M30 0
C170 120
30 240
170 360
40 470
170 560"
stroke="currentColor"
className="text-primary/20"
strokeWidth="1.2"
/>

<circle
cx="82"
cy="145"
r="55"
stroke="currentColor"
className="text-primary/15"
/>

<circle
cx="130"
cy="420"
r="70"
stroke="currentColor"
className="text-secondary"
/>

<path
d="M90 110
C105 92 115 78 122 58
C108 74 94 89 78 103Z"
fill="currentColor"
className="text-secondary"
/>

<path
d="M126 410
C145 388 156 362 166 338
C150 360 136 382 118 396Z"
fill="currentColor"
className="text-secondary"
/>

</svg>

</div>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >

            <div className="flex justify-center mb-10">

<div className="relative">

<div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"/>

<div className="absolute left-1/2 -translate-x-1/2 -top-2">

<div className="w-4 h-4 rotate-45 rounded-sm bg-primary/30"/>

</div>

</div>

</div>
            
            <h2 className="text-4xl md:text-6xl font-serif mb-12 leading-relaxed">
              "We believe that authenticity is the core of true <span className="italic text-taupe font-light">beauty</span> and <span className="text-accent underline decoration-1 underline-offset-[12px]">care</span>."
            </h2>

            <div className="flex justify-center my-12 gap-3">

<div className="w-2 h-2 rotate-45 bg-primary/30 rounded-sm"/>

<div className="w-2 h-2 rotate-45 bg-secondary rounded-sm"/>

<div className="w-2 h-2 rotate-45 bg-primary/30 rounded-sm"/>

</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-border/50">
              {[
                { label: "Founded", value: "2026" },
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
