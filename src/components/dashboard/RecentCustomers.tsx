import { Users, MapPin } from "lucide-react"

type Customer = {
  name: string
  country: string
}

type RecentCustomersProps = {
  customers: Customer[]
}

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
]

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customers</h2>
            <p className="text-xs text-gray-500">New registered users</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {customers.map((customer, index) => (
          <li
            key={`${customer.name}-${customer.country}-${index}`}
            className="px-6 py-4 flex items-center gap-4 hover:bg-violet-50/30 transition-colors duration-200"
          >
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
              {customer.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{customer.name}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin className="w-3 h-3" />
                {customer.country}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
