import { type LucideIcon } from "lucide-react"

type KpiItem = {
  label: string
  value: string
  icon: LucideIcon
}

type DashboardKpiCardsProps = {
  items: KpiItem[]
}

const cardStyles = [
  { gradient: "from-violet-600 to-purple-700", iconBg: "bg-white/20" },
  { gradient: "from-emerald-500 to-teal-600", iconBg: "bg-white/20" },
  { gradient: "from-amber-500 to-orange-600", iconBg: "bg-white/20" },
  { gradient: "from-rose-500 to-pink-600", iconBg: "bg-white/20" },
]

export function DashboardKpiCards({ items }: DashboardKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((kpi, index) => {
        const Icon = kpi.icon
        const style = cardStyles[index % cardStyles.length]
        return (
          <div
            key={kpi.label}
            className={`relative overflow-hidden bg-gradient-to-br ${style.gradient} rounded-2xl p-6 flex items-center justify-between shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-default group`}
          >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative z-10">
              <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className="text-sm text-white/80 mt-1 font-medium">{kpi.label}</div>
            </div>
            <div className={`relative z-10 w-14 h-14 rounded-xl ${style.iconBg} backdrop-blur-sm flex items-center justify-center text-white shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
