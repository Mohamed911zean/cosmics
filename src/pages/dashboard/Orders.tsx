import { ShoppingBag, CheckCircle, Clock, XCircle } from "lucide-react"
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

const statusClasses: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Return: "bg-red-100 text-red-700",
  "In Progress": "bg-sky-100 text-sky-700",
}

export default function Orders() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2b2b2b]">Orders</h2>
            <p className="text-sm text-gray-500">Latest transactions and payment status</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#4B0082] text-white text-xs font-semibold">
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4 font-medium">Order ID</th>
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Total</th>
                <th className="pb-4 font-medium">Payment</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{order.id}</td>
                  <td className="py-4">{order.customer}</td>
                  <td className="py-4">{order.total}</td>
                  <td className="py-4">{order.payment}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
