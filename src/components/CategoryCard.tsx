import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface CategoryCardProps {
  id: number
  name: string
  productCount: number
  image: string
}

export function CategoryCard({ name, productCount, image }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-secondary rounded-sm">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
        <div className="space-y-3">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="h-[1px] bg-accent"
          />
          <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight group-hover:translate-x-2 transition-transform duration-500">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
              {productCount} Products
            </p>
            <motion.div
              className="flex items-center gap-2 text-[10px] text-accent uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all duration-300"
              whileHover={{ x: 5 }}
            >
              Shop Now
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 transition-colors duration-500 rounded-sm pointer-events-none" />
    </motion.div>
  )
}
