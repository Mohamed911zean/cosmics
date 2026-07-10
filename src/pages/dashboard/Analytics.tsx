// src/pages/dashboard/Analytics.tsx
import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Package,
  AlertTriangle,
  Users,
  Heart,
  BellRing,
  Loader2,
  DollarSign,
} from "lucide-react"
import {
  fetchRevenueSummary,
  fetchProductPerformance,
  fetchStockHealth,
  fetchCategoryPerformance,
  fetchCustomerSummary,
  fetchDemandSignals,
  type RevenueSummary,
  type ProductPerformanceRow,
  type StockHealth,
  type CategoryPerformance,
  type CustomerSummary,
  type DemandSignal,
} from "@/lib/analytics"

const EGP = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 0,
})

function money(n: number) {
  return EGP.format(n || 0)
}

function pctChange(current: number, prior: number): number | null {
  if (prior === 0) return current > 0 ? null : 0 // no baseline to compare to
  return ((current - prior) / prior) * 100
}

function TrendBadge({ current, prior }: { current: number; prior: number }) {
  const change = pctChange(current, prior)
  if (change === null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <Minus className="w-3 h-3" /> No comparison yet
      </span>
    )
  }
  const isUp = change > 0.5
  const isDown = change < -0.5
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isUp ? "text-emerald-600" : isDown ? "text-red-500" : "text-muted-foreground"
      }`}
    >
      {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
      {Math.abs(change).toFixed(0)}%
    </span>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: any
  label: string
  value: string
  trend?: React.ReactNode
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        {trend}
      </div>
      <p className="text-2xl font-bold text-foreground leading-none mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

const PIE_COLORS = ["#3b2a60", "#d3c5f6", "#c9a227", "#8b7ab8", "#e8dff9"]

export default function Analytics() {
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null)
  const [products, setProducts] = useState<ProductPerformanceRow[]>([])
  const [stockHealth, setStockHealth] = useState<StockHealth | null>(null)
  const [categories, setCategories] = useState<CategoryPerformance[]>([])
  const [customers, setCustomers] = useState<CustomerSummary | null>(null)
  const [demand, setDemand] = useState<DemandSignal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setError(null)

    Promise.all([
      fetchRevenueSummary(),
      fetchProductPerformance(),
      fetchStockHealth(),
      fetchCategoryPerformance(),
      fetchCustomerSummary(),
      fetchDemandSignals(),
    ])
      .then(([rev, prod, stock, cats, cust, dem]) => {
        if (!active) return
        setRevenue(rev)
        setProducts(prod)
        setStockHealth(stock)
        setCategories(cats)
        setCustomers(cust)
        setDemand(dem)
      })
      .catch((err) => {
        console.error("Failed to load analytics:", err)
        if (active) setError("Couldn't load analytics data. Try refreshing.")
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  const hasAnyOrders = (revenue?.series30d.reduce((s, p) => s + p.orderCount, 0) ?? 0) > 0
  const topProducts = products.filter((p) => p.salesCount > 0).slice(0, 8)
  const noSalesYetProducts = products.filter((p) => p.salesCount === 0)

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your brand's performance at a glance — revenue, products, and customers.
        </p>
      </div>

      {/* ============ 1. REVENUE ============ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Revenue
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={DollarSign}
            label="Today's Revenue"
            value={money(revenue?.todayRevenue ?? 0)}
            trend={<TrendBadge current={revenue?.todayRevenue ?? 0} prior={revenue?.yesterdayRevenue ?? 0} />}
          />
          <KpiCard
            icon={DollarSign}
            label="Last 7 Days"
            value={money(revenue?.last7DaysRevenue ?? 0)}
            trend={<TrendBadge current={revenue?.last7DaysRevenue ?? 0} prior={revenue?.prior7DaysRevenue ?? 0} />}
          />
          <KpiCard
            icon={DollarSign}
            label="Last 30 Days"
            value={money(revenue?.last30DaysRevenue ?? 0)}
            trend={<TrendBadge current={revenue?.last30DaysRevenue ?? 0} prior={revenue?.prior30DaysRevenue ?? 0} />}
          />
          <KpiCard
            icon={DollarSign}
            label="Avg. Order Value (30d)"
            value={money(revenue?.averageOrderValue30d ?? 0)}
          />
        </div>

        <SectionCard title="Revenue — last 30 days" subtitle="Daily revenue, EGP">
          {hasAnyOrders ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenue?.series30d}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3b2a6015" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(d) => d.slice(5)}
                  interval={4}
                />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} width={50} />
                <Tooltip
                  formatter={(value) => [money(Number(value)), "Revenue"]}
                  labelFormatter={(d) => d}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b2a60" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="No orders in the last 30 days yet — this chart will fill in as orders come in." />
          )}
        </SectionCard>
      </section>

      {/* ============ 2. PRODUCTS & STOCK ============ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Products & Stock
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Package} label="Active Products" value={String(stockHealth?.totalActiveProducts ?? 0)} />
          <KpiCard
            icon={AlertTriangle}
            label="Low Stock"
            value={String(stockHealth?.lowStockCount ?? 0)}
          />
          <KpiCard
            icon={AlertTriangle}
            label="Out of Stock"
            value={String(stockHealth?.outOfStockCount ?? 0)}
          />
          <KpiCard icon={Package} label="Healthy Stock" value={String(stockHealth?.healthyStockCount ?? 0)} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <SectionCard title="Best sellers" subtitle="By units sold (all time)">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topProducts} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#3b2a6015" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={110}
                    tickFormatter={(v: string) => (v.length > 16 ? v.slice(0, 16) + "…" : v)}
                  />
                  <Tooltip formatter={(value, key) => [key === "revenue" ? money(Number(value)) : value, key === "revenue" ? "Revenue" : "Units sold"]} />
                  <Bar dataKey="salesCount" fill="#3b2a60" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No sales recorded yet. Once orders come in, your best sellers show up here." />
            )}
          </SectionCard>

          <SectionCard title="Stock alerts" subtitle="Products that need attention now">
            <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
              {stockHealth?.outOfStockProducts.length ? (
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Out of stock ({stockHealth.outOfStockProducts.length})
                  </p>
                  <ul className="space-y-1.5">
                    {stockHealth.outOfStockProducts.map((p) => (
                      <li key={p.id} className="text-sm text-foreground bg-red-50 rounded-lg px-3 py-2">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {stockHealth?.lowStockProducts.length ? (
                <div>
                  <p className="text-xs font-semibold text-amber-600 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Low stock ({stockHealth.lowStockProducts.length})
                  </p>
                  <ul className="space-y-1.5">
                    {stockHealth.lowStockProducts.map((p) => (
                      <li
                        key={p.id}
                        className="text-sm text-foreground bg-amber-50 rounded-lg px-3 py-2 flex items-center justify-between"
                      >
                        <span>{p.name}</span>
                        <span className="text-xs font-semibold text-amber-700">{p.stockQuantity} left</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {!stockHealth?.outOfStockProducts.length && !stockHealth?.lowStockProducts.length && (
                <EmptyState message="All active products have healthy stock levels right now." />
              )}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Revenue by category" subtitle="All-time, based on units sold × price">
          {categories.some((c) => c.revenue > 0) ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={220} className="sm:max-w-[220px]">
                <PieChart>
                  <Pie
                    data={categories.filter((c) => c.revenue > 0)}
                    dataKey="revenue"
                    nameKey="categoryName"
                    innerRadius={50}
                    outerRadius={90}
                  >
                    {categories.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => money(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="flex-1 space-y-2 w-full">
                {categories
                  .filter((c) => c.revenue > 0)
                  .map((c, i) => (
                    <li key={c.categoryId} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        {c.categoryName}
                      </span>
                      <span className="font-medium text-foreground">{money(c.revenue)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <EmptyState message="No category sales yet — this fills in once products start selling." />
          )}
        </SectionCard>

        {noSalesYetProducts.length > 0 && (
          <SectionCard
            title="Not selling yet"
            subtitle={`${noSalesYetProducts.length} active product(s) with zero sales — consider featuring or discounting these`}
          >
            <div className="flex flex-wrap gap-2">
              {noSalesYetProducts.slice(0, 12).map((p) => (
                <span key={p.id} className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1.5">
                  {p.name}
                </span>
              ))}
            </div>
          </SectionCard>
        )}
      </section>

      {/* ============ 3. CUSTOMERS ============ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Customers
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Total Customers" value={String(customers?.totalCustomers ?? 0)} />
          <KpiCard icon={Users} label="Repeat Customers" value={String(customers?.repeatCustomers ?? 0)} />
          <KpiCard
            icon={Users}
            label="Repeat Rate"
            value={`${(customers?.repeatRate ?? 0).toFixed(0)}%`}
          />
          <KpiCard icon={Users} label="One-Time Buyers" value={String(customers?.oneTimeCustomers ?? 0)} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <SectionCard title="Top customers" subtitle="By lifetime spend">
            {customers?.topCustomers.length ? (
              <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {customers.topCustomers.map((c) => (
                  <li
                    key={c.customerPhone}
                    className="flex items-center justify-between text-sm bg-muted/40 rounded-lg px-3 py-2.5"
                  >
                    <div>
                      <p className="font-medium text-foreground">{c.customerName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.customerPhone} · {c.completedOrderCount} order{c.completedOrderCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="font-semibold text-primary">{money(c.lifetimeValue)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No completed orders yet — top customers will appear here." />
            )}
          </SectionCard>

          <SectionCard
            title="Customers to win back"
            subtitle="Bought before, nothing in the last 3 weeks"
          >
            {customers?.atRiskCustomers.length ? (
              <ul className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {customers.atRiskCustomers.map((c) => (
                  <li
                    key={c.customerPhone}
                    className="flex items-center justify-between text-sm bg-amber-50 rounded-lg px-3 py-2.5"
                  >
                    <div>
                      <p className="font-medium text-foreground">{c.customerName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{c.customerPhone}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Last order {new Date(c.lastOrderAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No at-risk customers right now — nobody's gone quiet for 3+ weeks yet." />
            )}
          </SectionCard>
        </div>
      </section>

      {/* ============ 4. UNMET DEMAND (wishlist + restock requests) ============ */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          What People Want
        </h2>
        <SectionCard
          title="Wishlist & restock interest"
          subtitle="Products people want but haven't been able to buy — strong signal for what to restock or promote"
        >
          {demand.length > 0 ? (
            <ul className="space-y-2">
              {demand.slice(0, 10).map((d) => (
                <li
                  key={d.productId}
                  className="flex items-center justify-between text-sm bg-muted/40 rounded-lg px-3 py-2.5"
                >
                  <span className="font-medium text-foreground">{d.productName}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {d.wishlistCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" /> {d.wishlistCount}
                      </span>
                    )}
                    {d.restockRequestCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <BellRing className="w-3.5 h-3.5" /> {d.restockRequestCount}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="No wishlist activity or restock requests yet." />
          )}
        </SectionCard>
      </section>
    </div>
  )
}