type Customer = {
  name: string
  country: string
}

type RecentCustomersProps = {
  customers: Customer[]
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
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
  )
}
