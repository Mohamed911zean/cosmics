import { useEffect, useMemo } from "react"
import { Users, UserPlus, Globe, HeartHandshake, MapPin, Mail, Loader2, Phone } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { formatEGP } from "@/lib/currency"

const avatarGradients = [
  "from-primary to-primary",
  "from-success to-success",
  "from-accent to-accent",
  "from-primary to-primary",
]

export default function Customers() {
  const {
    fetchAllOrdersForAdmin,
    isLoadingAllOrders,
    allOrders,
    getAllOrdersTotalRevenue
  } = useOrderStore()

  useEffect(() => {
    fetchAllOrdersForAdmin()
  }, [fetchAllOrdersForAdmin])

  const customers = useMemo(() => {
    const map = new Map<string, {
      name: string
      email: string
      phone?: string
      address?: string
      city?: string
      postalCode?: string
      orders: number
      total: number
      latestDate: number
    }>()

    for (const order of allOrders) {
      const s = order.shippingDetails
      const email = s.email
      const name = `${s.firstName} ${s.lastName}`
      const existing = map.get(email)
      if (existing) {
        existing.orders += 1
        existing.total += order.total
        if (order.date > existing.latestDate) {
          existing.name = name
          existing.phone = s.phone
          existing.address = s.address
          existing.city = s.city
          existing.postalCode = s.postalCode
          existing.latestDate = order.date
        }
      } else {
        map.set(email, {
          name,
          email,
          phone: s.phone,
          address: s.address,
          city: s.city,
          postalCode: s.postalCode,
          orders: 1,
          total: order.total,
          latestDate: order.date
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => b.orders - a.orders)
  }, [allOrders])

  const kpis = [
    { label: "Total Customers", value: customers.length.toString(), icon: Users },
    { label: "Total Orders", value: allOrders.length.toString(), icon: UserPlus },
    { label: "Total Revenue", value: formatEGP(getAllOrdersTotalRevenue()), icon: HeartHandshake },
    { label: "Cities", value: new Set(customers.map(c => c.city || "")).size.toString(), icon: Globe },
  ]

  if (isLoadingAllOrders) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading customers from orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary flex items-center justify-center shadow-lg shadow-purple-200">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Customers</h2>
              <p className="text-xs text-muted-foreground">Details from checkout</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-soft/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Postal Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orders</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer, index) => (
                <tr key={customer.email} className="hover:bg-primary/30 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md`}>
                        {customer.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">Customer</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {customer.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{customer.address || "-"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{customer.city || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-foreground">{customer.postalCode || "-"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-primary">
                      {customer.orders} orders
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground">{formatEGP(customer.total)}</span>
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