import { useEffect } from "react"
import { ShoppingBag, CheckCircle, Clock, Package, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatEGP } from "@/lib/currency"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  delivered: { bg: "bg-success", text: "text-white", dot: "bg-green-500" },
  shipped: { bg: "bg-primary", text: "text-white", dot: "bg-blue-500" },
  processing: { bg: "bg-accent", text: "text-white", dot: "bg-yellow-500" },
}

export default function Orders() {
  const navigate = useNavigate()
  const {
    fetchAllOrdersForAdmin,
    isLoadingAllOrders,
    allOrders,
    getAllOrdersByStatus,
  } = useOrderStore()

  useEffect(() => {
    fetchAllOrdersForAdmin()
  }, [fetchAllOrdersForAdmin])

  const deliveredCount = getAllOrdersByStatus("delivered").length
  const shippedCount = getAllOrdersByStatus("shipped").length
  const processingCount = getAllOrdersByStatus("processing").length
  const totalOrders = allOrders.length
  const newestOrders = [...allOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const kpis = [
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag },
    { label: "Delivered", value: deliveredCount.toString(), icon: CheckCircle },
    { label: "Shipped", value: shippedCount.toString(), icon: Package },
    { label: "Processing", value: processingCount.toString(), icon: Clock },
  ]

  if (isLoadingAllOrders) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading orders from all customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-purple-200">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Orders</h2>
              <p className="text-xs text-muted-foreground">Latest transactions and payment status</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-soft/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newestOrders.map((order) => {
                const status = statusStyles[order.status] || statusStyles.processing
                const customer = `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
                return (
                  <tr 
                    key={order.id} 
                    onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                    className="hover:bg-primary/30 transition-colors duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{customer}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{EGP.format(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full  ${status.dot}`} />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}