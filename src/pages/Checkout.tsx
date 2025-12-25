import { motion } from "framer-motion"
import { CreditCard, Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function Checkout() {
    const handlePlaceOrder = () => {
        toast.success("Order Placed Successfully!", {
            description: "Thank you for your purchase. We've sent a confirmation email to you.",
            duration: 5000,
        })
    }

    return (
        <div className="pt-32 pb-24 bg-background min-h-screen">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* Checkout Form */}
                    <div className="lg:col-span-7 space-y-16">
                        <div className="space-y-10 animate-reveal-up">
                            <h1 className="text-5xl font-serif text-foreground tracking-tight">Checkout</h1>

                            {/* Shipping Information */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">01</span>
                                    <h2 className="text-lg font-medium tracking-tight uppercase tracking-widest text-[11px]">Shipping Information</h2>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">First Name</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Last Name</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Address</label>
                                    <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light" />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">City</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Postal Code</label>
                                        <input type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none transition-all font-light" />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="space-y-8 pt-12 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">02</span>
                                    <h2 className="text-lg font-medium tracking-tight uppercase tracking-widest text-[11px]">Payment Method</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="flex items-center gap-4 p-5 rounded-none border border-primary bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest outline-none">
                                        <CreditCard className="w-4 h-4 text-primary" />
                                        <span>Credit Card</span>
                                    </button>
                                    <button className="flex items-center gap-4 p-5 rounded-none border border-border/50 hover:bg-secondary/30 transition-all text-xs font-bold uppercase tracking-widest text-foreground/40 outline-none">
                                        <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-transparent" />
                                        </div>
                                        <span>PayPal</span>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input placeholder="CARD NUMBER" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none font-light placeholder:text-[10px] placeholder:tracking-widest" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="MM / YY" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none font-light placeholder:text-[10px] placeholder:tracking-widest" />
                                        <input placeholder="CVC" type="text" className="w-full h-14 px-4 bg-secondary/30 rounded-none border border-border/50 focus:border-primary outline-none font-light placeholder:text-[10px] placeholder:tracking-widest" />
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-18 rounded-none text-[10px] font-bold tracking-[0.3em] uppercase bg-primary text-primary-foreground mt-8 transition-all active:scale-[0.98]"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>

                    {/* Cart Summary Sidebar */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-secondary/20 p-10 rounded-none border border-border/40 sticky top-32 space-y-10"
                        >
                            <h3 className="text-2xl font-serif">In Your bag</h3>

                            <div className="space-y-6">
                                <div className="flex gap-6 group cursor-pointer">
                                    <div className="w-20 h-24 bg-secondary overflow-hidden shrink-0">
                                        <img src="/face_cream_product_mockup_1766625009300.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-medium text-[13px] uppercase tracking-wider text-foreground/80 line-clamp-1">Radiant Glow Serum</h4>
                                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Qty: 01</p>
                                        <p className="text-sm font-light mt-2">$89.00</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group cursor-pointer">
                                    <div className="w-20 h-24 bg-secondary overflow-hidden shrink-0">
                                        <img src="/eyeshadow_palette_product_mockup_1766625024551.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h4 className="font-medium text-[13px] uppercase tracking-wider text-foreground/80 line-clamp-1">Natural Glow Palette</h4>
                                        <p className="text-[10px] text-foreground/40 uppercase tracking-widest font-bold">Qty: 02</p>
                                        <p className="text-sm font-light mt-2">$156.00</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-border/50 space-y-5">
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Subtotal</span>
                                    <span>$245.00</span>
                                </div>
                                <div className="flex justify-between text-xs tracking-widest text-foreground/40 font-bold uppercase">
                                    <span>Shipping</span>
                                    <span className="text-accent">Complimentary</span>
                                </div>
                                <div className="flex justify-between pt-6 border-t border-border/50 text-2xl font-serif">
                                    <span>Total</span>
                                    <span>$245.00</span>
                                </div>
                            </div>

                            <div className="bg-background/50 p-6 space-y-4">
                                <div className="flex gap-4 text-[10px] tracking-[0.1em] font-bold uppercase">
                                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                                    <span className="text-foreground/60 leading-tight">Secure & encrypted payment</span>
                                </div>
                                <div className="flex gap-4 text-[10px] tracking-[0.1em] font-bold uppercase">
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
