import { useEffect } from "react"
import { TrendingUp, DollarSign, ShoppingBag, Award, Tag, Loader2 } from "lucide-react"
import { DashboardKpiCards } from "@/components/dashboard/DashboardKpiCards"
import { useOrderStore } from "@/stores/ecommerceStores/useOrderStore"

const categoryColors: Record<string, string> = {
    Skincare: "bg-primary text-primary",
    Makeup: "bg-primary text-primary",
    Haircare: "bg-primary text-primary",
    Fragrance: "bg-accent text-accent",
    "Body Care": "bg-success text-success",
    "Anti-Aging": "bg-primary text-primary",
    "Sun Protection": "bg-primary text-primary",
}

export default function BestSellers() {
    const {
        getGlobalBestSellers,
        getAllOrdersTotalRevenue,
        fetchAllOrdersForAdmin,
        isLoadingAllOrders,
        allOrders
    } = useOrderStore()


    useEffect(() => {
    const fetchWithDelay = async () => {
        // Wait a bit for role to load
        await new Promise(resolve => setTimeout(resolve, 1000))
        await fetchAllOrdersForAdmin()
    }
    
    fetchWithDelay()
}, [fetchAllOrdersForAdmin])
    // Fetch all orders from all users when component mounts
    useEffect(() => {
        fetchAllOrdersForAdmin()
    }, [fetchAllOrdersForAdmin])

    const bestSellers = getGlobalBestSellers()
    const totalRevenue = getAllOrdersTotalRevenue()
    const totalUnitsSold = bestSellers.reduce((sum, p) => sum + p.totalSold, 0)
    const topProduct = bestSellers[0]

    const kpis = [
        { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign },
        { label: "Units Sold", value: totalUnitsSold.toString(), icon: ShoppingBag },
        { label: "Top Product", value: topProduct?.name?.split(" - ")[0] || "No Sales", icon: Award },
        { label: "Total Orders", value: allOrders.length.toString(), icon: TrendingUp },
    ]

    if (isLoadingAllOrders) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium">Loading sales data from all users...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent flex items-center justify-center shadow-lg shadow-amber-200">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Best Sellers</h1>
                    <p className="text-sm text-muted-foreground">Top performing products across all customers</p>
                </div>
            </div>

            <DashboardKpiCards items={kpis} />

            <section className="bg-surface rounded-2xl shadow-sm border border-border/80 overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-surface-soft to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent flex items-center justify-center shadow-lg shadow-amber-200">
                            <Award className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground">Top Products</h2>
                            <p className="text-xs text-muted-foreground">Ranked by total sales from all customers</p>
                        </div>
                    </div>
                </div>

                {bestSellers.length === 0 ? (
                    <div className="p-12 text-center">
                        <ShoppingBag className="w-16 h-16 text-border mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Sales Yet</h3>
                        <p className="text-muted-foreground">Orders from customers will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-surface-soft/50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Units Sold</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Revenue</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bestSellers.map((product, index) => {
                                    const revenuePercentage = totalRevenue > 0 ? (product.revenue / totalRevenue) * 100 : 0
                                    const isTopThree = index < 3

                                    return (
                                        <tr key={product.id} className="hover:bg-accent/30 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0 ? "bg-gradient-to-br from-accent to-accent text-primary-foreground" :
                                                        index === 1 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-primary-foreground" :
                                                            index === 2 ? "bg-gradient-to-br from-accent to-accent text-primary-foreground" :
                                                                "bg-muted text-muted-foreground"
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
                                                        <div className="font-semibold text-foreground">{product.name}</div>
                                                        {isTopThree && (
                                                            <div className="text-xs text-accent font-semibold mt-0.5">
                                                                ⭐ Top {index + 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[product.category] || "bg-muted text-foreground"}`}>
                                                    <Tag className="w-3 h-3" />
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-foreground">{product.totalSold}</span>
                                                    <span className="text-xs text-muted-foreground">units</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-success text-base">
                                                    ${product.revenue.toFixed(2)}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {revenuePercentage.toFixed(1)}% of total
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-accent to-accent rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min(revenuePercentage, 100)}%` }}
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