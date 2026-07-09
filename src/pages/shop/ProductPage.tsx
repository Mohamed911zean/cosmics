import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Minus, Plus, RefreshCcw, Shield, ShoppingBag, Truck } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { StockNotifyForm } from '@/components/shop/StockNotifyForm'
import { useCartStore } from '@/stores'
import { useProductStore, type Product } from '@/stores/ecommerceStores/useProductStore'
import { useWishlistStore } from '@/stores/ecommerceStores/useWishlistStore'
import { shallow } from 'zustand/shallow'

export function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const addToCart = useCartStore((state) => state.addItem)
  const toggleItem = useWishlistStore((state) => state.toggleItem)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const getProductById = useProductStore((state) => state.getProductById)
  const fetchProductById = useProductStore((state) => state.fetchProductById)

  useEffect(() => {
    if (!id) return

    // First check if we already have the product in our store!
    const existingProduct = getProductById(id)
    if (existingProduct) {
      setProduct(existingProduct)
      setSelectedImage(0)
      setQuantity(1)
      setIsLoading(false)
      return
    }

    // If not, then fetch it from db
    setIsLoading(true)
    fetchProductById(id)
      .then((nextProduct: Product | null) => {
        setProduct(nextProduct)
        setSelectedImage(0)
        setQuantity(1)
      })
      .catch((error: Error) => {
        console.error(error)
        toast.error('Failed to load product')
      })
      .finally(() => setIsLoading(false))
  }, [id]) // Only re-run when id changes, not fetchProductById/getProductById!

  if (isLoading) {
    return <div className="pt-40 min-h-screen text-center text-muted-foreground">Loading product...</div>
  }

  if (!product) {
    return <div className="pt-40 min-h-screen text-center text-muted-foreground">Product not found.</div>
  }

  const images = product.images.length ? product.images : [product.image]
  const inWishlist = isInWishlist(product.id)
  const isOutOfStock = product.stock_quantity <= 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold

  const details = [
    { id: 1, text: 'Dermatologically tested', icon: <Shield className="w-5 h-5" /> },
    { id: 2, text: 'Free express shipping', icon: <Truck className="w-5 h-5" /> },
    { id: 3, text: '30-day easy returns', icon: <RefreshCcw className="w-5 h-5" /> },
  ]

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock')
      return
    }

    if (quantity > product.stock_quantity) {
      toast.error(`Only ${product.stock_quantity} left in stock`)
      return
    }

    addToCart(
      {
        id: product.id,
        productId: product.id,
        variantId: null,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        category: product.category,
        stockQuantity: product.stock_quantity,
      },
      quantity,
    )
    toast.success(`${product.name} added to bag`, {
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your shopping bag.`,
      action: { label: 'View Bag', onClick: () => navigate('/cart') },
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    if (!isOutOfStock && quantity <= product.stock_quantity) navigate('/checkout')
  }

  const handleToggleWishlist = async () => {
    const wasWishlisted = inWishlist
    try {
      await toggleItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        category: product.category,
      })
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
    <div className="pt-24 min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      <main className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6 lg:space-y-8">
            <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 relative group rounded-sm">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src={images[selectedImage] || '/android-chrome-192x192.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="ghost"
                className={`absolute top-6 right-6 backdrop-blur-md border transition-all duration-300 rounded-none ${inWishlist ? 'bg-accent/20 border-accent/50 text-accent' : 'bg-surface/20 border-white/30 hover:bg-surface/40 text-primary-foreground'}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`w-5 h-5 transition-all ${inWishlist ? 'fill-current scale-110' : ''}`} />
              </Button>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                {images.map((img, index) => (
                  <button
                    key={img}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden bg-secondary transition-all duration-500 border-2 rounded-sm ${selectedImage === index ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="flex flex-col justify-center space-y-8 lg:space-y-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {product.isFeatured && <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold bg-accent/10 px-3 py-1.5">Best Seller</span>}
                {isLowStock && <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold bg-primary/10 px-3 py-1.5">Only {product.stock_quantity} left</span>}
                {isOutOfStock && <span className="text-[10px] text-foreground uppercase tracking-[0.2em] font-bold bg-muted px-3 py-1.5">Out of Stock</span>}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground leading-[0.95] tracking-tight">{product.name}</h1>
              <p className="text-2xl sm:text-3xl font-light text-foreground/80">{product.currency} {product.price.toFixed(2)}</p>
            </div>

            <p className="text-base lg:text-lg text-foreground/60 leading-relaxed font-light max-w-xl">{product.description}</p>

            <div className="space-y-8 pt-8 lg:pt-10 border-t border-border/50">
              {isOutOfStock ? (
                <div className="space-y-3">
                  <p className="text-sm text-foreground/60">Leave your WhatsApp number and the team will contact you manually when this product is restocked.</p>
                  <StockNotifyForm productId={product.id} />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                    <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold">Quantity</span>
                    <div className="flex items-center border border-border/60 p-1 bg-secondary/30 backdrop-blur-sm">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-background transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-background transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                    <Button size="lg" className="flex-1 bg-primary text-primary-foreground h-14 lg:h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none hover:bg-primary/90" onClick={handleAddToCart}>
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      Add to bag
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1 h-14 lg:h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none border-primary/20 hover:bg-primary/5" onClick={handleBuyNow}>
                      Buy it now
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-10 lg:pt-12 border-t border-border/50">
              {details.map((detail) => (
                <div key={detail.id} className="flex flex-col items-center text-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center text-accent/80 border border-border/20">{detail.icon}</div>
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] leading-tight max-w-[100px]">{detail.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <section className="pt-24 lg:pt-32 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 lg:mb-16 gap-4">
            <h2 className="text-3xl lg:text-4xl font-serif">You May Also Like</h2>
            <button className="group flex items-center gap-3 text-[10px] text-foreground/60 uppercase tracking-[0.25em] font-bold hover:text-accent transition-colors">
              View Collection
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
          <FeaturedProducts />
        </section>
      </main>
    </div>
  )
}
