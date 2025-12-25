import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { toast } from "sonner"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  category: string
}

export function ProductCard({ id, name, price, image, category }: ProductCardProps) {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.success(`${name} added to cart`, {
      description: "You've successfully added this item to your shopping bag.",
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/cart"
      },
    })
  }

  return (
    <Card className="group overflow-hidden border-border/40 bg-secondary/20 hover:bg-secondary/40 transition-all duration-500 cursor-pointer hover-lift rounded-none">
      <Link to={`/product/${id}`}>
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all z-10 rounded-none"
              onClick={(e) => {
                e.preventDefault()
                toast("Added to wishlist")
              }}
            >
              <Heart className="h-4 w-4 text-white" />
            </Button>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none transition-all duration-300"
                size="sm"
                onClick={addToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5 space-y-2 text-center">
            <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-semibold">{category}</p>
            <h3 className="font-serif text-lg text-foreground line-clamp-1 leading-tight">{name}</h3>
            <p className="text-sm font-medium text-foreground/80">${price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
