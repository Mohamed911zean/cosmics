import { Eye, ShoppingCart, MessageCircle, DollarSign } from "lucide-react"

const kpis = [
  { label: "Daily Views", value: "1,504", icon: Eye },
  { label: "Sales", value: "80", icon: ShoppingCart },
  { label: "Comments", value: "284", icon: MessageCircle },
  { label: "Earnings", value: "$7,842", icon: DollarSign },
]

const orders = [
  { name: "Star Refrigerator", price: "$1,200", payment: "Paid", status: "Delivered" },
  { name: "Dell Laptop", price: "$110", payment: "Due", status: "Pending" },
  { name: "Apple Watch", price: "$1,200", payment: "Paid", status: "Return" },
  { name: "Adidas Shoes", price: "$620", payment: "Due", status: "In Progress" },
]

const customers = [
  { name: "David", country: "Italy" },
  { name: "Amit", country: "India" },
  { name: "David", country: "Italy" },
  { name: "Amit", country: "India" },
  { name: "David", country: "Italy" },
]

const statusClasses: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Return: "bg-red-100 text-red-700",
  "In Progress": "bg-sky-100 text-sky-700",
}

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold text-[#4B0082]">{kpi.value}</div>
                <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
              </div>
              <div className="w-12 h-12 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500">
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
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
                  <tr key={`${order.name}-${index}`} className="border-t border-gray-100">
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

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#2b2b2b]">Recent Customers</h2>
          </div>
          <ul className="space-y-4">
            {customers.map((customer, index) => (
              <li key={`${customer.name}-${customer.country}-${index}`} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                  {customer.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{customer.name}</div>
                  <div className="text-xs text-gray-500">{customer.country}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
