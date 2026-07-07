import { Package } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Order = {
  id: string
  name: string
  price: string
  payment: string
  status: string
}

type RecentOrdersProps = {
  orders: Order[]
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Delivered: { bg: "bg-success", text: "text-success", dot: "bg-success" },
  Shipped: { bg: "bg-primary", text: "text-primary", dot: "bg-primary" },
  Processing: { bg: "bg-accent", text: "text-accent", dot: "bg-accent" },
  Pending: { bg: "bg-accent", text: "text-accent", dot: "bg-accent" },
  Return: { bg: "bg-primary", text: "text-primary", dot: "bg-primary" },
  "In Progress": { bg: "bg-primary", text: "text-primary", dot: "bg-primary" },
}

const paymentStyles: Record<string, string> = {
  Paid: "text-success font-semibold",
  Due: "text-primary font-semibold",
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const navigate = useNavigate()
  return (
    <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-purple-200">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">Latest transactions overview</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-soft/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => {
              const status = statusStyles[order.status] || statusStyles.Pending
              return (
                <tr 
                  key={`${order.name}-${index}`} 
                  onClick={() => navigate(`/dashboard/orders/${order.id}`)}
                  className="hover:bg-primary/30 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{order.name}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{order.price}</td>
                  <td className="px-6 py-4">
                    <span className={paymentStyles[order.payment] || "text-muted-foreground"}>
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
