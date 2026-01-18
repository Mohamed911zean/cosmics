import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Truck, ShieldCheck, ChevronLeft, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore } from "@/stores"

export function Checkout() {
    const navigate = useNavigate()
    const { items, getSubtotal, getTax, getTotal, clearCart } = useCartStore()
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
    const [isProcessing, setIsProcessing] = useState(false)

    const subtotal = getSubtotal()
    const tax = getTax()
    const total = getTotal()

    const handlePlaceOrder = async () => {
        setIsProcessing(true)

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        clearCart()
        setIsProcessing(false)

        toast.success("Order Placed Successfully!", {
            description: "Thank you for your purchase. We've sent a confirmation email to you.",
            duration: 5000,
        })

        navigate("/")
    }

    if (items.length === 0) {
        return (
            <div className="pt-48 pb-32 text-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-md mx-auto space-y-8"
                    >
                        <CheckCircle2 className="w-20 h-20 mx-auto text-accent/30" />
                        <h1 className="text-4xl font-serif">Your bag is empty</h1>
                        <p className="text-foreground/50">Add some products to continue checkout</p>
                        <Button asChild className="rounded-none h-14 px-10">
                            <Link to="/">Continue Shopping</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="pt-28 pb-24 bg-gradient-to-b from-background via-background to-secondary/10 min-h-screen">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to bag
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                    {/* Checkout Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-10"
                        >
                            <h1 className="text-4xl sm:text-5xl font-serif text-foreground tracking-tight">Checkout</h1>

                            {/* Shipping Information */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] text-accent font-bold">01</span>
                                    <h2 className="text-sm font-medium tracking-tight uppercase tracking-widest">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">First Name</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Last Name</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Email Address</label>
                                    <input type="email" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Address</label>
                                    <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">City</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Postal Code</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none transition-all font-light" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-6 pt-8 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] text-accent font-bold">02</span>
                                    <h2 className="text-sm font-medium tracking-tight uppercase tracking-widest">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod("card")}
                                        className={`flex items-center gap-4 p-5 rounded-none border transition-all text-xs font-bold uppercase tracking-widest outline-none ${paymentMethod === "card"
                                                ? "border-accent bg-accent/5 text-accent"
                                                : "border-border/50 hover:bg-secondary/30 text-foreground/60"
                                            }`}
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span>Credit Card</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod("paypal")}
                                        className={`flex items-center gap-4 p-5 rounded-none border transition-all text-xs font-bold uppercase tracking-widest outline-none ${paymentMethod === "paypal"
                                                ? "border-accent bg-accent/5 text-accent"
                                                : "border-border/50 hover:bg-secondary/30 text-foreground/60"
                                            }`}
                                    >
                                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
                                            <div className={`w-2 h-2 rounded-full transition-colors ${paymentMethod === "paypal" ? "bg-accent" : "bg-transparent"}`} />
                                        </div>
                                        <span>PayPal</span>
                                    </motion.button>
                                </div>

                                {paymentMethod === "card" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Card Number</label>
                                            <input placeholder="1234 5678 9012 3456" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none font-light placeholder:text-foreground/20 placeholder:text-[11px]" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Expiry Date</label>
                                                <input placeholder="MM / YY" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none font-light placeholder:text-foreground/20 placeholder:text-[11px]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">CVC</label>
                                                <input placeholder="123" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-accent outline-none font-light placeholder:text-foreground/20 placeholder:text-[11px]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <Button
                                size="lg"
                                disabled={isProcessing}
                                className="w-full h-16 sm:h-18 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase bg-primary text-primary-foreground mt-8 transition-all active:scale-[0.98] hover:shadow-lg hover:shadow-primary/20 disabled:opacity-70"
                                onClick={handlePlaceOrder}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center gap-3">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-3">
                                        <Lock className="w-4 h-4" />
                                        Place Order • ${total.toFixed(2)}
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Cart Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-gradient-to-br from-secondary/30 to-secondary/10 p-8 sm:p-10 rounded-none border border-border/30 sticky top-32 space-y-8 backdrop-blur-sm"
                        >
                            <h3 className="text-2xl font-serif">Order Summary</h3>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group cursor-pointer">
                                        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-secondary overflow-hidden shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="font-medium text-[12px] sm:text-[13px] uppercase tracking-wider text-foreground/80 line-clamp-1">{item.name}</h4>
                                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Qty: {String(item.quantity).padStart(2, '0')}</p>
                                            <p className="text-sm font-light mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-border/50 space-y-4">
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Shipping</span>
                                    <span className="text-accent">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t border-border/50 text-xl sm:text-2xl font-serif">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-background/50 p-5 space-y-3 rounded-sm">
                                <div className="flex gap-3 text-[10px] tracking-[0.1em] font-bold uppercase">
                                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                                    <span className="text-foreground/60 leading-tight">Secure & encrypted payment</span>
                                </div>
                                <div className="flex gap-3 text-[10px] tracking-[0.1em] font-bold uppercase">
                                    <Truck className="w-4 h-4 text-accent shrink-0" />
                                    <span className="text-foreground/60 leading-tight">Estimated delivery: 3-5 business days</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
