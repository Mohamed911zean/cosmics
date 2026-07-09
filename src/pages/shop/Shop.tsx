import { useState, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
    Search,
    ShoppingBag,
    Heart,
    SlidersHorizontal,
    ChevronDown,
    X,
    Eye,
    Star,
} from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useProductStore, useCartStore, useWishlistStore } from "@/stores"
import { toast } from "sonner"

/* ------------------------------------------------------------------ */
/*  Static config                                                      */
/* ------------------------------------------------------------------ */

const SORT_OPTIONS = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
    { value: "best-selling", label: "Best Selling" },
    { value: "rating", label: "Highest Rated" },
] as const

type SortValue = (typeof SORT_OPTIONS)[number]["value"]

const PAGE_SIZE = 8
const MAX_PRICE = 200

/* ------------------------------------------------------------------ */
/*  Decorative pieces (Shop-specific — distinct from Home page blobs)  */
/* ------------------------------------------------------------------ */

function HeroDecoration() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* soft lavender blob, top right */}
            <div className="absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-[#d3c5f6]/40 blur-3xl" />
            {/* velvet blob, left */}
            <div className="absolute top-10 -left-24 w-80 h-80 rounded-full bg-[#3b2a60]/[0.08] blur-3xl" />
            {/* thin line-art arc, signature motif echoed through the page */}
            <svg
                className="absolute right-6 top-10 w-40 h-40 sm:w-56 sm:h-56 opacity-70"
                viewBox="0 0 200 200"
                fill="none"
            >
                <path
                    d="M20 140 C 40 40, 160 40, 180 140"
                    stroke="#3b2a60"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                />
                <circle cx="20" cy="140" r="2.5" fill="#c9a227" fillOpacity="0.6" />
                <circle cx="180" cy="140" r="2.5" fill="#c9a227" fillOpacity="0.6" />
            </svg>
            {/* scattered minimal diamonds */}
            <span className="absolute left-1/3 top-6 w-1.5 h-1.5 rotate-45 bg-[#c9a227]/50" />
            <span className="absolute left-[60%] top-24 w-1 h-1 rotate-45 bg-[#3b2a60]/30" />
        </div>
    )
}

function SectionRibbon() {
    // A quiet, brand-specific divider used instead of a plain hairline —
    // the "ribbon" is the page's signature recurring element.
    return (
        <div aria-hidden className="relative h-6 my-2 select-none">
            <svg viewBox="0 0 400 12" className="w-full h-3" preserveAspectRatio="none">
                <path
                    d="M0 6 Q 100 0, 200 6 T 400 6"
                    stroke="#3b2a60"
                    strokeOpacity="0.12"
                    strokeWidth="1"
                    fill="none"
                />
            </svg>
        </div>
    )
}

function EmptyStateIllustration() {
    return (
        <svg viewBox="0 0 160 120" className="w-40 h-32 mx-auto mb-6" fill="none">
            <ellipse cx="80" cy="100" rx="55" ry="8" fill="#3b2a60" opacity="0.06" />
            <rect x="45" y="30" width="70" height="55" rx="18" fill="#d3c5f6" opacity="0.35" />
            <circle cx="80" cy="50" r="14" fill="#fff" opacity="0.7" />
            <path d="M73 50 l5 5 l9 -10" stroke="#3b2a60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
            <circle cx="40" cy="35" r="3" fill="#c9a227" opacity="0.6" />
            <circle cx="122" cy="70" r="2.5" fill="#c9a227" opacity="0.5" />
        </svg>
    )
}

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function StarRating({ value = 4.8 }: { value?: number }) {
    const rounded = Math.round(value)
    return (
        <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-3 h-3 ${i < rounded ? "fill-[#c9a227] text-[#c9a227]" : "fill-transparent text-[#3b2a60]/20"}`}
                />
            ))}
        </div>
    )
}

function CategoryPill({
    label,
    active,
    onClick,
}: {
    label: string
    active: boolean
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={[
                "shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b2a60]/40 focus-visible:ring-offset-2",
                active
                    ? "bg-[#3b2a60] text-white shadow-[0_8px_20px_-6px_rgba(59,42,96,0.45)]"
                    : "bg-white/70 text-[#3b2a60] border border-[#3b2a60]/15 hover:border-[#3b2a60]/35 hover:bg-white",
            ].join(" ")}
        >
            {label}
        </button>
    )
}


function ActiveFilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <motion.button
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#d3c5f6]/45 border border-[#3b2a60]/10 pl-3.5 pr-2.5 py-1.5 text-xs font-medium text-[#3b2a60] hover:bg-[#d3c5f6]/70 transition-colors"
        >
            {label}
            <X className="w-3 h-3" />
        </motion.button>
    )
}

/* ------------------------------------------------------------------ */
/*  Sort dropdown                                                      */
/* ------------------------------------------------------------------ */

function SortDropdown({
    value,
    onChange,
}: {
    value: SortValue
    onChange: (v: SortValue) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const current = SORT_OPTIONS.find((o) => o.value === value)

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full border border-[#3b2a60]/15 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#3b2a60] hover:border-[#3b2a60]/35 hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b2a60]/40"
            >
                {current?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-2xl border border-[#3b2a60]/10 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(59,42,96,0.25)]"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <li key={opt.value}>
                                <button
                                    role="option"
                                    aria-selected={opt.value === value}
                                    onClick={() => {
                                        onChange(opt.value)
                                        setOpen(false)
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                                        opt.value === value
                                            ? "bg-[#d3c5f6]/40 text-[#3b2a60] font-semibold"
                                            : "text-[#3b2a60]/80 hover:bg-[#d3c5f6]/20"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Filter Drawer (mobile bottom sheet / desktop side usage optional)   */
/* ------------------------------------------------------------------ */

function FilterDrawer({
    open,
    onClose,
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceChange,
    onClear,
    onApply,
}: {
    open: boolean
    onClose: () => void
    categories: { id: string; name: string }[]
    selectedCategory: string
    onCategoryChange: (c: string) => void
    priceRange: [number, number]
    onPriceChange: (r: [number, number]) => void
    onClear: () => void
    onApply: () => void
}) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-[#231933]/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 260 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Filters"
                        className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-[#FBF9F5] shadow-[0_-20px_60px_-15px_rgba(59,42,96,0.35)] sm:mx-auto sm:max-w-md sm:rounded-[2rem] sm:bottom-6 sm:top-auto"
                    >
                        <div className="sticky top-0 flex items-center justify-between bg-[#FBF9F5]/95 backdrop-blur px-6 pt-5 pb-4 border-b border-[#3b2a60]/10">
                            <div className="mx-auto absolute left-1/2 -translate-x-1/2 -top-1 h-1.5 w-10 rounded-full bg-[#3b2a60]/15 sm:hidden" />
                            <h2 className="font-serif text-xl text-[#3b2a60] pt-2">Filters</h2>
                            <button
                                onClick={onClose}
                                aria-label="Close filters"
                                className="rounded-full p-2 text-[#3b2a60]/60 hover:bg-[#3b2a60]/5 hover:text-[#3b2a60] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-6 space-y-8">
                            {/* Categories */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3b2a60]/50 mb-3">
                                    Category
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <CategoryPill
                                        label="All"
                                        active={selectedCategory === "All"}
                                        onClick={() => onCategoryChange("All")}
                                    />
                                    {categories.map((c) => (
                                        <CategoryPill
                                            key={c.id}
                                            label={c.name}
                                            active={selectedCategory === c.name}
                                            onClick={() => onCategoryChange(c.name)}
                                        />
                                    ))}
                                </div>
                            </section>

                            {/* Price */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3b2a60]/50 mb-3">
                                    Price
                                </h3>
                                <input
                                    type="range"
                                    min={0}
                                    max={MAX_PRICE}
                                    value={priceRange[1]}
                                    onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
                                    className="w-full h-2 rounded-full appearance-none bg-[#3b2a60]/10 accent-[#3b2a60] cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-[#3b2a60]/60 mt-2">
                                    <span>$0</span>
                                    <span className="font-semibold text-[#3b2a60]">${priceRange[1]}</span>
                                </div>
                            </section>

                            {/* Availability */}
                            <section>
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3b2a60]/50 mb-3">
                                    Availability
                                </h3>
                                <label className="flex items-center gap-3 text-sm text-[#3b2a60]">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-md border-[#3b2a60]/20 accent-[#3b2a60]"
                                    />
                                    In stock only
                                </label>
                            </section>
                        </div>

                        <div className="sticky bottom-0 flex gap-3 bg-[#FBF9F5]/95 backdrop-blur px-6 py-5 border-t border-[#3b2a60]/10">
                            <button
                                onClick={onClear}
                                className="flex-1 rounded-full border border-[#3b2a60]/20 py-3.5 text-sm font-semibold text-[#3b2a60] hover:bg-[#3b2a60]/5 transition-colors"
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={() => {
                                    onApply()
                                    onClose()
                                }}
                                className="flex-1 rounded-full bg-[#3b2a60] py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(59,42,96,0.5)] hover:bg-[#4a3777] transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

function ProductCard({
    product,
    index,
    isWishlisted,
    onAddToCart,
    onToggleWishlist,
}: {
    product: any
    index: number
    isWishlisted: boolean
    onAddToCart: (e: React.MouseEvent) => void
    onToggleWishlist: (e: React.MouseEvent) => void
}) {
    const prefersReducedMotion = useReducedMotion()

    return (
        <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col"
        >
            <div className="relative rounded-[2rem] border border-[#3b2a60]/10 bg-white shadow-[0_10px_35px_-18px_rgba(59,42,96,0.3)] transition-shadow duration-500 group-hover:shadow-[0_25px_60px_-20px_rgba(59,42,96,0.45)] overflow-hidden">
                {/* Image zone ~70% of card */}
                <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#f4f0fb]">
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-[0.5deg]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3b2a60]/0 via-[#3b2a60]/0 to-[#3b2a60]/0 group-hover:from-[#3b2a60]/10 transition-colors duration-500" />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                        {product.isNew && (
                            <span className="rounded-full bg-[#3b2a60] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm">
                                NEW
                            </span>
                        )}
                        {product.discount && (
                            <span className="rounded-full bg-[#c9a227] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm">
                                -{product.discount}%
                            </span>
                        )}
                        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#3b2a60] shadow-sm">
                                Only {product.stock} left
                            </span>
                        )}
                    </div>

                    {/* Wishlist floating glass button */}
                    <button
                        onClick={onToggleWishlist}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        aria-pressed={isWishlisted}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm transition-transform duration-300 hover:scale-110 active:scale-95"
                    >
                        <Heart
                            className={`h-4.5 w-4.5 transition-all duration-300 ${
                                isWishlisted ? "fill-[#3b2a60] text-[#3b2a60] scale-110" : "text-[#3b2a60]"
                            }`}
                        />
                    </button>

                    {/* Quick view — appears on hover (desktop), always tappable */}
                    <Link
                        to={`/product/${product.id}`}
                        className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-full bg-white/85 backdrop-blur-md py-2.5 text-xs font-semibold text-[#3b2a60] opacity-0 translate-y-2 shadow-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Quick View
                    </Link>
                </Link>

                {/* Content */}
                <div className="p-4 sm:p-5">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[#3b2a60]/50 mb-1">
                        {product.category}
                    </p>
                    <Link to={`/product/${product.id}`}>
                        <h3 className="font-serif text-[15px] sm:text-lg leading-snug text-[#231933] mb-1.5 line-clamp-1 hover:text-[#3b2a60] transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                    <StarRating value={product.rating ?? 4.8} />

                    <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-base sm:text-lg font-semibold text-[#3b2a60]">
                            ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                            <span className="text-xs text-[#3b2a60]/40 line-through">
                                ${product.originalPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={onAddToCart}
                        className="mt-3.5 w-full rounded-full bg-[#3b2a60] py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_10px_25px_-10px_rgba(59,42,96,0.6)] transition-all duration-300 hover:bg-[#4a3777] hover:shadow-[0_14px_30px_-10px_rgba(59,42,96,0.65)] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Add to Bag
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

/* ------------------------------------------------------------------ */
/*  Main Shop Page                                                     */
/* ------------------------------------------------------------------ */

export function Shop() {
    const { getAllProducts, categories } = useProductStore()
    const products = getAllProducts()
    const addToCart = useCartStore((state) => state.addItem)
    const { toggleItem, isInWishlist } = useWishlistStore()
    const [searchParams, setSearchParams] = useSearchParams()

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All")
    const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])
    const [sortBy, setSortBy] = useState<SortValue>("featured")
    const [filterOpen, setFilterOpen] = useState(false)
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

    useEffect(() => {
        const category = searchParams.get("category")
        if (category) setSelectedCategory(category)
    }, [searchParams])

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setVisibleCount(PAGE_SIZE)
        if (category === "All") {
            searchParams.delete("category")
        } else {
            searchParams.set("category", category)
        }
        setSearchParams(searchParams)
    }

    const filteredProducts = useMemo(() => {
        const list = products.filter((product) => {
            const q = searchQuery.toLowerCase()
            const matchesSearch =
                product.name.toLowerCase().includes(q) ||
                product.description?.toLowerCase().includes(q)
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
            return matchesSearch && matchesCategory && matchesPrice
        })

        const sorted = [...list]
        switch (sortBy) {
            case "price-low":
                sorted.sort((a, b) => a.price - b.price)
                break
            case "price-high":
                sorted.sort((a, b) => b.price - a.price)
                break
            case "newest":
                sorted.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
                break
            case "best-selling":
                sorted.sort((a, b) => (b.sales ?? 0) - (a.sales ?? 0))
                break
            case "rating":
                sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                break
            default:
                break
        }
        return sorted
    }, [products, searchQuery, selectedCategory, priceRange, sortBy])

    const visibleProducts = filteredProducts.slice(0, visibleCount)
    const hasMore = visibleCount < filteredProducts.length

    const clearAllFilters = () => {
        setSearchQuery("")
        handleCategoryChange("All")
        setPriceRange([0, MAX_PRICE])
        setVisibleCount(PAGE_SIZE)
    }

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault()
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
        })
        toast.success(`${product.name} added to bag`, {
            action: { label: "Checkout", onClick: () => (window.location.href = "/cart") },
        })
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

    const activeFilters: { key: string; label: string; onRemove: () => void }[] = []
    if (selectedCategory !== "All") {
        activeFilters.push({
            key: "category",
            label: selectedCategory,
            onRemove: () => handleCategoryChange("All"),
        })
    }
    if (priceRange[1] < MAX_PRICE) {
        activeFilters.push({
            key: "price",
            label: `$${priceRange[0]}–$${priceRange[1]}`,
            onRemove: () => setPriceRange([0, MAX_PRICE]),
        })
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5]">
            {/* ---------------- Hero ---------------- */}
            <section className="relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20">
                <HeroDecoration />
                <div className="container relative mx-auto px-5 sm:px-6 lg:px-8 text-center">
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.05] text-[#231933] mb-5"
                    >
                        Luxury Skincare
                        <br />
                        <span className="text-[#3b2a60]">Collection</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mx-auto max-w-xl text-sm sm:text-base text-[#3b2a60]/60 mb-7"
                    >
                        Discover authentic skincare from the world's leading beauty brands, curated for
                        your everyday ritual.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#3b2a60]/15 bg-white/60 backdrop-blur px-5 py-2 text-xs font-medium text-[#3b2a60]"
                    >
                        {products.length}+ Products
                    </motion.div>
                </div>
            </section>

            {/* ---------------- Sticky toolbar ---------------- */}
            <div className="sticky top-0 z-30 border-b border-[#3b2a60]/10 bg-[#FBF9F5]/85 backdrop-blur-xl">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                    {/* Row 1: search + (desktop) chips/sort/filter/count */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b2a60]/40" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search skincare, brands, concerns…"
                                aria-label="Search products"
                                className="w-full rounded-full border border-[#3b2a60]/15 bg-white/70 py-2.5 sm:py-3 pl-11 pr-4 text-sm text-[#231933] placeholder:text-[#3b2a60]/35 focus:outline-none focus:border-[#3b2a60]/40 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Filter button — visible always, opens drawer on all breakpoints */}
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="flex shrink-0 items-center gap-2 rounded-full border border-[#3b2a60]/15 bg-white/70 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-medium text-[#3b2a60] hover:border-[#3b2a60]/35 hover:bg-white transition-colors"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="hidden sm:inline">Filter</span>
                            {activeFilters.length > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#3b2a60] text-[9px] font-bold text-white">
                                    {activeFilters.length}
                                </span>
                            )}
                        </button>

                        {/* Sort — hidden on very small screens, shown from sm up */}
                        <div className="hidden sm:block">
                            <SortDropdown value={sortBy} onChange={setSortBy} />
                        </div>
                    </div>

                    {/* Row 2: category pills (scrollable) + count/sort on mobile */}
                    <div className="mt-3.5 flex items-center gap-3">
                        <div className="flex-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <CategoryPill
                                label="All"
                                active={selectedCategory === "All"}
                                onClick={() => handleCategoryChange("All")}
                            />
                            {categories.map((c) => (
                                <CategoryPill
                                    key={c.id}
                                    label={c.name}
                                    active={selectedCategory === c.name}
                                    onClick={() => handleCategoryChange(c.name)}
                                />
                            ))}
                        </div>
                        
                    </div>

                    
                   
                </div>
            </div>

            {/* ---------------- Product grid ---------------- */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
                <SectionRibbon />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative">
                {/* subtle decorative circles for the grid section, distinct from hero */}
                <div aria-hidden className="pointer-events-none absolute -left-10 top-1/3 w-64 h-64 rounded-full bg-[#d3c5f6]/20 blur-3xl" />

                {visibleProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
                            {visibleProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index % PAGE_SIZE}
                                    isWishlisted={isInWishlist(product.id)}
                                    onAddToCart={(e) => handleAddToCart(e, product)}
                                    onToggleWishlist={(e) => handleToggleWishlist(e, product)}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                                    className="rounded-full border border-[#3b2a60]/20 bg-white px-9 py-3.5 text-sm font-semibold text-[#3b2a60] shadow-[0_10px_30px_-15px_rgba(59,42,96,0.35)] transition-all hover:bg-[#3b2a60] hover:text-white hover:shadow-[0_15px_35px_-12px_rgba(59,42,96,0.5)] active:scale-[0.98]"
                                >
                                    Load More Products
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="relative rounded-[2rem] border border-dashed border-[#3b2a60]/15 bg-white/50 py-20 text-center">
                        <EmptyStateIllustration />
                        <h3 className="font-serif text-xl text-[#231933] mb-2">No products found</h3>
                        <p className="text-sm text-[#3b2a60]/50 mb-6 max-w-xs mx-auto">
                            Try adjusting your search or filters to discover more of the collection.
                        </p>
                        <Button
                            onClick={clearAllFilters}
                            className="rounded-full bg-[#3b2a60] hover:bg-[#4a3777] text-white px-6"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* ---------------- Filter Drawer ---------------- */}
            <FilterDrawer
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onClear={clearAllFilters}
                onApply={() => {}}
            />
        </div>
    )
}