import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Truck, RefreshCcw, Heart, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/shop/FeaturedProducts"
import { toast } from "sonner"
import { useParams, useNavigate } from "react-router-dom"
import { useCartStore, useWishlistStore, useProductStore } from "@/stores"

export function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const addToCart = useCartStore((state) => state.addItem)
    const { toggleItem, isInWishlist } = useWishlistStore()
    const getProductById = useProductStore((state) => state.getProductById)

    // Get product from store or use default
    const productId = parseInt(id || "1")
    const storeProduct = getProductById(productId)

    const product = storeProduct || {
        id: 1,
        name: "Radiant Glow Serum",
        price: 89.00,
        rating: 4.9,
        reviews: 128,
        category: "Skincare",
        description: "Our signature Radiant Glow Serum is a revolutionary formula designed to transform your skin's texture and radiance. Infused with pure botanical extracts and advanced vitamin complexes, it provides deep hydration while targeting fine lines and uneven skin tone.",
        images: [
            "/face_cream_product_mockup_1766625009300.png",
            "/elegant_skincare_hero_1766623620773.png",
            "/eyeshadow_palette_product_mockup_1766625024551.png",
        ],
    }

    const images = product.images || []
    const inWishlist = isInWishlist(product.id)

    const details = [
        { id: 1, text: "Dermatologically tested", icon: <Shield className="w-5 h-5" /> },
        { id: 2, text: "Free express shipping", icon: <Truck className="w-5 h-5" /> },
        { id: 3, text: "30-day easy returns", icon: <RefreshCcw className="w-5 h-5" /> },
    ]

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: images[0] || "",
                category: product.category,
            })
        }
        toast.success(`${product.name} added to bag`, {
            description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your shopping bag.`,
            action: {
                label: "View Bag",
                onClick: () => navigate("/cart")
            }
        })
    }

    const handleBuyNow = () => {
        handleAddToCart()
        navigate("/checkout")
    }

    const handleToggleWishlist = () => {
        toggleItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: images[0] || "",
            category: product.category,
        })
        toast(inWishlist ? "Removed from wishlist" : "Added to wishlist", {
            icon: inWishlist ? "💔" : "❤️"
        })
    }

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
            <main className="container mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">

                    {/* Product Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6 lg:space-y-8"
                    >
                        <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-secondary to-secondary/50 relative group rounded-sm">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Button
                                size="icon"
                                variant="ghost"
                                className={`absolute top-6 right-6 backdrop-blur-md border transition-all duration-300 rounded-none ${inWishlist
                                    ? "bg-accent/20 border-accent/50 text-accent"
                                    : "bg-white/20 border-white/30 hover:bg-white/40 text-white"
                                    }`}
                                onClick={handleToggleWishlist}
                            >
                                <Heart className={`w-5 h-5 transition-all ${inWishlist ? "fill-current scale-110" : ""}`} />
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 lg:gap-6">
                            {images.map((img, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square overflow-hidden bg-secondary transition-all duration-500 border-2 rounded-sm ${selectedImage === idx
                                        ? "border-accent shadow-lg shadow-accent/20"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col justify-center space-y-8 lg:space-y-10"
                    >
                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                                <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold bg-accent/10 px-3 py-1.5">
                                    Best Seller
                                </span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground leading-[0.95] tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-2xl sm:text-3xl font-light text-foreground/80">${product.price.toFixed(2)}</p>
                        </div>

                        <p className="text-base lg:text-lg text-foreground/60 leading-relaxed font-light max-w-xl">
                            {product.description}
                        </p>

                        <div className="space-y-8 pt-8 lg:pt-10 border-t border-border/50">
                            <div className="flex flex-wrap items-center gap-6 lg:gap-10">
                                <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold">Quantity</span>
                                <div className="flex items-center border border-border/60 p-1 bg-secondary/30 backdrop-blur-sm">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-background transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-background transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-primary text-primary-foreground h-14 lg:h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none hover:bg-primary/90 transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-primary/20"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="w-4 h-4 mr-3" />
                                    Add to bag
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 h-14 lg:h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none border-primary/20 hover:bg-primary/5 transition-all active:scale-[0.98]"
                                    onClick={handleBuyNow}
                                >
                                    Buy it now
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-10 lg:pt-12 border-t border-border/50">
                            {details.map((detail) => (
                                <motion.div
                                    key={detail.id}
                                    whileHover={{ y: -4 }}
                                    className="flex flex-col items-center text-center gap-3 lg:gap-4 group cursor-default"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-secondary/80 to-secondary/40 flex items-center justify-center text-accent/80 group-hover:scale-110 group-hover:text-accent transition-all duration-500 backdrop-blur-sm border border-border/20">
                                        {detail.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] leading-tight max-w-[100px]">
                                        {detail.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Similar Products */}
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
