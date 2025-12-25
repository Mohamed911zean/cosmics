import { ShoppingCart, Search, Menu, User, X, Heart, ChevronDown, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "./ThemeProvider"

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [cartCount] = useState(3)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-secondary/50 rounded-none transition-all"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="group flex items-center">
                <h1 className="text-2xl lg:text-3xl font-serif text-foreground tracking-[0.1em] group-hover:text-accent transition-all duration-500">
                  LUMIÈRE
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <NavLink href="/shop">Shop</NavLink>
              <NavLink href="/collections">Collections</NavLink>
              <NavLink href="/bestsellers">Bestsellers</NavLink>
              <NavLink href="/about">Our Story</NavLink>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 lg:gap-8">
              {/* Search - Desktop */}
              <div className="hidden md:block">
                {isSearchOpen ? (
                  <div className="flex items-center gap-2 animate-reveal-up duration-500">
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="w-48 lg:w-64 h-10 text-[10px] uppercase tracking-widest bg-secondary/30 border-none rounded-none focus-visible:ring-1 focus-visible:ring-accent/30"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 hover:bg-secondary/50 rounded-none"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary/50 rounded-none transition-all group"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-5 w-5 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                  </Button>
                )}
              </div>

              {/* Search - Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-secondary/50 rounded-none transition-all"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex hover:bg-secondary/50 rounded-none relative group transition-all"
              >
                <Heart className="h-5 w-5 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] w-4 h-4 rounded-none flex items-center justify-center font-bold tracking-tighter">
                  2
                </span>
              </Button>

              {/* User Account */}
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-secondary/50 rounded-none group transition-all"
                >
                  <User className="h-5 w-5 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                </Button>
              </Link>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary/50 rounded-none group transition-all"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 group-hover:text-accent group-hover:-rotate-12 transition-all duration-300" />
                ) : (
                  <Sun className="h-5 w-5 group-hover:text-accent group-hover:rotate-90 transition-all duration-300" />
                )}
              </Button>

              {/* Shopping Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-secondary/50 rounded-none group transition-all"
                >
                  <ShoppingCart className="h-5 w-5 group-hover:text-accent group-hover:scale-110 transition-all duration-300" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] w-4 h-4 rounded-none flex items-center justify-center font-bold tracking-tighter animate-in zoom-in duration-500">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-3 border-t border-border animate-in slide-in-from-top-5 duration-300">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full"
                autoFocus
              />
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] sm:w-[320px] bg-background z-50 lg:hidden transform transition-transform duration-300 ease-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
          } shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              <MobileNavLink href="#shop">Shop All</MobileNavLink>
              <MobileNavLink href="#new">New Arrivals</MobileNavLink>
              <MobileNavLink href="#skincare">Skincare</MobileNavLink>
              <MobileNavLink href="#makeup">Makeup</MobileNavLink>
              <MobileNavLink href="#fragrance">Fragrance</MobileNavLink>
              <MobileNavLink href="#bestsellers">Bestsellers</MobileNavLink>
              <div className="border-t border-border my-4" />
              <MobileNavLink href="#collections">Collections</MobileNavLink>
              <MobileNavLink href="#about">About Us</MobileNavLink>
              <MobileNavLink href="#contact">Contact</MobileNavLink>
              <MobileNavLink href="#faq">FAQ</MobileNavLink>
            </nav>
          </div>

          {/* Menu Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mb-3">
                Sign In
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

// Desktop Navigation Link Component
function NavLink({
  href,
  children,
  hasDropdown = false
}: {
  href: string
  children: React.ReactNode
  hasDropdown?: boolean
}) {
  return (
    <a
      href={href}
      className="group relative px-2 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground/60 hover:text-accent transition-all duration-300 flex items-center gap-1"
    >
      {children}
      {hasDropdown && <ChevronDown className="h-3 w-3 opacity-50" />}
      <span className="absolute bottom-1 left-2 right-2 h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </a>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({
  href,
  children
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="block px-4 py-3 text-base font-medium text-foreground hover:bg-secondary hover:text-primary rounded-lg transition-all duration-200"
    >
      {children}
    </a>
  )
}
