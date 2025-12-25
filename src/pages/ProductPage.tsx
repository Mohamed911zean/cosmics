import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Shield, Truck, RefreshCcw, Heart, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { toast } from "sonner"

export function ProductPage() {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const product = {
        name: "Radiant Glow Serum",
        price: 89.00,
        rating: 4.9,
        reviews: 128,
        description: "Our signature Radiant Glow Serum is a revolutionary formula designed to transform your skin's texture and radiance. Infused with pure botanical extracts and advanced vitamin complexes, it provides deep hydration while targeting fine lines and uneven skin tone.",
        images: [
            "/face_cream_product_mockup_1766625009300.png",
            "/elegant_skincare_hero_1766623620773.png",
            "/eyeshadow_palette_product_mockup_1766625024551.png",
        ],
        details: [
            { id: 1, text: "Dermatologically tested", icon: <Shield className="w-5 h-5" /> },
            { id: 2, text: "Free express shipping", icon: <Truck className="w-5 h-5" /> },
            { id: 3, text: "30-day easy returns", icon: <RefreshCcw className="w-5 h-5" /> },
        ]
    }

    const handleAddToCart = () => {
        toast.success(`${product.name} added to bag`, {
            description: `${quantity} items added to your shopping bag.`,
            action: {
                label: "Checkout",
                onClick: () => window.location.href = "/checkout"
            }
        })
    }

    return (
        <div className="pt-24 min-h-screen bg-background">
            <main className="container mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">

                    {/* Product Images */}
                    <div className="space-y-8 animate-reveal-up">
                        <div className="aspect-[4/5] overflow-hidden bg-secondary relative group">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-8 right-8 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/40 rounded-none transition-all duration-300"
                                onClick={() => toast("Item added to your favorites")}
                            >
                                <Heart className="w-5 h-5 text-white" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`aspect-square overflow-hidden bg-secondary transition-all duration-500 border ${selectedImage === idx ? "border-accent" : "border-transparent opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-center space-y-10 animate-reveal-up" style={{ animationDelay: '0.2s' }}>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
                                    Best Seller
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < 5 ? "fill-accent text-accent" : "text-border"}`} />
                                    ))}
                                    <span className="ml-3 text-[11px] text-foreground/40 uppercase tracking-widest">({product.reviews} reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-[0.95] tracking-tight">
                                {product.name}
                            </h1>
                            <p className="text-3xl font-light text-foreground/80">${product.price.toFixed(2)}</p>
                        </div>

                        <p className="text-lg text-foreground/60 leading-relaxed font-light max-w-xl">
                            {product.description}
                        </p>

                        <div className="space-y-8 pt-10 border-t border-border/50">
                            <div className="flex items-center gap-10">
                                <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold">Quantity</span>
                                <div className="flex items-center border border-border/60 p-1 bg-secondary/30">
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

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-primary text-primary-foreground h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none hover:bg-primary/90 transition-all active:scale-[0.98]"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingBag className="w-4 h-4 mr-3" />
                                    Add to bag
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 h-16 text-xs uppercase tracking-[0.2em] font-bold rounded-none border-primary/20 hover:bg-primary/5 transition-all active:scale-[0.98]"
                                    onClick={() => window.location.href = "/checkout"}
                                >
                                    Buy it now
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-border/50">
                            {product.details.map((detail) => (
                                <div key={detail.id} className="flex flex-col items-center text-center gap-4 group">
                                    <div className="w-12 h-12 bg-secondary/50 flex items-center justify-center text-accent/80 group-hover:scale-110 transition-transform duration-500">
                                        {detail.icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] leading-tight max-w-[100px]">
                                        {detail.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                <section className="pt-32 border-t border-border/50">
                    <div className="flex items-center justify-between mb-16">
                        <h2 className="text-4xl font-serif">You May Also Like</h2>
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
