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
  { gradient: "from-primary to-primary", iconBg: "bg-surface/20" },
  { gradient: "from-success to-success", iconBg: "bg-surface/20" },
  { gradient: "from-accent to-accent", iconBg: "bg-surface/20" },
  { gradient: "from-primary to-primary", iconBg: "bg-surface/20" },
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
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-surface/10 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-surface/5" />

            <div className="relative z-10">
              <div className="text-3xl font-bold text-primary-foreground tracking-tight">{kpi.value}</div>
              <div className="text-sm text-primary-foreground/80 mt-1 font-medium">{kpi.label}</div>
            </div>
            <div className={`relative z-10 w-14 h-14 rounded-xl ${style.iconBg} backdrop-blur-sm flex items-center justify-center text-primary-foreground shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
