
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Clock, CheckCircle2, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useOrderStore, useAuthStore } from "@/stores"
import { subscribeToUserOrders } from "@/lib/orders"

export function Orders() {
    const navigate = useNavigate()
    const { orders, fetchOrdersForCurrentUser, setOrders } = useOrderStore()
    const { user } = useAuthStore()

    useEffect(() => {
        if (user) {
            fetchOrdersForCurrentUser()
            
            // Subscribe to realtime updates
            const channel = subscribeToUserOrders(user.id, async () => {
                await fetchOrdersForCurrentUser()
            })
            
            return () => {
                channel.unsubscribe()
            }
        } else {
            setOrders([])
        }
    }, [user, fetchOrdersForCurrentUser, setOrders])

    if (orders.length === 0) {
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
                            <Package className="w-12 h-12 text-foreground/20" />
                        </motion.div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">No orders yet</h1>
                            <p className="text-foreground/40 font-light tracking-wide leading-relaxed">You haven't placed any orders yet. Start shopping to find your new favorites.</p>
                        </div>
                        <Button asChild size="lg" className="rounded-none w-full bg-primary text-primary-foreground h-16 text-[10px] uppercase tracking-[0.3em] font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-500">
                            <Link to="/">Start Shopping</Link>
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
                    Order History
                </motion.h1>

                <div className="space-y-10">
                    {orders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-surface/50 backdrop-blur-sm border border-border/30 overflow-hidden group hover:shadow-lg transition-all duration-500"
                        >
                            <div className="p-6 sm:p-8 border-b border-border/30 bg-secondary/10 flex flex-wrap items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Order ID</p>
                                    <p className="font-mono text-sm">#{order.orderNumber}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Date Placed</p>
                                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Total Amount</p>
                                    <p className="text-sm font-serif font-medium">${order.total.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">Status</p>
                                    <div className="flex items-center gap-2">
                                        {order.status === 'delivered' ? (
                                            <CheckCircle2 className="w-4 h-4 text-success" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-accent" />
                                        )}
                                        <span className="text-sm font-medium capitalize">{order.status}</span>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(`/orders/${order.id}`)}
                                    className="rounded-none"
                                >
                                    View Details
                                    <LinkIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>

                            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-serif">Items</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="w-16 h-20 bg-secondary overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm text-foreground/90">{item.name}</h4>
                                                    <p className="text-xs text-foreground/60">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                </div>
                                                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-serif">Shipping Details</h3>
                                    <div className="bg-secondary/20 p-6 rounded-sm space-y-3 text-sm">
                                        <p className="font-medium">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                        <p className="text-foreground/70">{order.shippingDetails.address}</p>
                                        <p className="text-foreground/70">{order.shippingDetails.city}, {order.shippingDetails.postalCode}</p>
                                        <p className="text-foreground/50 text-xs mt-4 pt-4 border-t border-border/30">{order.shippingDetails.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
