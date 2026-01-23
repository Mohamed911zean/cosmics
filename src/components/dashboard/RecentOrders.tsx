type Order = {
  name: string
  price: string
  payment: string
  status: string
}

type RecentOrdersProps = {
  orders: Order[]
}

const statusClasses: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Return: "bg-red-100 text-red-700",
  "In Progress": "bg-sky-100 text-sky-700",
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[#2b2b2b]">Recent Orders</h2>
        <button className="px-4 py-2 rounded-lg bg-[#4B0082] text-white text-xs font-semibold">
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-4 font-medium">Name</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">Payment</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.map((order, index) => (
              <tr key={`${order.name}-${index}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 font-medium">{order.name}</td>
                <td className="py-4">{order.price}</td>
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
  )
}
