import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, ShoppingBag, SlidersHorizontal, Star, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { StockNotifyForm } from '@/components/shop/StockNotifyForm'
import { useCartStore, useProductStore, useWishlistStore } from '@/stores'
import type { Product, Category } from '@/stores'
import type { SortOption } from '@/lib/products'

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'rating', label: 'Highest Rated' },
]

const PAGE_SIZE = 8
const MAX_PRICE = 10000

function CategoryPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={[
        'shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b2a60]/40',
        active
          ? 'bg-[#3b2a60] text-white shadow-[0_8px_20px_-6px_rgba(59,42,96,0.45)]'
          : 'bg-white/70 text-[#3b2a60] border border-[#3b2a60]/15 hover:border-[#3b2a60]/35 hover:bg-white',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function StarRating({ value = 4.8 }: { value?: number }) {
  const rounded = Math.round(value)
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-3 h-3 ${index < rounded ? 'fill-[#c9a227] text-[#c9a227]' : 'fill-transparent text-[#3b2a60]/20'}`}
        />
      ))}
    </div>
  )
}

function FilterDrawer({
  open,
  onClose,
  categories,
  selectedCategory,
  onCategoryChange,
  maxPrice,
  onMaxPriceChange,
}: {
  open: boolean
  onClose: () => void
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  maxPrice: number
  onMaxPriceChange: (price: number) => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close filters" className="absolute inset-0 bg-[#231933]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-[#FBF9F5] px-6 py-6 shadow-[0_-20px_60px_-15px_rgba(59,42,96,0.35)] sm:left-auto sm:right-6 sm:top-24 sm:bottom-auto sm:w-96 sm:rounded-[1.5rem]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#231933]">Filters</h2>
          <button onClick={onClose} className="rounded-full p-2 text-[#3b2a60]/60 hover:bg-[#3b2a60]/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3b2a60]/50">Category</h3>
            <div className="flex flex-wrap gap-2">
              <CategoryPill label="All" active={selectedCategory === 'All'} onClick={() => onCategoryChange('All')} />
              {categories.map((category) => (
                <CategoryPill
                  key={category.id}
                  label={category.name}
                  active={selectedCategory === category.name}
                  onClick={() => onCategoryChange(category.name)}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#3b2a60]/50">Max Price</h3>
            <input
              type="range"
              min={0}
              max={MAX_PRICE}
              step={50}
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(Number(event.target.value))}
              className="w-full accent-[#3b2a60]"
            />
            <div className="mt-2 flex justify-between text-sm text-[#3b2a60]/60">
              <span>0</span>
              <span className="font-semibold text-[#3b2a60]">{maxPrice}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ProductTile({
  product,
  index,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}: {
  product: Product
  index: number
  isWishlisted: boolean
  onAddToCart: (product: Product) => void
  onToggleWishlist: (product: Product) => void
}) {
  const isOutOfStock = product.stock_quantity <= 0
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.25) }}
      className="group relative flex flex-col"
    >
      <div className="relative overflow-hidden rounded-[1.5rem] border border-[#3b2a60]/10 bg-white shadow-[0_10px_35px_-18px_rgba(59,42,96,0.3)] transition-shadow duration-500 group-hover:shadow-[0_25px_60px_-20px_rgba(59,42,96,0.45)]">
        <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden bg-[#f4f0fb]">
          <img
            src={product.image || '/android-chrome-192x192.png'}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && <span className="rounded-full bg-[#3b2a60] px-2.5 py-1 text-[10px] font-semibold text-white">NEW</span>}
            {isLowStock && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#3b2a60] shadow-sm">Only {product.stock_quantity} left</span>}
            {isOutOfStock && <span className="rounded-full bg-[#231933] px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm">Out of Stock</span>}
          </div>

          <button
            onClick={(event) => {
              event.preventDefault()
              onToggleWishlist(product)
            }}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isWishlisted}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-sm transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            <Heart className={`h-4.5 w-4.5 transition-all duration-300 ${isWishlisted ? 'fill-[#3b2a60] text-[#3b2a60] scale-110' : 'text-[#3b2a60]'}`} />
          </button>
        </Link>

        <div className="p-4 sm:p-5">
          <p className="mb-1 text-[10px] uppercase tracking-[0.15em] text-[#3b2a60]/50">{product.category}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="mb-1.5 line-clamp-1 font-serif text-[15px] leading-snug text-[#231933] transition-colors hover:text-[#3b2a60] sm:text-lg">
              {product.name}
            </h3>
          </Link>
          <StarRating value={product.rating || 4.8} />

          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-base font-semibold text-[#3b2a60] sm:text-lg">{product.currency} {product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-xs text-[#3b2a60]/40 line-through">{product.currency} {product.originalPrice.toFixed(2)}</span>}
          </div>

          {isOutOfStock ? (
            <div className="mt-3.5 space-y-2">
              <StockNotifyForm productId={product.id} compact />
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3b2a60] py-3 text-xs font-semibold text-white shadow-[0_10px_25px_-10px_rgba(59,42,96,0.6)] transition-all duration-300 hover:bg-[#4a3777] active:scale-[0.98] sm:text-sm"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to Bag
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function Shop() {
  const { products, categories, isLoading, totalCount, fetchProducts, fetchCategories } = useProductStore()
  const addToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [filterOpen, setFilterOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    fetchCategories().catch((error) => console.error('Failed to load categories:', error))
  }, [fetchCategories])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      fetchProducts({
        search: searchQuery,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        maxPrice,
        sort: sortBy,
        page: 1,
        pageSize: visibleCount,
      }).catch((error) => {
        console.error(error)
        toast.error('Failed to load products')
      })
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [searchQuery, selectedCategory, maxPrice, sortBy, visibleCount, fetchProducts])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setVisibleCount(PAGE_SIZE)
    const next = new URLSearchParams(searchParams)
    if (category === 'All') next.delete('category')
    else next.set('category', category)
    setSearchParams(next)
  }

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      toast.error('This product is out of stock')
      return
    }

    addToCart({
      id: product.id,
      productId: product.id,
      variantId: null,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stockQuantity: product.stock_quantity,
    })
    toast.success(`${product.name} added to bag`, {
      action: { label: 'Checkout', onClick: () => (window.location.href = '/cart') },
    })
  }

  const handleToggleWishlist = async (product: Product) => {
    const wasWishlisted = isInWishlist(product.id)
    try {
      await toggleItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
      toast.success(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
    } catch (error) {
      if (error instanceof Error && error.message === 'SIGN_IN_REQUIRED') {
        toast.error('Please sign in to use your wishlist')
      } else {
        toast.error('Could not update wishlist')
      }
    }
  }

  const hasMore = products.length < totalCount

  return (
    <div className="min-h-screen bg-[#FBF9F5]">
      <section className="relative overflow-hidden pt-28 pb-14 text-center sm:pt-36 sm:pb-20">
        <div className="pointer-events-none absolute -right-16 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#d3c5f6]/40 blur-3xl" />
        <div className="container relative mx-auto px-5 sm:px-6 lg:px-8">
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5 font-serif text-4xl leading-[1.05] text-[#231933] sm:text-6xl lg:text-7xl">
            Luxury Skincare
            <br />
            <span className="text-[#3b2a60]">Collection</span>
          </motion.h1>
          <p className="mx-auto mb-7 max-w-xl text-sm text-[#3b2a60]/60 sm:text-base">
            Discover authentic skincare from leading beauty brands, curated for your everyday ritual.
          </p>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3b2a60]/15 bg-white/60 px-5 py-2 text-xs font-medium text-[#3b2a60]">
            {totalCount || products.length} Products
          </span>
        </div>
      </section>

      <div className="sticky top-0 z-30 border-b border-[#3b2a60]/10 bg-[#FBF9F5]/85 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3b2a60]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  setVisibleCount(PAGE_SIZE)
                }}
                placeholder="Search skincare, brands, concerns..."
                aria-label="Search products"
                className="w-full rounded-full border border-[#3b2a60]/15 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-[#231933] placeholder:text-[#3b2a60]/35 transition-colors focus:border-[#3b2a60]/40 focus:bg-white focus:outline-none sm:py-3"
              />
            </div>

            <button onClick={() => setFilterOpen(true)} className="flex shrink-0 items-center gap-2 rounded-full border border-[#3b2a60]/15 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#3b2a60] transition-colors hover:border-[#3b2a60]/35 hover:bg-white sm:px-5 sm:py-3">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value as SortOption)
                setVisibleCount(PAGE_SIZE)
              }}
              className="hidden rounded-full border border-[#3b2a60]/15 bg-white/70 px-4 py-3 text-sm font-medium text-[#3b2a60] outline-none sm:block"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-3.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <CategoryPill label="All" active={selectedCategory === 'All'} onClick={() => handleCategoryChange('All')} />
            {categories.map((category) => (
              <CategoryPill key={category.id} label={category.name} active={selectedCategory === category.name} onClick={() => handleCategoryChange(category.name)} />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        {isLoading && products.length === 0 ? (
          <div className="py-24 text-center text-sm font-medium text-[#3b2a60]/60">Loading products...</div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-7">
              {products.map((product, index) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  index={index % PAGE_SIZE}
                  isWishlisted={isInWishlist(product.id)}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="rounded-full border border-[#3b2a60]/20 bg-white px-9 py-3.5 text-sm font-semibold text-[#3b2a60] shadow-[0_10px_30px_-15px_rgba(59,42,96,0.35)] transition-all hover:bg-[#3b2a60] hover:text-white active:scale-[0.98]"
                >
                  Load More Products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-[#3b2a60]/15 bg-white/50 py-20 text-center">
            <h3 className="mb-2 font-serif text-xl text-[#231933]">No products found</h3>
            <p className="mx-auto mb-6 max-w-xs text-sm text-[#3b2a60]/50">Try adjusting your search or filters.</p>
            <Button onClick={() => { setSearchQuery(''); handleCategoryChange('All'); setMaxPrice(MAX_PRICE) }} className="rounded-full bg-[#3b2a60] px-6 text-white hover:bg-[#4a3777]">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        maxPrice={maxPrice}
        onMaxPriceChange={(price) => {
          setMaxPrice(price)
          setVisibleCount(PAGE_SIZE)
        }}
      />
    </div>
  )
}
