import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useInView } from "@/hooks/useInView"

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Beauty Enthusiast",
    content: "The Radiant Glow Serum has completely transformed my skincare routine. My skin has never looked better!",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
  },
  {
    id: 2,
    name: "Emily Chen",
    role: "Makeup Artist",
    content: "As a professional, I only use the best products on my clients. Lumière's quality is unmatched.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
  },
  {
    id: 3,
    name: "Jessica Williams",
    role: "Skincare Expert",
    content: "Finally found a brand that delivers on its promises. The results speak for themselves.",
    avatar: "https://i.pravatar.cc/150?img=9",
    rating: 5,
  },
]

export function Testimonials() {
  const [headerRef, headerInView] = useInView({ threshold: 0.1 })
  const [gridRef, gridInView] = useInView({ threshold: 0.1 })

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/3" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 space-y-4 transition-all duration-700 ${headerInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-block text-[10px] text-accent uppercase tracking-[0.3em] font-bold"
          >
            Client Love
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-foreground/50 max-w-2xl mx-auto font-light">
            Join thousands of satisfied customers who have discovered their perfect beauty routine
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.15 + 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="group bg-gradient-to-br from-background to-secondary/30 p-8 border border-border/30 hover:border-accent/20 transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/10 group-hover:text-accent/20 transition-colors duration-500" />

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground/70 leading-relaxed font-light flex-1 relative z-10">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/30">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all duration-300"
                  />
                  <div>
                    <p className="font-medium text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
