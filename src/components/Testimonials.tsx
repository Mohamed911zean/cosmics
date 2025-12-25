import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useInView } from "@/hooks/useInView"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    text: "The quality is absolutely exceptional. My skin has never looked better since I started using these products.",
    image: "/professional-woman-portrait.png",
  },
  {
    id: 2,
    name: "Emily Chen",
    rating: 5,
    text: "I love how natural and elegant these cosmetics make me feel. The packaging is beautiful too!",
    image: "/professional-woman-smiling-portrait.png",
  },
  {
    id: 3,
    name: "Maria Garcia",
    rating: 5,
    text: "Finally found a brand that understands luxury and quality. Every product is a joy to use.",
    image: "/elegant-woman-portrait.png",
  },
]

export function Testimonials() {
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
            Loved By Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers are saying about their experience
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-700 delay-${index * 100} ${gridInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
            >
              <Card className="border-border hover-lift">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                    />
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">Verified Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
