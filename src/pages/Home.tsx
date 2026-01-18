import { motion } from "framer-motion"
import { ArrowRight, Star, Truck, Shield, RefreshCcw, Leaf, Heart, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useProductStore, useCartStore } from "@/stores"
import { toast } from "sonner"

// Features
const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Shipping",
    description: "Free shipping on all orders over $50"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Payment",
    description: "100% secure payment processing"
  },
  {
    icon: <RefreshCcw className="w-6 h-6" />,
    title: "Easy Returns",
    description: "30-day hassle-free returns"
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "Natural Ingredients",
    description: "Cruelty-free & eco-friendly"
  },
]

// Collections
const collections = [
  {
    id: 1,
    name: "Matte Vibes",
    image: "/elegant-matte-lipstick-on-soft-background.jpg",
    products: 24,
    color: "from-rose-100 to-rose-200",
  },
  {
    id: 2,
    name: "Skin Elegance",
    image: "/face_cream_product_mockup_1766625009300.png",
    products: 18,
    color: "from-amber-100 to-amber-200",
  },
  {
    id: 3,
    name: "Glow Goals",
    image: "/eyeshadow_palette_product_mockup_1766625024551.png",
    products: 32,
    color: "from-orange-100 to-orange-200",
  },
]

// Testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Beauty Enthusiast",
    content: "The quality of these products is absolutely amazing. My skin has never looked better! Highly recommend to everyone.",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Makeup Artist",
    content: "As a professional, I only use the best. Lumière products are now my go-to for all my clients.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Skincare Expert",
    content: "Finally found a brand that delivers on its promises. Beautiful packaging and even better results.",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
  },
]


export function Home() {
  const featuredProducts = useProductStore((state) => state.featuredProducts)
  const addToCart = useCartStore((state) => state.addItem)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
    toast.success(`${product.name} added to bag`)
  }

  return (
    <main className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-600">New Collection Available</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-900 leading-tight">
                Discover Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                  Perfect Shade
                </span>
              </h1>

              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Elevate your beauty routine with our premium collection of cosmetics. Natural ingredients, stunning results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/shop">
                  <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0 text-base font-medium group">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/collections">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-gray-300 hover:border-rose-500 hover:text-rose-500 text-base font-medium">
                    View Collections
                  </Button>
                </Link>
              </div>

            </motion.div>

            {/* Right - Hero Images */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Main Product Image */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto lg:max-w-none">
                  <img
                    src="/face_cream_product_mockup_1766625009300.png"
                    alt="Featured Product"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Price Tag */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                  className="absolute top-10 right-0 lg:right-10 bg-white rounded-2xl shadow-xl p-4 sm:p-5"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Starting at</p>
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">$14.99</p>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-4 top-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full opacity-20 blur-xl"
                />
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 bottom-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-20 blur-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      {/* ===== WHAT WE OFFER SECTION ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium beauty essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center text-rose-500">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-rose-200">
                    <img
                      src="/elegant_skincare_hero_1766623620773.png"
                      alt="Skincare"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-orange-200">
                    <img
                      src="/eyeshadow_palette_product_mockup_1766625024551.png"
                      alt="Makeup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="pt-8">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-amber-200">
                    <img
                      src="/luxury_makeup_hero_1766623636272.png"
                      alt="Luxury Makeup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <span className="text-rose-500 font-medium">About Us</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900">
                Beauty That Inspires Confidence
              </h2>
              <p className="text-gray-600 leading-relaxed">
                At Lumière, we believe beauty should be accessible, sustainable, and empowering.
                Our products are crafted with the finest natural ingredients, ensuring your skin
                gets the care it deserves.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every product in our collection is dermatologically tested, cruelty-free, and
                designed to bring out your natural radiance. Join thousands of satisfied customers
                who have made Lumière their beauty destination.
              </p>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">50K+</p>
                  <p className="text-sm text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">100+</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">4.9</p>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
              </div>

              <Link to="/about">
                <Button className="mt-6 h-12 px-8 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium group">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== EXPLORE COLLECTIONS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Curated collections for every mood and occasion
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Link to={`/collections/${collection.id}`} className="block group">
                  <div className={`relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br ${collection.color}`}>
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-900">{collection.name}</h3>
                    <p className="text-sm text-gray-500">{collection.products} Products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/collections">
              <Button variant="outline" className="h-12 px-8 rounded-full border-2 hover:bg-gray-100 text-base font-medium group">
                View All Collections
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              About Product
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our bestselling products loved by thousands
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4 shadow-sm">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(product)
                      }}
                      className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors pointer-events-auto"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors pointer-events-auto">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-rose-500 uppercase tracking-widest mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 hover:text-rose-500 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0 text-base font-medium group">
                Shop All Products
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
              Testimonial
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What our customers say about us
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 sm:p-12 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
                "{testimonials[currentTestimonial].content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-white"
                />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-rose-500 hover:text-rose-500 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-rose-500 hover:text-rose-500 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentTestimonial
                    ? "w-8 bg-gradient-to-r from-rose-500 to-orange-500"
                    : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
