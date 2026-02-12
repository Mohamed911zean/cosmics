
import { motion } from "framer-motion"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useWishlistStore, useCartStore } from "@/stores"

export function Wishlist() {
    const { items, removeItem } = useWishlistStore()
    const addToCart = useCartStore((state) => state.addItem)

    const handleRemoveItem = (id: number, name: string) => {
        removeItem(id)
        toast.error(`${name} removed from wishlist`)
    }

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
        })
        toast.success(`${item.name} added to bag`, {
            action: {
                label: "Checkout",
                onClick: () => window.location.href = "/cart"
            },
        })
    }

    if (items.length === 0) {
        return (
            <div className="pt-48 pb-32 text-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md mx-auto space-y-10"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="w-32 h-32 bg-gradient-to-br from-secondary/80 to-secondary/30 flex items-center justify-center mx-auto transition-all duration-700 hover:scale-110 backdrop-blur-sm border border-border/20"
                        >
                            <Heart className="w-12 h-12 text-foreground/20" />
                        </motion.div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Your wishlist is empty</h1>
                            <p className="text-foreground/40 font-light tracking-wide leading-relaxed">Save your favorite luxury items here for later.</p>
                        </div>
                        <Button asChild size="lg" className="rounded-none w-full bg-primary text-primary-foreground h-16 text-[10px] uppercase tracking-[0.3em] font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-500">
                            <Link to="/shop">Explore Collection</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-32 pb-24 bg-gradient-to-b from-background via-background to-secondary/10 min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-serif mb-16 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                    My Wishlist
                </motion.h1>

                <div className="grid grid-cols-1 gap-8">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-8 bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/40 hover:to-secondary/20 transition-all duration-500 border border-border/30 hover:border-accent/20 group backdrop-blur-sm max-w-4xl"
                        >
                            <Link to={`/product/${item.id}`} className="shrink-0">
                                <div className="w-28 h-36 sm:w-40 sm:h-48 bg-secondary overflow-hidden shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>
                            </Link>

                            <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">{item.category}</p>
                                    <h3 className="text-xl sm:text-2xl font-serif tracking-tight">
                                        <Link to={`/product/${item.id}`} className="hover:text-accent transition-colors">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-lg font-light text-foreground/80">${item.price.toFixed(2)}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                    <Button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-primary/95 text-primary-foreground hover:bg-primary rounded-none transition-all duration-300 w-full sm:w-auto"
                                    >
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Bag
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        className="rounded-none border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors w-full sm:w-auto"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
