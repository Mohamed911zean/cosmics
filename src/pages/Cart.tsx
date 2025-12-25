import { motion } from "framer-motion"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { toast } from "sonner"

export function Cart() {
    const cartItems = [
        {
            id: 1,
            name: "Radiant Glow Serum",
            price: 89.00,
            quantity: 1,
            image: "/face_cream_product_mockup_1766625009300.png",
            category: "Skincare"
        },
        {
            id: 2,
            name: "Natural Glow Palette",
            price: 78.00,
            quantity: 2,
            image: "/eyeshadow_palette_product_mockup_1766625024551.png",
            category: "Makeup"
        }
    ]

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const shipping = 0
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    const removeItem = (name: string) => {
        toast.error(`${name} removed from bag`)
    }

    if (cartItems.length === 0) {
        return (
            <div className="pt-48 pb-32 text-center">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto space-y-10 animate-reveal-up">
                        <div className="w-32 h-32 bg-secondary/50 flex items-center justify-center mx-auto transition-all duration-700 hover:scale-110">
                            <ShoppingBag className="w-12 h-12 text-foreground/20" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-serif">Your bag is empty</h1>
                            <p className="text-foreground/40 font-light tracking-wide">Discover our curated collection of luxury beauty and find your next favorite.</p>
                        </div>
                        <Button asChild size="lg" className="rounded-none w-full bg-primary text-primary-foreground h-16 text-[10px] uppercase tracking-[0.3em] font-bold">
                            <Link to="/">Explore Collection</Link>
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-32 pb-24 bg-background min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <h1 className="text-6xl font-serif mb-16 animate-reveal-up">Shopping Bag</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6">
                            {cartItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                                    className="flex flex-col sm:flex-row items-center gap-10 p-8 bg-secondary/20 hover:bg-secondary/30 transition-all duration-500 border border-border/40 group"
                                >
                                    <div className="w-32 h-40 bg-secondary overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>

                                    <div className="flex-1 space-y-4 text-center sm:text-left">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em]">{item.category}</p>
                                            <h3 className="text-2xl font-serif tracking-tight">{item.name}</h3>
                                        </div>
                                        <div className="flex items-center justify-center sm:justify-start gap-8">
                                            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                            <p className="text-sm font-light text-foreground/60">${item.price.toFixed(2)} / ea</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end gap-6 shrink-0">
                                        <p className="text-2xl font-light tracking-tight">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            onClick={() => removeItem(item.name)}
                                            className="text-foreground/20 hover:text-accent transition-colors p-3 hover:bg-accent/5"
                                        >
                                            <Trash2 className="w-5 h-5 transition-transform hover:scale-110" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="bg-secondary/10 p-10 rounded-none border border-border/40 space-y-10 sticky top-32"
                        >
                            <h2 className="text-2xl font-serif">Order Summary</h2>

                            <div className="space-y-5">
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Shipping</span>
                                    <span className="text-accent">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Estimated Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-8 border-t border-border/50 flex justify-between text-3xl font-serif">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Button asChild size="lg" className="w-full h-18 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase bg-primary text-primary-foreground group overflow-hidden transition-all active:scale-[0.98]">
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
