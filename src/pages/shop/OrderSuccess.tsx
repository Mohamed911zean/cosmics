import { motion } from "framer-motion"
import { Check, ArrowRight, Package } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function OrderSuccess() {
    return (
        <div className="min-h-screen bg-surface-soft flex items-center justify-center py-20 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-surface rounded-3xl shadow-xl p-8 sm:p-12 text-center"
            >
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-success" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                    Order Confirmed!
                </h1>
                <p className="text-muted-foreground mb-8">
                    Thank you for your purchase. We are going to contact with you in whatssap to confirm the order.
                </p>

                <div className="space-y-4">
                    <Link to="/orders">
                        <Button className="w-full h-12 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary hover:to-accent text-primary-foreground border-0 font-medium">
                            <Package className="mr-2 w-5 h-5" />
                            View My Order
                        </Button>
                    </Link>

                    <Link to="/shop">
                        <Button variant="outline" className="w-full h-12 rounded-full border-border hover:bg-surface-soft hover:text-foreground font-medium">
                            Continue Shopping
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
