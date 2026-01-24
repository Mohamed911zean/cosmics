import { Users, UserPlus, Globe, HeartHandshake, MapPin, Mail } from "lucide-react"
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

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
]

export default function Customers() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-200">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Customers</h2>
              <p className="text-xs text-gray-500">Recent customers and engagement</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer, index) => (
                <tr key={customer.email} className="hover:bg-violet-50/30 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {customer.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{customer.name}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {customer.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                      {customer.orders} orders
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{customer.total}</span>
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
