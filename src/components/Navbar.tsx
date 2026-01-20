import { ShoppingBag, Menu, User, X, Heart, Search } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore, useWishlistStore, useUIStore } from "@/stores"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const cartCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())
  const { isMenuOpen, setMenuOpen } = useUIStore()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
          ? "bg-ivory/90 backdrop-blur-md py-4 border-b border-border/50"
          : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/collections">Collections</NavLink>
              <NavLink to="/about">Our Story</NavLink>
              <NavLink to="/home">Home</NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 text-foreground hover:text-taupe transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Centered Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center group">
              <h1 className="text-2xl md:text-3xl font-serif tracking-[0.2em] font-medium text-foreground group-hover:text-taupe transition-colors duration-500">
                Majestic
              </h1>
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 md:gap-6">
              <button className="hidden md:block p-2 text-foreground hover:text-taupe transition-colors">
                <Search className="w-5 h-5" />
              </button>

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
      </nav>

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
                {["Shop", "Collections", "Our Story", "Wishlist", "Account", "Cart", "Contact", "Orders"].map((item, idx) => (
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