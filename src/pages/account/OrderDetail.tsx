import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchOrderById, subscribeToOrderUpdates, type Order } from "@/lib/orders"
import { formatEGP } from "@/lib/currency"


const statusSteps = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
]

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(id)
        setOrder(data)
      } catch (error) {
        console.error("Error loading order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrder()

    // Subscribe to realtime updates
    const channel = subscribeToOrderUpdates(id, async () => {
      await loadOrder()
    })

    return () => {
      channel.unsubscribe()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="pt-48 pb-32 text-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h1 className="text-3xl font-serif mb-2">Loading Order...</h1>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="pt-48 pb-32 text-center min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto space-y-6"
          >
            <Package className="w-16 h-16 text-border mx-auto" />
            <h1 className="text-3xl font-serif">Order Not Found</h1>
            <p className="text-foreground/60">
              The order you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
            <Button asChild className="rounded-none">
              <Link to="/orders">Back to Orders</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.status === order.status
  )
  const effectiveStepIndex =
    currentStepIndex === -1 ? 0 : Math.max(0, currentStepIndex)

  return (
    <div className="pt-32 pb-24 bg-gradient-to-b from-background via-background to-secondary/10 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Back button and header */}
          <div className="flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-secondary/50 rounded-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-serif text-foreground">
                Order #{order.orderNumber}
              </h1>
              <p className="text-foreground/60 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Status timeline */}
          <div className="bg-surface/50 backdrop-blur-sm border border-border/30 p-8 mb-10">
            <h2 className="text-2xl font-serif mb-8">Order Status</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-border/50" />

              <div className="space-y-8">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < effectiveStepIndex
                  const isCurrent = index === effectiveStepIndex

                  const Icon = step.icon

                  return (
                    <div key={step.status} className="flex items-start gap-6">
                      <div className="relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-success text-white"
                              : isCurrent
                              ? "bg-primary text-white"
                              : "bg-border/50 text-foreground/40"
                          }`}
                        >
                          {isCompleted || isCurrent ? (
                            <Icon className="w-4 h-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-foreground/30" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3
                          className={`font-medium ${
                            isCompleted || isCurrent
                              ? "text-foreground"
                              : "text-foreground/40"
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p className="text-sm text-foreground/50 mt-1">
                          {step.status}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order items */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-surface/50 backdrop-blur-sm border border-border/30 p-8">
                <h2 className="text-2xl font-serif mb-6">Order Items</h2>
                <div className="space-y-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-6 pb-6 border-b border-border/30 last:border-0 last:pb-0"
                    >
                      <div className="w-24 h-32 bg-secondary overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-foreground/60 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">
                          {formatEGP(item.price * item.quantity)}
                        </p>
                        <p className="text-sm text-foreground/50">
                          {formatEGP(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 pt-6 border-t border-border/30">
                  <div className="space-y-3 max-w-xs ml-auto">
                    <div className="flex justify-between text-sm text-foreground/60">
                      <span>Subtotal</span>
                      <span>{formatEGP(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/60">
                      <span>Shipping</span>
                      <span>{formatEGP(order.shippingFee)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-foreground/60">
                      <span>Discount</span>
                      <span>-{formatEGP(order.discountTotal)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-3 border-t border-border/30">
                      <span>Total</span>
                      <span>{formatEGP(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div className="space-y-8">
              <div className="bg-surface/50 backdrop-blur-sm border border-border/30 p-8">
                <h2 className="text-2xl font-serif mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-foreground/50 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">
                        {order.shippingDetails.firstName}{" "}
                        {order.shippingDetails.lastName}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {order.shippingDetails.address}
                      </p>
                      <p className="text-sm text-foreground/70">
                        {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-foreground/50 shrink-0" />
                    <p className="text-sm text-foreground/70">
                      {order.shippingDetails.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-foreground/50 shrink-0" />
                    <p className="text-sm text-foreground/70">
                      {order.shippingDetails.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface/50 backdrop-blur-sm border border-border/30 p-8">
                <h2 className="text-2xl font-serif mb-6">Payment</h2>
                <div className="space-y-3">
                  <p className="text-sm text-foreground/70">
                    Method: {order.paymentMethod || "Card"}
                  </p>
                  <p className="text-sm text-foreground/70">
                    Status: <span className="capitalize">{order.paymentStatus}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button asChild variant="outline" className="rounded-none">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}