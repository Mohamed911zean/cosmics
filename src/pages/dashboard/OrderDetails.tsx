import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { fetchOrderById, updateOrderStatus, subscribeToOrderUpdates, type OrderStatus } from "@/lib/orders"
import { formatEGP } from "@/lib/currency"
import { toast } from "sonner"

const statusOptions: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { allOrders } = useOrderStore()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!id) return

    let active = true

    const loadOrder = async () => {
      try {
        // First check if we have it in the store
        const fromStore = allOrders.find(o => o.id === id)
        if (fromStore) {
          setOrder(fromStore)
          setIsLoading(false)
          return
        }

        // If not, fetch from Supabase
        const data = await fetchOrderById(id)
        if (active && data) {
          setOrder(data)
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    loadOrder()

    // Subscribe to real-time updates
    const channel = subscribeToOrderUpdates(id, async () => {
      const updated = await fetchOrderById(id)
      if (updated) {
        setOrder(updated)
      }
    })

    return () => {
      active = false
      channel.unsubscribe()
    }
  }, [id, allOrders])

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return
    setIsUpdating(true)
    try {
      await updateOrderStatus(order.id, newStatus)
      setOrder((prev: any) => ({ ...prev, status: newStatus }))
      toast.success(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast.error("Failed to update order status")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Package className="w-16 h-16 text-border mb-4" />
        <h2 className="text-2xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/dashboard/orders" 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-success text-success'
      case 'shipped': return 'bg-primary text-primary'
      case 'processing': return 'bg-accent text-accent'
      default: return 'bg-muted text-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Status update dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">Update Status:</label>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={isUpdating}
            className="px-3 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-soft/50">
              <h3 className="font-semibold text-foreground">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="p-6 flex items-center gap-4">
                  <div className="w-20 h-24 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatEGP(item.price * item.quantity)}</p>
                    <p className="text-sm text-muted-foreground">{formatEGP(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-surface-soft/50 border-t border-border">
              <div className="flex flex-col gap-2 max-w-xs ml-auto">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatEGP(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{formatEGP(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Discount</span>
                  <span>-{formatEGP(order.discountTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>Total</span>
                  <span>{formatEGP(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Customer & Shipping Info */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-soft/50">
              <h3 className="font-semibold text-foreground">Customer Details</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary shrink-0">
                  <span className="font-bold text-lg">
                    {order.shippingDetails.firstName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${order.shippingDetails.email}`} className="hover:text-primary transition-colors">
                    {order.shippingDetails.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${order.shippingDetails.phone}`} className="hover:text-primary transition-colors">
                    {order.shippingDetails.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-soft/50">
              <h3 className="font-semibold text-foreground">Shipping Address</h3>
            </div>
            <div className="p-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <address className="not-italic text-sm text-muted-foreground space-y-1">
                  <p>{order.shippingDetails.address}</p>
                  <p>{order.shippingDetails.city}, {order.shippingDetails.postalCode}</p>
                </address>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-soft/50">
              <h3 className="font-semibold text-foreground">Payment</h3>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">
                Method: <span className="capitalize">{order.paymentMethod || "Card"}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Status: <span className="capitalize">{order.paymentStatus}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}