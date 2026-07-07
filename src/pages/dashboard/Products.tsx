import { useEffect } from "react"
import { Package, Layers, TrendingUp, ShoppingBag, Tag, Edit, Trash2, Loader2 } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useProductStore } from "@/stores/ecommerceStores/useProductStore"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { useNavigate } from "react-router-dom"

const categoryColors: Record<string, string> = {
  Skincare: "bg-primary text-primary",
  Makeup: "bg-primary text-primary",
  Haircare: "bg-primary text-primary",
  Fragrance: "bg-accent text-accent",
  "Body Care": "bg-success text-success",
  "Anti-Aging": "bg-primary text-primary",
  "Sun Protection": "bg-primary text-primary",
}

export default function Products() {
  const { getAllProducts, categories } = useProductStore()
  const { getGlobalBestSellers, fetchAllOrdersForAdmin, isLoadingAllOrders } = useOrderStore()
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

      <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success flex items-center justify-center shadow-lg shadow-emerald-200">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">All Products</h2>
                <p className="text-xs text-muted-foreground">
                  Complete inventory list {isLoadingAllOrders && "(loading sales data...)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/products/add")}
              className="px-4 py-2 bg-gradient-to-r from-success to-success text-primary-foreground rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-soft/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sold</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allProducts.map((product) => {
                const soldData = bestSellers.find(p => p.id === product.id)
                const totalSold = soldData?.totalSold || 0
                const revenue = soldData?.revenue || 0

                return (
                  <tr key={product.id} className="hover:bg-primary/30 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="font-semibold text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category] || "bg-muted text-foreground"}`}>
                        <Tag className="w-3 h-3" />
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">${product.price}</td>
                    <td className="px-6 py-4">
                      {isLoadingAllOrders ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="font-semibold text-foreground">
                          {totalSold} units
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isLoadingAllOrders ? (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      ) : (
                        <span className="font-bold text-success">
                          ${revenue.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-primary rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-primary" />
                        </button>
                        <button className="p-2 hover:bg-primary rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-primary" />
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