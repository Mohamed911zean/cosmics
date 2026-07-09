import { Heart, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StockNotifyForm } from '@/components/shop/StockNotifyForm'
import { useCartStore, useWishlistStore } from '@/stores'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  stock_quantity?: number
  low_stock_threshold?: number
  currency?: string
}

export function ProductCard({
  id,
  name,
  price,
  image,
  category,
  stock_quantity = 1,
  low_stock_threshold = 5,
  currency = 'EGP',
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(id)
  const isOutOfStock = stock_quantity <= 0
  const isLowStock = stock_quantity > 0 && stock_quantity <= low_stock_threshold

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault()
    if (isOutOfStock) {
      toast.error('This product is out of stock')
      return
    }

    addToCart({
      id,
      productId: id,
      variantId: null,
      name,
      price,
      image,
      category,
      stockQuantity: stock_quantity,
    })
    toast.success(`${name} added to bag`, {
      description: "You've successfully added this item to your shopping bag.",
      action: { label: 'Checkout', onClick: () => (window.location.href = '/cart') },
    })
  }

  const handleToggleWishlist = async (event: React.MouseEvent) => {
    event.preventDefault()
    const wasWishlisted = inWishlist
    try {
      await toggleItem({ id, productId: id, name, price, image, category })
      toast.success(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    } catch (error) {
      if (error instanceof Error && error.message === 'SIGN_IN_REQUIRED') {
        toast.error('Please sign in to use your wishlist')
      } else {
        toast.error('Could not update wishlist')
      }
    }
  }

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
      <Card className="group overflow-hidden border-border/30 bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/50 hover:to-secondary/20 transition-all duration-500 cursor-pointer rounded-none backdrop-blur-sm hover:shadow-xl hover:shadow-black/5">
        <Link to={`/product/${id}`}>
          <CardContent className="p-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
              <img src={image || '/android-chrome-192x192.png'} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {isLowStock && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-primary">Only {stock_quantity} left</span>}
                {isOutOfStock && <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">Out of Stock</span>}
              </div>

              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-4 right-4 backdrop-blur-md border transition-all z-10 rounded-none ${inWishlist ? 'bg-accent/30 border-accent/50 text-primary-foreground' : 'bg-surface/10 border-white/20 hover:bg-surface/30 text-primary-foreground'}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 transition-all ${inWishlist ? 'fill-current scale-110' : ''}`} />
              </Button>

              {!isOutOfStock && (
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-0 lg:translate-y-full lg:group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <Button className="w-full bg-primary/95 text-primary-foreground hover:bg-primary rounded-none transition-all duration-300 backdrop-blur-sm" size="sm" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Bag
                  </Button>
                </div>
              )}
            </div>

            <div className="p-5 space-y-2 text-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-semibold">{category}</p>
              <h3 className="font-serif text-lg text-foreground line-clamp-1 leading-tight group-hover:text-accent transition-colors duration-300">{name}</h3>
              <p className="text-sm font-medium text-foreground/80">{currency} {price.toFixed(2)}</p>
              {isOutOfStock && <StockNotifyForm productId={id} compact className="pt-2" />}
            </div>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}
