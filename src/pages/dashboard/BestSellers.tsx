import { TrendingUp, DollarSign, ShoppingBag, Award, Tag } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"

const categoryColors: Record<string, string> = {
  Skincare: "bg-violet-100 text-violet-700",
  Makeup: "bg-pink-100 text-pink-700",
  Haircare: "bg-blue-100 text-blue-700",
  Fragrance: "bg-amber-100 text-amber-700",
}

export default function BestSellers() {
  const { getBestSellers, getTotalRevenue } = useOrderStore()
  
  const bestSellers = getBestSellers()
  const totalRevenue = getTotalRevenue()
  const totalUnitsSold = bestSellers.reduce((sum, p) => sum + p.totalSold, 0)
  const topProduct = bestSellers[0]
  
  const kpis = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
    { label: "Units Sold", value: totalUnitsSold.toString(), icon: ShoppingBag },
    { label: "Top Product", value: topProduct?.name || "No Sales", icon: Award },
    { label: "Products Sold", value: bestSellers.length.toString(), icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Best Sellers</h1>
          <p className="text-sm text-gray-500">Top performing products</p>
        </div>
      </div>

      <DashboardKpiCards items={kpis} />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
              <p className="text-xs text-gray-500">Ranked by total sales</p>
            </div>
          </div>
        </div>

        {bestSellers.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sales Yet</h3>
            <p className="text-gray-500">Start selling products to see best sellers here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Units Sold</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bestSellers.map((product, index) => {
                  const revenuePercentage = (product.revenue / totalRevenue) * 100
                  const isTopThree = index < 3
                  
                  return (
                    <tr key={product.id} className="hover:bg-amber-50/30 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white" :
                          index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white" :
                          index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            {isTopThree && (
                              <div className="text-xs text-amber-600 font-semibold mt-0.5">
                                ⭐ Top {index + 1}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category] || "bg-gray-100 text-gray-700"}`}>
                          <Tag className="w-3 h-3" />
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{product.totalSold}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-emerald-600 text-base">
                          ${product.revenue.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {revenuePercentage.toFixed(1)}% of total
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${revenuePercentage}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}