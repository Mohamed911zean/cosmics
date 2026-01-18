import { ShoppingCart, Menu, User, X, Heart, LogOut, UserCircle, Package, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCartStore, useWishlistStore, useUIStore } from "@/stores"
import { useAuth } from "@/context/authContext"
import { toast } from "sonner"

export function Navbar() {
  const cartCount = useCartStore((state) => state.getItemCount())
  const wishlistCount = useWishlistStore((state) => state.getItemCount())
  const { isMenuOpen, setMenuOpen } = useUIStore()
  const { user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ""
    if (user.displayName) return user.displayName
    if (user.email) return user.email.split("@")[0]
    return "User"
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
          }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Left - Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white hover:scale-105 transition-transform lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Desktop Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white hover:scale-105 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Center - Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:ml-8">
              <div className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <h1 className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 group-hover:from-rose-600 group-hover:to-orange-600 transition-all duration-300 tracking-wide">
                  Velvet & Vine
                </h1>
              </div>
            </Link>

            {/* Right - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">


              {/* Wishlist */}
              <Link to="/wishlist" className="hidden sm:flex relative">
                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* User Account */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      <div className="p-4 bg-gradient-to-br from-rose-50 to-orange-50 border-b border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <UserCircle className="h-4 w-4" />
                          My Account
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <User className="h-5 w-5 text-gray-600" />
                  </button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative">
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white hover:scale-105 transition-transform">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile/Desktop Menu Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[300px] sm:w-[350px] bg-white z-50 transform transition-transform duration-300 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h2 className="text-xl font-serif font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-5 border-b border-gray-200 bg-gradient-to-br from-rose-50 to-orange-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white font-bold">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-5">
            <nav className="space-y-1">
              <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/shop" onClick={() => setMenuOpen(false)}>Shop All</MobileNavLink>
              <MobileNavLink to="/collections" onClick={() => setMenuOpen(false)}>Collections</MobileNavLink>
              <MobileNavLink to="/skincare" onClick={() => setMenuOpen(false)}>Skincare</MobileNavLink>
              <MobileNavLink to="/makeup" onClick={() => setMenuOpen(false)}>Makeup</MobileNavLink>
              <MobileNavLink to="/fragrance" onClick={() => setMenuOpen(false)}>Fragrance</MobileNavLink>
              <MobileNavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
                <div className="flex items-center gap-3">
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </MobileNavLink>

              <div className="border-t border-gray-200 my-4" />

              <MobileNavLink to="/about" onClick={() => setMenuOpen(false)}>About Us</MobileNavLink>
              <MobileNavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</MobileNavLink>

              {user && (
                <>
                  <div className="border-t border-gray-200 my-4" />
                  <MobileNavLink to="/account" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-3">
                      <UserCircle className="h-5 w-5 text-gray-400" />
                      My Account
                    </div>
                  </MobileNavLink>
                  <MobileNavLink to="/orders" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-gray-400" />
                      Orders
                    </div>
                  </MobileNavLink>
                  <MobileNavLink to="/cart" onClick={() => setMenuOpen(false)}>
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-5 w-5 text-gray-400" />
                      Shopping Bag
                      {cartCount > 0 && (
                        <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {cartCount}
                        </span>
                      )}
                    </div>
                  </MobileNavLink>
                </>
              )}
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-5 border-t border-gray-200 space-y-3">
            {user ? (
              <Button
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                variant="outline"
                className="w-full h-12 rounded-full text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block">
                  <Button className="w-full h-12 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white border-0">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full h-12 rounded-full">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
    >
      {children}
    </Link>
  )
}