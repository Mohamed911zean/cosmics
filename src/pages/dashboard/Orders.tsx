import { ShoppingBag, CheckCircle, Clock, XCircle, Package } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"

const kpis = [
  { label: "Total Orders", value: "1,204", icon: ShoppingBag },
  { label: "Delivered", value: "860", icon: CheckCircle },
  { label: "Pending", value: "220", icon: Clock },
  { label: "Returns", value: "24", icon: XCircle },
]

const orders = [
  { id: "ORD-1024", customer: "David Stone", total: "$1,200", payment: "Paid", status: "Delivered" },
  { id: "ORD-1025", customer: "Amit Verma", total: "$110", payment: "Due", status: "Pending" },
  { id: "ORD-1026", customer: "Sara Wood", total: "$1,200", payment: "Paid", status: "Return" },
  { id: "ORD-1027", customer: "Maya Lee", total: "$620", payment: "Due", status: "In Progress" },
]

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Return: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
  "In Progress": { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
}

const paymentStyles: Record<string, string> = {
  Paid: "text-emerald-600 font-semibold",
  Due: "text-rose-600 font-semibold",
}

export default function Orders() {
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const status = statusStyles[order.status] || statusStyles.Pending
                return (
                  <tr key={order.id} className="hover:bg-violet-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-violet-700 bg-violet-50 px-2 py-1 rounded">
                        {order.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={paymentStyles[order.payment] || "text-gray-600"}>
                        {order.payment}
                      </span>
                    </td>
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
