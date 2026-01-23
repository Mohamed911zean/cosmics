import { type LucideIcon } from "lucide-react"

type KpiItem = {
  label: string
  value: string
  icon: LucideIcon
}

type DashboardKpiCardsProps = {
  items: KpiItem[]
}

export function DashboardKpiCards({ items }: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((kpi) => {
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
  )
}
