import { useEffect } from "react"
import { Package, Layers, TrendingUp, ShoppingBag, Tag, Edit, Trash2, Loader2 } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useProductStore } from "@/stores/ecommerceStores/useProductStore"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { useNavigate } from "react-router-dom"

const categoryColors: Record<string, string> = {
  Skincare: "bg-violet-100 text-violet-700",
  Makeup: "bg-pink-100 text-pink-700",
  Haircare: "bg-blue-100 text-blue-700",
  Fragrance: "bg-amber-100 text-amber-700",
  "Body Care": "bg-emerald-100 text-emerald-700",
  "Anti-Aging": "bg-rose-100 text-rose-700",
  "Sun Protection": "bg-sky-100 text-sky-700",
}

export default function Products() {
  const { getAllProducts, categories } = useProductStore()
  const { getGlobalBestSellers, fetchAllOrdersForAdmin, isLoadingAllOrders, allOrders } = useOrderStore()
  const navigate = useNavigate()

  // Fetch all orders from all users when component mounts
  useEffect(() => {
    fetchAllOrdersForAdmin()
  }, [fetchAllOrdersForAdmin])

  const allProducts = getAllProducts()
  const bestSellers = getGlobalBestSellers()
  const topSeller = bestSellers[0]
  const totalUnitsSold = bestSellers.reduce((sum, p) => sum + p.totalSold, 0)

  const kpis = [
    { label: "Total Products", value: allProducts.length.toString(), icon: Package },
    { label: "Categories", value: categories.length.toString(), icon: Layers },
    { label: "Top Seller", value: topSeller?.name?.split(" - ")[0] || "No Sales", icon: TrendingUp },
    { label: "Units Sold", value: totalUnitsSold.toString(), icon: ShoppingBag },
  ]

  return (
    <div className="space-y-8">
      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">All Products</h2>
                <p className="text-xs text-gray-500">
                  Complete inventory list {isLoadingAllOrders && "(loading sales data...)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/products/add")}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sold</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProducts.map((product) => {
                const soldData = bestSellers.find(p => p.id === product.id)
                const totalSold = soldData?.totalSold || 0
                const revenue = soldData?.revenue || 0

                return (
                  <tr key={product.id} className="hover:bg-violet-50/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category] || "bg-gray-100 text-gray-700"}`}>
                        <Tag className="w-3 h-3" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${product.price}</td>
                    <td className="px-6 py-4">
                      {isLoadingAllOrders ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <span className="font-semibold text-gray-700">
                          {totalSold} units
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isLoadingAllOrders ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <span className="font-bold text-emerald-600">
                          ${revenue.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
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