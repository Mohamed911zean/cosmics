import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, ShoppingCart, Heart } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useProductStore, useCartStore, useWishlistStore } from "@/stores"
import { toast } from "sonner"

export function Shop() {
    const { products, categories } = useProductStore()
    const addToCart = useCartStore((state) => state.addItem)
    const { toggleItem, isInWishlist } = useWishlistStore()
    const [searchParams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All")
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
    const [sortBy, setSortBy] = useState("featured")

    // Update selected category if URL changes
    useEffect(() => {
        const category = searchParams.get("category")
        if (category) {
            setSelectedCategory(category)
        }
    }, [searchParams])

    // Update URL if category changes (optional, but good for UX)
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        if (category === "All") {
            searchParams.delete("category")
        } else {
            searchParams.set("category", category)
        }
        setSearchParams(searchParams)
    }

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

        return matchesSearch && matchesCategory && matchesPrice
    }).sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price
        if (sortBy === "price-high") return b.price - a.price
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
        return 0 // featured/default
    })

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault()
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
        })
        toast.success(`${product.name} added to bag`)
    }

    const handleToggleWishlist = (e: React.MouseEvent, product: any) => {
        e.preventDefault()
        toggleItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
        })
        toast.success(isInWishlist(product.id) ? "Removed from wishlist" : "Added to wishlist")
    }

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-b from-rose-50/50 to-orange-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                        Shop All
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our complete collection of premium skincare and body care essentials
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 space-y-8 flex-shrink-0">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-rose-500 transition-colors"
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryChange("All")}
                                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === "All" ? "bg-white shadow-sm text-rose-500 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                        }`}
                                >
                                    All Products
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => handleCategoryChange(category.name)}
                                        className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.name ? "bg-white shadow-sm text-rose-500 font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                            }`}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range - Simple Implementation */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full accent-rose-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>$0</span>
                                    <span>${priceRange[1]}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                            <p className="text-sm text-gray-500">
                                Showing {filteredProducts.length} results
                            </p>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group"
                                    >
                                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white mb-4 shadow-sm border border-gray-100">
                                            <Link to={`/product/${product.id}`}>
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </Link>

                                            {/* Quick Actions - Visible on mobile, hover on desktop */}
                                            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 text-white">
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className="w-10 h-10 rounded-full bg-white text-gray-900 flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-lg transition-colors"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleToggleWishlist(e, product)}
                                                    className={`w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-rose-500 hover:text-white shadow-lg transition-colors ${isInWishlist(product.id) ? "text-rose-500" : "text-gray-900"
                                                        }`}
                                                >
                                                    <Heart className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-rose-500 uppercase tracking-widest mb-1">{product.category}</p>
                                            <Link to={`/product/${product.id}`}>
                                                <h3 className="font-medium text-gray-900 mb-1 hover:text-rose-500 transition-colors truncate">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                                {product.rating && (
                                                    <div className="flex items-center text-amber-400 text-xs">
                                                        <span className="font-medium text-gray-500 mr-1">{product.rating}</span>
                                                        <span className="text-amber-400">★</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg mb-4">No products found</p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery("")
                                        handleCategoryChange("All")
                                        setPriceRange([0, 200])
                                    }}
                                    variant="outline"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
