import { useEffect } from "react"
import { ShoppingBag, CheckCircle, Clock, Package, Loader2 } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Shipped: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  Processing: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
}

export default function Orders() {
  const {
    fetchAllOrdersForAdmin,
    isLoadingAllOrders,
    allOrders,
    getAllOrdersByStatus,
  } = useOrderStore()

  useEffect(() => {
    fetchAllOrdersForAdmin()
  }, [fetchAllOrdersForAdmin])

  const deliveredCount = getAllOrdersByStatus("Delivered").length
  const shippedCount = getAllOrdersByStatus("Shipped").length
  const processingCount = getAllOrdersByStatus("Processing").length
  const totalOrders = allOrders.length

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
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading orders from all customers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Orders</h2>
              <p className="text-xs text-gray-500">Latest transactions and payment status</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allOrders.map((order) => {
                const status = statusStyles[order.status] || statusStyles.Processing
                const customer = `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
                return (
                  <tr key={order.id} className="hover:bg-violet-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-violet-700 bg-violet-50 px-2 py-1 rounded">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{customer}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
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
