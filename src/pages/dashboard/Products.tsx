import { useEffect, useState } from "react"
import { Package, Layers, TrendingUp, ShoppingBag, Tag, Edit, Trash2, Loader2, Plus, Minus } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useProductStore } from "@/stores/ecommerceStores/useProductStore"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { formatEGP } from "@/lib/currency"

const categoryColors: Record<string, string> = {
  Skincare: "bg-primary text-green",
  Makeup: "bg-primary text-green",
  Haircare: "bg-primary text-green",
  Fragrance: "bg-accent text-primary",
  "Body Care": "bg-success text-white",
  "Anti-Aging": "bg-primary text-white",
  "Sun Protection": "bg-primary text-accent",
}

export default function Products() {
  const { getAllProducts, categories, fetchProducts, deleteProduct, updateStock } = useProductStore()
  const { getGlobalBestSellers, fetchAllOrdersForAdmin, isLoadingAllOrders } = useOrderStore()
  const navigate = useNavigate()
  const [editingStockId, setEditingStockId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState<number>(0)

  // Fetch products and orders when component mounts
  useEffect(() => {
    fetchProducts()
    fetchAllOrdersForAdmin()
  }, [fetchProducts, fetchAllOrdersForAdmin])

  const allProducts = getAllProducts()
  const bestSellers = getGlobalBestSellers()
  const topSeller = bestSellers[0]
  const totalUnitsSold = bestSellers.reduce((sum, p) => sum + p.totalSold, 0)

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(productId)
        toast.success("Product deleted successfully!")
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("Failed to delete product")
      }
    }
  }

  const handleStockEditStart = (product: any) => {
    setEditingStockId(product.id)
    setStockValue(product.stock_quantity)
  }

  const handleStockSave = async (productId: string) => {
    try {
      await updateStock(productId, stockValue)
      toast.success("Stock updated!")
      setEditingStockId(null)
    } catch (error) {
      console.error("Error updating stock:", error)
      toast.error("Failed to update stock")
    }
  }

  const handleStockCancel = () => {
    setEditingStockId(null)
  }

  const kpis = [
    { label: "Total Products", value: allProducts.length.toString(), icon: Package },
    { label: "Categories", value: categories.length.toString(), icon: Layers },
    { label: "Top Seller", value: topSeller?.name || "No Sales", icon: TrendingUp },
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
            <Button
              onClick={() => navigate("/dashboard/products/add")}
              className="px-4 py-2 bg-gradient-to-r from-success to-success text-primary-foreground rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-soft/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
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
                    <td className="px-6 py-4 font-bold text-foreground">{formatEGP(product.price)}</td>
                    <td className="px-6 py-4">
                      {editingStockId === product.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setStockValue(Math.max(0, stockValue - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                            className="w-20 h-8 text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setStockValue(stockValue + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="h-8"
                            onClick={() => handleStockSave(product.id)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={handleStockCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${product.stock_quantity <= 5 ? "text-destructive" : "text-foreground"}`}>
                            {product.stock_quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleStockEditStart(product)}
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </td>
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
                          {formatEGP(revenue)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/dashboard/products/add?id=${product.id}`)}
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
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