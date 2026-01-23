import { Users, UserPlus, Globe, HeartHandshake } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"

const kpis = [
  { label: "Total Customers", value: "8,421", icon: Users },
  { label: "New This Month", value: "312", icon: UserPlus },
  { label: "Top Countries", value: "24", icon: Globe },
  { label: "Loyal Customers", value: "1,204", icon: HeartHandshake },
]

const customers = [
  { name: "David Stone", country: "Italy", email: "david@email.com", orders: 12, total: "$1,420" },
  { name: "Amit Verma", country: "India", email: "amit@email.com", orders: 9, total: "$980" },
  { name: "Sara Wood", country: "USA", email: "sara@email.com", orders: 14, total: "$1,880" },
  { name: "Maya Lee", country: "Canada", email: "maya@email.com", orders: 6, total: "$420" },
]

export default function Customers() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2b2b2b]">Customers</h2>
            <p className="text-sm text-gray-500">Recent customers and engagement</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#4B0082] text-white text-xs font-semibold">
            Add Customer
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4 font-medium">Customer</th>
                <th className="pb-4 font-medium">Country</th>
                <th className="pb-4 font-medium">Email</th>
                <th className="pb-4 font-medium">Orders</th>
                <th className="pb-4 font-medium">Total Spend</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {customers.map((customer) => (
                <tr key={customer.email} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{customer.name}</td>
                  <td className="py-4">{customer.country}</td>
                  <td className="py-4">{customer.email}</td>
                  <td className="py-4">{customer.orders}</td>
                  <td className="py-4">{customer.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
