import { motion } from "framer-motion"
import { User, Package, ShoppingBag, LogOut, Mail, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore, useCartStore, useOrderStore } from "@/stores"
import { Link, useNavigate } from "react-router-dom"
import { formatEGP } from "@/lib/currency"



import { useState } from "react"
import { toast } from "sonner"

export function Account() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const { orders } = useOrderStore()
    const { items: cartItems } = useCartStore()
    const [activeTab, setActiveTab] = useState<"profile" | "orders" | "cart">("profile")

    const handleLogout = async () => {
        try {
            await logout()
            toast.success("Logged out successfully")
            navigate("/")
        } catch (error) {
            toast.error("Failed to logout")
        }
    }

    if (!user) {
        // Should catch this by ProtectedRoute, but good fallback
        return (
            <div className="pt-32 pb-24 text-center min-h-screen">
                <p>Please log in to view your account.</p>
                <Button asChild className="mt-4">
                    <Link to="/login">Log In</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="pt-32 pb-24 bg-gradient-to-b from-background via-background to-secondary/10 min-h-screen">
            <div className="container mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                My Account
                            </h1>
                            <p className="text-foreground/60">Welcome back, {user.email?.split('@')[0]}</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-primary"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar / Tabs */}
                        <div className="w-full lg:w-64 shrink-0 space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === "profile"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-secondary/50 text-foreground/70"
                                    }`}
                            >
                                <UserCircle className="w-5 h-5" />
                                Profile Details
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === "orders"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-secondary/50 text-foreground/70"
                                    }`}
                            >
                                <Package className="w-5 h-5" />
                                Order History
                                <span className="ml-auto bg-background/20 text-[10px] px-2 py-0.5 rounded-full">
                                    {orders.length}
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === "cart"
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-secondary/50 text-foreground/70"
                                    }`}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Shopping Bag
                                <span className="ml-auto bg-background/20 text-[10px] px-2 py-0.5 rounded-full">
                                    {cartItems.length}
                                </span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 bg-surface/50 backdrop-blur-sm border border-border/30 rounded-2xl p-6 md:p-10 min-h-[500px]">
                            {/* Profile Tab */}
                            {activeTab === "profile" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-2xl font-serif">Profile Information</h2>
                                    <div className="grid gap-8 max-w-xl">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 float-left w-full">Email Address</label>
                                            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg border border-border/30">
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                                    <Mail className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="font-medium truncate">{user.email}</p>
                                                    <p className="text-xs text-foreground/50">Used for signing in and communications</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 float-left w-full">Account Status</label>
                                            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg border border-border/30">
                                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Active Member</p>
                                                    <p className="text-xs text-foreground/50">Member since {new Date().getFullYear()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === "orders" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-serif">Order History</h2>
                                        <Button variant="ghost" asChild className="text-xs" size="sm">
                                            <Link to="/orders">View Full History</Link>
                                        </Button>
                                    </div>

                                    {orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.slice(0, 3).map((order) => (
                                                <div key={order.id} className="p-4 border border-border/30 rounded-lg hover:bg-secondary/10 transition-colors">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div>
                                                            <p className="font-mono text-xs">#{order.id}</p>
                                                            <p className="text-xs text-foreground/50">{new Date(order.date).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">{formatEGP(order.total)}</p>
                                                            <p className="text-[10px] uppercase font-bold text-accent">{order.status}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 relative">
                                                        {order.items.slice(0, 4).map((item) => (
                                                            <div key={item.id} className="w-10 h-10 bg-secondary rounded-sm overflow-hidden">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                        ))}
                                                        {order.items.length > 4 && (
                                                            <div className="w-10 h-10 bg-secondary rounded-sm flex items-center justify-center text-[10px] text-foreground/50 font-bold">
                                                                +{order.items.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 text-foreground/30">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <p className="text-foreground/50">No orders placed yet.</p>
                                            <Button asChild variant="link" className="mt-2 text-accent">
                                                <Link to="/shop">Start Shopping</Link>
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Cart Tab */}
                            {activeTab === "cart" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-serif">Shopping Bag</h2>
                                        <Button variant="ghost" asChild className="text-xs" size="sm">
                                            <Link to="/cart">Go to Cart</Link>
                                        </Button>
                                    </div>

                                    {cartItems.length > 0 ? (
                                        <div className="space-y-4">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex gap-4 p-4 border border-border/30 rounded-lg">
                                                    <div className="w-16 h-20 bg-secondary shrink-0 overflow-hidden rounded-sm">
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium truncate">{item.name}</h4>
                                                        <p className="text-sm text-foreground/50">{item.category}</p>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <p className="text-sm">Qty: {item.quantity}</p>
                                                            <p className="font-medium">{formatEGP(item.price * item.quantity)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-4 mt-4 border-t border-border/30">
                                                <Button asChild className="w-full">
                                                    <Link to="/checkout">Proceed to Checkout</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4 text-foreground/30">
                                                <ShoppingBag className="w-8 h-8" />
                                            </div>
                                            <p className="text-foreground/50">Your bag is empty.</p>
                                            <Button asChild variant="link" className="mt-2 text-accent">
                                                <Link to="/shop">Browse Products</Link>
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}