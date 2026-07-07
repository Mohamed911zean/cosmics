import { Users, MapPin } from "lucide-react"

type Customer = {
  name: string
  country: string
}

type RecentCustomersProps = {
  customers: Customer[]
}

const avatarGradients = [
  "from-primary to-primary",
  "from-success to-success",
  "from-accent to-accent",
  "from-primary to-primary",
  "from-primary to-primary",
]

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success flex items-center justify-center shadow-lg shadow-emerald-200">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Recent Customers</h2>
            <p className="text-xs text-muted-foreground">New registered users</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100">
        {customers.map((customer, index) => (
          <li
            key={`${customer.name}-${customer.country}-${index}`}
            className="px-6 py-4 flex items-center gap-4 hover:bg-primary/30 transition-colors duration-200"
          >
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md`}>
              {customer.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">{customer.name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
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
