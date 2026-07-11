import { motion } from "framer-motion"
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useCartStore } from "@/stores"
import { formatEGP } from "@/lib/currency"

export function Cart() {
    const { items, removeItem, updateQuantity, getSubtotal, getTax, getTotal } = useCartStore()

    const subtotal = getSubtotal()
    const tax = getTax()
    const total = getTotal()

    const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast.error(`${name} removed from bag`)
  }

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
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
                            <ShoppingBag className="w-12 h-12 text-foreground/20" />
                        </motion.div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Your bag is empty</h1>
                            <p className="text-foreground/40 font-light tracking-wide leading-relaxed">Discover our curated collection of luxury beauty and find your next favorite.</p>
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
                    Shopping Bag
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 p-6 sm:p-8 bg-gradient-to-br from-secondary/30 to-secondary/10 hover:from-secondary/40 hover:to-secondary/20 transition-all duration-500 border border-border/30 hover:border-accent/20 group backdrop-blur-sm"
                            >
                                <div className="w-28 h-36 sm:w-32 sm:h-40 bg-secondary overflow-hidden shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </div>

                                <div className="flex-1 space-y-4 text-center sm:text-left">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">{item.category}</p>
                                        <h3 className="text-xl sm:text-2xl font-serif tracking-tight">{item.name}</h3>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-4">
                                        <div className="flex items-center border border-border/60 bg-background/50 backdrop-blur-sm">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-secondary/50 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-secondary/50 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-light text-foreground/60">{formatEGP(item.price)} / ea</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                                    <p className="text-2xl font-light tracking-tight">{formatEGP(item.price * item.quantity)}</p>
                                    <button
                                        onClick={() => handleRemoveItem(item.id, item.name)}
                                        className="text-foreground/20 hover:text-destructive transition-all duration-300 p-3 hover:bg-destructive/10 rounded-sm group/delete"
                                    >
                                        <Trash2 className="w-5 h-5 transition-transform group-hover/delete:scale-110" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-gradient-to-br from-secondary/30 to-secondary/10 p-8 sm:p-10 rounded-none border border-border/30 space-y-10 sticky top-32 backdrop-blur-sm"
                        >
                            <h2 className="text-2xl font-serif">Order Summary</h2>

                            <div className="space-y-5">
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>{formatEGP(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Shipping</span>
                                    <span className="text-accent">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Estimated Tax</span>
                                    <span>{formatEGP(tax)}</span>
                                </div>
                                <div className="pt-8 border-t border-border/50 flex justify-between text-2xl sm:text-3xl font-serif">
                                    <span>Total</span>
                                    <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{formatEGP(total)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Button asChild size="lg" className="w-full h-16 sm:h-18 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase bg-primary text-primary-foreground group overflow-hidden transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-primary/20">
                                    <Link to="/checkout" className="relative z-10 flex items-center justify-center">
                                        Proceed to Checkout
                                        <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </Link>
                                </Button>
                                <p className="text-center text-[10px] text-foreground/30 font-bold uppercase tracking-widest">
                                    Shipping & taxes calculated at checkout
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}