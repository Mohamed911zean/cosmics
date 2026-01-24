import { Package } from "lucide-react"

type Order = {
  name: string
  price: string
  payment: string
  status: string
}

type RecentOrdersProps = {
  orders: Order[]
}

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

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-500">Latest transactions overview</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => {
              const status = statusStyles[order.status] || statusStyles.Pending
              return (
                <tr key={`${order.name}-${index}`} className="hover:bg-violet-50/30 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{order.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{order.price}</td>
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
  )
}
