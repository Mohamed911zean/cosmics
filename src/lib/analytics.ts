// src/lib/analytics.ts
//
// Data layer for the Dashboard Analytics page. Every money value is in EGP
// (matches orders.currency default). All functions return honest, possibly-
// empty results — nothing here fabricates data. With 1 order in the system
// these will mostly return single-point series or zeroed comparisons, and
// the UI layer (Analytics.tsx) is responsible for showing a clear
// "not enough data yet" state rather than a misleading chart.

import { supabase } from './supabase'

export interface RevenuePoint {
  date: string // 'YYYY-MM-DD'
  revenue: number
  orderCount: number
}

export interface RevenueSummary {
  todayRevenue: number
  yesterdayRevenue: number
  last7DaysRevenue: number
  prior7DaysRevenue: number
  last30DaysRevenue: number
  prior30DaysRevenue: number
  todayOrderCount: number
  averageOrderValue30d: number
  series30d: RevenuePoint[]
}

export interface ProductPerformanceRow {
  id: string
  name: string
  categoryName: string | null
  price: number
  stockQuantity: number
  lowStockThreshold: number
  salesCount: number
  revenue: number
  ratingAverage: number
}

export interface StockHealth {
  totalActiveProducts: number
  outOfStockCount: number
  lowStockCount: number
  healthyStockCount: number
  outOfStockProducts: { id: string; name: string }[]
  lowStockProducts: { id: string; name: string; stockQuantity: number }[]
}

export interface CustomerRow {
  customerPhone: string
  customerName: string | null
  completedOrderCount: number
  lifetimeValue: number
  firstOrderAt: string
  lastOrderAt: string
}

export interface CustomerSummary {
  totalCustomers: number
  repeatCustomers: number
  oneTimeCustomers: number
  repeatRate: number // 0-100
  topCustomers: CustomerRow[]
  atRiskCustomers: CustomerRow[] // bought once/twice, nothing in 21+ days
}

export interface CategoryPerformance {
  categoryId: string
  categoryName: string
  revenue: number
  unitsSold: number
  productCount: number
}

export interface DemandSignal {
  productId: string
  productName: string
  wishlistCount: number
  restockRequestCount: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * DAY_MS)
}

// ---------------------------------------------------------------------------
// Revenue & orders
// ---------------------------------------------------------------------------
export async function fetchRevenueSummary(): Promise<RevenueSummary> {
  const since = daysAgo(30)

  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at, status')
    .neq('status', 'cancelled')
    .gte('created_at', since.toISOString())

  if (error) throw error

  const rows = data || []
  const byDay = new Map<string, { revenue: number; orderCount: number }>()

  for (let i = 0; i < 30; i++) {
    byDay.set(isoDate(daysAgo(29 - i)), { revenue: 0, orderCount: 0 })
  }

  let todayRevenue = 0
  let yesterdayRevenue = 0
  let last7DaysRevenue = 0
  let prior7DaysRevenue = 0
  let last30DaysRevenue = 0
  let prior30DaysRevenue = 0
  let todayOrderCount = 0

  const todayKey = isoDate(new Date())
  const yesterdayKey = isoDate(daysAgo(1))
  const sevenDaysAgo = daysAgo(7)
  const fourteenDaysAgo = daysAgo(14)

  for (const row of rows) {
    const total = Number(row.total) || 0
    const created = new Date(row.created_at)
    const key = isoDate(created)

    const bucket = byDay.get(key)
    if (bucket) {
      bucket.revenue += total
      bucket.orderCount += 1
    }

    last30DaysRevenue += total
    if (key === todayKey) {
      todayRevenue += total
      todayOrderCount += 1
    }
    if (key === yesterdayKey) yesterdayRevenue += total
    if (created >= sevenDaysAgo) last7DaysRevenue += total
    if (created >= fourteenDaysAgo && created < sevenDaysAgo) prior7DaysRevenue += total
  }

  // prior30DaysRevenue needs a separate query (days -60 to -30)
  const { data: priorData, error: priorError } = await supabase
    .from('orders')
    .select('total')
    .neq('status', 'cancelled')
    .gte('created_at', daysAgo(60).toISOString())
    .lt('created_at', daysAgo(30).toISOString())

  if (priorError) throw priorError
  prior30DaysRevenue = (priorData || []).reduce((sum, r) => sum + (Number(r.total) || 0), 0)

  const series30d: RevenuePoint[] = Array.from(byDay.entries()).map(([date, v]) => ({
    date,
    revenue: v.revenue,
    orderCount: v.orderCount,
  }))

  const totalOrders30d = rows.length
  const averageOrderValue30d = totalOrders30d > 0 ? last30DaysRevenue / totalOrders30d : 0

  return {
    todayRevenue,
    yesterdayRevenue,
    last7DaysRevenue,
    prior7DaysRevenue,
    last30DaysRevenue,
    prior30DaysRevenue,
    todayOrderCount,
    averageOrderValue30d,
    series30d,
  }
}

// ---------------------------------------------------------------------------
// Product performance & stock health
// ---------------------------------------------------------------------------
export async function fetchProductPerformance(): Promise<ProductPerformanceRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select(
      'id, name, price, stock_quantity, low_stock_threshold, sales_count, rating_average, categories(name)'
    )
    .eq('status', 'active')
    .order('sales_count', { ascending: false })

  if (error) throw error

  return (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    categoryName: row.categories?.name ?? null,
    price: Number(row.price) || 0,
    stockQuantity: row.stock_quantity,
    lowStockThreshold: row.low_stock_threshold,
    salesCount: row.sales_count,
    revenue: (Number(row.price) || 0) * row.sales_count,
    ratingAverage: Number(row.rating_average) || 0,
  }))
}

export async function fetchStockHealth(): Promise<StockHealth> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, stock_quantity, low_stock_threshold')
    .eq('status', 'active')

  if (error) throw error

  const rows = data || []
  const outOfStock = rows.filter((r) => r.stock_quantity === 0)
  const lowStock = rows.filter((r) => r.stock_quantity > 0 && r.stock_quantity <= r.low_stock_threshold)
  const healthy = rows.filter((r) => r.stock_quantity > r.low_stock_threshold)

  return {
    totalActiveProducts: rows.length,
    outOfStockCount: outOfStock.length,
    lowStockCount: lowStock.length,
    healthyStockCount: healthy.length,
    outOfStockProducts: outOfStock.map((r) => ({ id: r.id, name: r.name })),
    lowStockProducts: lowStock.map((r) => ({ id: r.id, name: r.name, stockQuantity: r.stock_quantity })),
  }
}

export async function fetchCategoryPerformance(): Promise<CategoryPerformance[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, price, sales_count, category_id, categories(id, name)')
    .eq('status', 'active')

  if (error) throw error

  const byCategory = new Map<string, CategoryPerformance>()
  for (const p of products || []) {
    const cat = (p as any).categories
    const key = cat?.id ?? 'uncategorized'
    const name = cat?.name ?? 'Uncategorized'
    if (!byCategory.has(key)) {
      byCategory.set(key, { categoryId: key, categoryName: name, revenue: 0, unitsSold: 0, productCount: 0 })
    }
    const entry = byCategory.get(key)!
    entry.revenue += (Number(p.price) || 0) * (p.sales_count || 0)
    entry.unitsSold += p.sales_count || 0
    entry.productCount += 1
  }

  return Array.from(byCategory.values()).sort((a, b) => b.revenue - a.revenue)
}

// ---------------------------------------------------------------------------
// Customers: repeat vs one-time, at-risk
// ---------------------------------------------------------------------------
export async function fetchCustomerSummary(): Promise<CustomerSummary> {
  const { data, error } = await supabase
    .from('v_customer_summary')
    .select('*')
    .order('lifetime_value', { ascending: false })

  if (error) throw error

  const rows: CustomerRow[] = (data || []).map((r: any) => ({
    customerPhone: r.customer_phone,
    customerName: r.customer_name,
    completedOrderCount: r.completed_order_count,
    lifetimeValue: Number(r.lifetime_value) || 0,
    firstOrderAt: r.first_order_at,
    lastOrderAt: r.last_order_at,
  }))

  const totalCustomers = rows.length
  const repeatCustomers = rows.filter((r) => r.completedOrderCount > 1).length
  const oneTimeCustomers = totalCustomers - repeatCustomers
  const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0

  const twentyOneDaysAgo = daysAgo(21)
  const atRiskCustomers = rows.filter(
    (r) => r.completedOrderCount >= 1 && new Date(r.lastOrderAt) < twentyOneDaysAgo
  )

  return {
    totalCustomers,
    repeatCustomers,
    oneTimeCustomers,
    repeatRate,
    topCustomers: rows.slice(0, 10),
    atRiskCustomers: atRiskCustomers.slice(0, 10),
  }
}

// ---------------------------------------------------------------------------
// Unmet demand: wishlist + restock requests (things people want but can't
// currently buy, or keep saving without buying — strong signal for
// what to restock or discount)
// ---------------------------------------------------------------------------
export async function fetchDemandSignals(): Promise<DemandSignal[]> {
  const [{ data: wishlistData, error: wishlistError }, { data: notifyData, error: notifyError }] =
    await Promise.all([
      supabase.from('wishlist_items').select('product_id, products(id, name)'),
      supabase.from('stock_notify_requests').select('product_id, products(id, name)'),
    ])

  if (wishlistError) throw wishlistError
  if (notifyError) throw notifyError

  const byProduct = new Map<string, DemandSignal>()

  for (const row of wishlistData || []) {
    const p = (row as any).products
    if (!p) continue
    if (!byProduct.has(p.id)) {
      byProduct.set(p.id, { productId: p.id, productName: p.name, wishlistCount: 0, restockRequestCount: 0 })
    }
    byProduct.get(p.id)!.wishlistCount += 1
  }

  for (const row of notifyData || []) {
    const p = (row as any).products
    if (!p) continue
    if (!byProduct.has(p.id)) {
      byProduct.set(p.id, { productId: p.id, productName: p.name, wishlistCount: 0, restockRequestCount: 0 })
    }
    byProduct.get(p.id)!.restockRequestCount += 1
  }

  return Array.from(byProduct.values()).sort(
    (a, b) => b.wishlistCount + b.restockRequestCount - (a.wishlistCount + a.restockRequestCount)
  )
}