import { Eye, ShoppingCart, MessageCircle, DollarSign } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { RecentCustomers } from "@/components/dashboard/RecentCustomers"

const kpis = [
  { label: "Daily Views", value: "1,504", icon: Eye },
  { label: "Sales", value: "80", icon: ShoppingCart },
  { label: "Comments", value: "284", icon: MessageCircle },
  { label: "Earnings", value: "$7,842", icon: DollarSign },
]

const orders = [
  { name: "Star Refrigerator", price: "$1,200", payment: "Paid", status: "Delivered" },
  { name: "Dell Laptop", price: "$110", payment: "Due", status: "Pending" },
  { name: "Apple Watch", price: "$1,200", payment: "Paid", status: "Return" },
  { name: "Adidas Shoes", price: "$620", payment: "Due", status: "In Progress" },
]

const customers = [
  { name: "David", country: "Italy" },
  { name: "Amit", country: "India" },
  { name: "David", country: "Italy" },
  { name: "Amit", country: "India" },
  { name: "David", country: "Italy" },
]

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-8">
        <RecentOrders orders={orders} />
        <RecentCustomers customers={customers} />
      </div>
    </div>
  )
}
