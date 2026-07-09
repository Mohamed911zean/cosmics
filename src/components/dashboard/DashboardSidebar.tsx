import { Link, useLocation, useNavigate } from "react-router-dom"
import { UserStar, LayoutDashboard, Users, Package, ShoppingBag, User, LogOut, X, ChevronDown, PackagePlus, TrendingUp, List, type LucideIcon , Layers } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"
import { useState } from "react"

type DashboardSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

type SubMenuItem = {
  label: string
  icon: LucideIcon
  to: string
}

type MenuItem = {
  label: string
  icon: LucideIcon
  to?: string
  submenu?: SubMenuItem[]
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard/dashHome" },
  { label: "Orders", icon: ShoppingBag, to: "/dashboard/orders" },
  { label: "Customers", icon: Users, to: "/dashboard/customers" },
  { label: "Categories", icon: Layers, to: "/dashboard/categories" },
  {
    label: "Products",
    icon: Package,
    submenu: [
      { label: "All Products", icon: List, to: "/dashboard/products" },
      { label: "Add Product", icon: PackagePlus, to: "/dashboard/products/add" },
      { label: "Best Sellers", icon: TrendingUp, to: "/dashboard/products/best-sellers" },
    ]
  },
  { label: "Account", icon: User, to: "/dashboard/account" },
]

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation()
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Products")

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully")
      navigate("/")
    } catch (error) {
      toast.error("Failed to logout")
    }
  }

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label)
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 xl:w-72 bg-primary text-primary-foreground flex flex-col transition-transform duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-surface/15 flex items-center justify-center">
              <UserStar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-wide">Admin Page</span>
          </div>
          <button type="button" onClick={onClose} className="lg:hidden w-9 h-9 rounded-full bg-surface/10 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const hasSubmenu = 'submenu' in item
            const isParentActive = hasSubmenu && item.submenu?.some(sub => location.pathname === sub.to)
            const isActive = !hasSubmenu && location.pathname === item.to
            const isSubmenuOpen = openSubmenu === item.label

            const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            const activeClasses = "bg-surface/15 text-primary-foreground"
            const inactiveClasses = "text-primary-foreground/80 hover:bg-surface/10"

            if (hasSubmenu) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`${baseClasses} ${isParentActive ? activeClasses : inactiveClasses} justify-between`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isSubmenuOpen && (
                    <div className="mt-1 ml-4 space-y-1">
                      {item.submenu?.map((subItem) => {
                        const SubIcon = subItem.icon
                        const isSubActive = location.pathname === subItem.to
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.to}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isSubActive ? "bg-surface/20 text-primary-foreground" : "text-primary-foreground/70 hover:bg-surface/10"
                              }`}
                            onClick={handleNavClick}
                          >
                            <SubIcon className="w-4 h-4" />
                            {subItem.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            if (!item.to) return null

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                onClick={handleNavClick}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="px-4 pb-6">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary-foreground/90 hover:bg-surface/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}