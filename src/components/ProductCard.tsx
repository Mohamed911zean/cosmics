import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { useCartStore, useWishlistStore } from "@/stores"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart({
      id,
      name,
      price,
      image,
      category,
    })
    toast.success(`${name} added to bag`, {
      description: "You've successfully added this item to your shopping bag.",
      action: {
        label: "View Bag",
        onClick: () => window.location.href = "/cart"
      },
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem({ id, name, price, image, category })
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
      icon: inWishlist ? "💔" : "❤️"
    })
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="group overflow-hidden border-border/30 bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/50 hover:to-secondary/20 transition-all duration-500 cursor-pointer rounded-none backdrop-blur-sm hover:shadow-xl hover:shadow-black/5">
        <Link to={`/product/${id}`}>
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <img
                src={image || "/placeholder.svg"}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Wishlist button */}
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-4 right-4 backdrop-blur-md border transition-all z-10 rounded-none ${inWishlist
                  ? "bg-accent/30 border-accent/50 text-white"
                  : "bg-white/10 border-white/20 hover:bg-white/30 text-white"
                  }`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 transition-all ${inWishlist ? "fill-current scale-110" : ""}`} />
              </Button>

              {/* Add to cart button - Visible on mobile/tablet, hover-revealed on desktop */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <Button
                  className="w-full bg-primary/95 text-primary-foreground hover:bg-primary rounded-none transition-all duration-300 backdrop-blur-sm"
                  size="sm"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Bag
                </Button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 space-y-2 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-semibold">{category}</p>
              <h3 className="font-serif text-lg text-foreground line-clamp-1 leading-tight group-hover:text-accent transition-colors duration-300">{name}</h3>
              <p className="text-sm font-medium text-foreground/80">${price.toFixed(2)}</p>
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}
