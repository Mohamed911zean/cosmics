import { Package, Plus, Layers, TrendingUp } from "lucide-react"
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

const statusClasses: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Low Stock": "bg-amber-100 text-amber-700",
  "Out of Stock": "bg-red-100 text-red-700",
}

export default function Products() {
  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#2b2b2b]">Products</h2>
            <p className="text-sm text-gray-500">Inventory and availability</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#4B0082] text-white text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="pb-4 font-medium">Product</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Price</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr key={product.name} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium">{product.name}</td>
                  <td className="py-4">{product.category}</td>
                  <td className="py-4">{product.price}</td>
                  <td className="py-4">{product.stock}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses[product.status]}`}>
                      {product.status}
                    </span>
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
