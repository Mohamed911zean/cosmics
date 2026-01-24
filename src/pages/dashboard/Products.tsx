import { Package, Layers, TrendingUp, Tag } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"

const kpis = [
  { label: "Total Products", value: "1,920", icon: Package },
  { label: "Categories", value: "38", icon: Layers },
  { label: "Top Seller", value: "Glow Serum", icon: TrendingUp },
  { label: "Low Stock", value: "18", icon: Package },
]

const products = [
  { name: "Glow Serum", category: "Skincare", price: "$42", stock: 120, status: "Active" },
  { name: "Pure Cleanser", category: "Skincare", price: "$28", stock: 80, status: "Active" },
  { name: "Velvet Lipstick", category: "Makeup", price: "$19", stock: 12, status: "Low Stock" },
  { name: "Sun Shield SPF 50", category: "Skincare", price: "$35", stock: 0, status: "Out of Stock" },
]

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "Low Stock": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  "Out of Stock": { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" },
}

const categoryColors: Record<string, string> = {
  Skincare: "bg-violet-100 text-violet-700",
  Makeup: "bg-pink-100 text-pink-700",
}

export default function Products() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Products</h2>
              <p className="text-xs text-gray-500">Inventory and availability</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const status = statusStyles[product.status] || statusStyles.Active
                return (
                  <tr key={product.name} className="hover:bg-violet-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="font-semibold text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category] || "bg-gray-100 text-gray-700"}`}>
                        <Tag className="w-3 h-3" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${product.stock === 0 ? "text-rose-600" : product.stock < 20 ? "text-amber-600" : "text-gray-700"}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {product.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
