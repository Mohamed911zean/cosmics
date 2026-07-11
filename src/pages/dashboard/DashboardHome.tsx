import { useEffect, useMemo } from "react"
import { Eye, ShoppingCart, MessageCircle, DollarSign, Loader2 } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { RecentCustomers } from "@/components/dashboard/RecentCustomers"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { useProductStore } from "@/stores"
import { formatEGP } from "@/lib/currency"

export default function DashboardHome() {
  const {
    fetchAllOrdersForAdmin,
    isLoadingAllOrders,
    allOrders,
    getAllOrdersTotalRevenue
  } = useOrderStore()
  const { getAllProducts } = useProductStore()

  useEffect(() => {
    fetchAllOrdersForAdmin()
  }, [fetchAllOrdersForAdmin])

  const allProducts = getAllProducts()

  const kpis = useMemo(() => {
    const totalRevenue = getAllOrdersTotalRevenue()
    const ordersCount = allOrders.length
    const customersCount = new Set(allOrders.map(o => o.shippingDetails.email)).size
    const productsCount = allProducts.length
    return [
      { label: "Total Revenue", value: formatEGP(totalRevenue), icon: DollarSign },
      { label: "Orders", value: ordersCount.toString(), icon: ShoppingCart },
      { label: "Customers", value: customersCount.toString(), icon: MessageCircle },
      { label: "Products", value: productsCount.toString(), icon: Eye },
    ]
  }, [allOrders, allProducts, getAllOrdersTotalRevenue])

  const recentOrders = useMemo(() => {
    const sorted = [...allOrders].sort((a, b) => b.date - a.date).slice(0, 6)
    return sorted.map((order) => {
      const name =
        order.items.length === 1
          ? String(order.items[0].name)
          : `${order.items.length} items`
      const payment = order.status === "processing" ? "Due" : "Paid"
      return {
        id: order.id,
        name,
        price: formatEGP(order.total),
        payment,
        status: order.status,
      }
    })
  }, [allOrders])

  const recentCustomers = useMemo(() => {
    const map = new Map<string, { name: string; country: string; date: number }>()
    for (const order of allOrders) {
      const email = order.shippingDetails.email
      const name = `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
      const country = order.shippingDetails.city || ""
      const prev = map.get(email)
      if (!prev || order.date > prev.date) {
        map.set(email, { name, country, date: order.date })
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.date - a.date)
      .slice(0, 6)
      .map((c) => ({ name: c.name, country: c.country || "Unknown" }))
  }, [allOrders])

  if (isLoadingAllOrders) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <RecentOrders orders={recentOrders} />
        <RecentCustomers customers={recentCustomers} />
      </div>
    </div>
  )
}