import { ShoppingBag, Menu, User, X, Heart, Search, ChevronRight, Home, Grid3x3 } from "lucide-react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCartStore, useWishlistStore, useUIStore, useProductStore, useAuthStore } from "@/stores"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const { products } = useProductStore()
  const cartCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())
  const { isMenuOpen, setMenuOpen } = useUIStore()
  const { user, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const brandName = "Majestics"

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return []
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
  }, [searchQuery, products])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
          ? "bg-ivory/90 backdrop-blur-md py-4 border-b border-border/50"
          : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="relative flex items-center justify-between">

            {/* 1. Left Section: Desktop Nav / Mobile Menu */}
            <div className="flex-1 flex items-center justify-start gap-4">
              {/* Desktop Navigation */}
              <div className="hidden xl:flex items-center gap-8">
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/about">Our Story</NavLink>
                <NavLink to="/shop">Collections</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(true)}
                className="xl:hidden p-2 -ml-2 text-foreground hover:text-taupe transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* 2. Center Section: Logo (Absolute Centered) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex-shrink-0 z-10">
              <Link to="/" className="group block">
                <h1 className="text-xl md:text-2xl xl:text-3xl font-serif tracking-[0.2em] font-medium text-foreground group-hover:text-taupe transition-colors duration-500 whitespace-nowrap">
                  {brandName}
                </h1>
              </Link>
            </div>

            {/* 3. Right Section: Actions */}
            <div className="flex-1 flex items-center justify-end gap-1 md:gap-4">
              {/* Search is always visible for accessibility */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-foreground hover:text-taupe transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* These are hidden on mobile as they are moved to bottom nav */}
              <div className="hidden xl:flex items-center gap-4">
                <Link to="/wishlist" className="relative group p-2">
                  <Heart className="w-5 h-5 text-foreground group-hover:text-taupe transition-colors" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-foreground text-[8px] font-bold rounded-full flex items-center justify-center border border-ivory">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <div className="relative" ref={userMenuRef}>
                  <Link to={user ? "/account" : "/login"} className="p-2 block text-foreground hover:text-taupe transition-colors">
                    <User className="w-5 h-5" />
                  </Link>
                </div>

                <Link to="/cart" className="relative group p-2">
                  <ShoppingBag className="w-5 h-5 text-foreground group-hover:text-taupe transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-foreground text-ivory text-[8px] font-bold rounded-full flex items-center justify-center border border-ivory transition-transform group-hover:scale-110">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar for Mobile/Tablet */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-ivory/95 backdrop-blur-md border-t border-border/50 pb-safe">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/home"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/home') ? 'text-foreground' : 'text-taupe'
              }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </Link>

          <Link
            to="/shop"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/collections') ? 'text-foreground' : 'text-taupe'
              }`}
          >
            <Grid3x3 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Shop</span>
          </Link>

          <Link
            to="/wishlist"
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${isActive('/wishlist') ? 'text-foreground' : 'text-taupe'
              }`}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-accent text-foreground text-[8px] font-bold rounded-full flex items-center justify-center border border-ivory">
                {wishlistCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
          </Link>

          <Link
            to="/cart"
            className={`flex flex-col items-center justify-center gap-1 transition-colors relative ${isActive('/cart') ? 'text-foreground' : 'text-taupe'
              }`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-1/2 translate-x-3 w-4 h-4 bg-foreground text-ivory text-[8px] font-bold rounded-full flex items-center justify-center border border-ivory">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">Cart</span>
          </Link>

          <Link
            to={user ? "/account" : "/login"}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${isActive('/account') || isActive('/login') ? 'text-foreground' : 'text-taupe'
              }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] bg-ivory/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-serif">Search Marketplace</h2>
                <button
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery("")
                  }}
                  className="p-3 border border-border rounded-full hover:bg-surface transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="relative mb-12">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for authentic brands, products, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-border py-4 text-3xl font-serif focus:outline-none focus:border-accent transition-colors placeholder:text-taupe/30"
                  />
                  <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 text-taupe/30" />
                </div>

                <div className="grid gap-6">
                  {filteredProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-6 p-4 rounded-3xl hover:bg-surface transition-all group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface border border-border/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-taupe font-bold mb-1 block">
                          {product.category}
                        </span>
                        <h3 className="text-xl font-serif">{product.name}</h3>
                        <p className="text-accent font-medium">${product.price.toFixed(2)}</p>
                      </div>
                      <ChevronRight className="ml-auto w-5 h-5 text-taupe opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {searchQuery && filteredProducts.length === 0 && (
                    <p className="text-center py-20 text-taupe italic">
                      No products found matching "{searchQuery}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ivory"
          >
            <div className="container mx-auto px-8 py-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-20">
                <h2 className="text-xl font-serif tracking-widest uppercase">Menu</h2>
                <button onClick={() => setMenuOpen(false)} className="p-2 border border-border rounded-full hover:bg-muted transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-8">
                {["About", "Contact", "Orders"].map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl md:text-6xl font-serif hover:text-taupe transition-colors italic"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-6 pb-4">

                {user && (
                  <button onClick={handleLogout} className="text-xs font-bold uppercase tracking-widest text-accent text-left">
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="relative text-sm font-bold uppercase tracking-[0.2em] text-foreground hover:text-taupe transition-colors duration-300 group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-taupe transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}