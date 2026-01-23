import { Link, useLocation, useNavigate } from "react-router-dom"
import { Apple, LayoutDashboard, Users, MessageSquare, HelpCircle, Settings, Lock, LogOut, X } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

type DashboardSidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard/dashHome" },
  { label: "Customers", icon: Users, to: "/dashboard/customers" },
  { label: "Messages", icon: MessageSquare, to: "/dashboard/messages" },
  { label: "Help", icon: HelpCircle, to: "/dashboard/help" },
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
  { label: "Password", icon: Lock, to: "/dashboard/password" },
]

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

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
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed inset-y-0 left-0 w-64 xl:w-72 bg-[#4B0082] text-white flex flex-col transition-transform duration-300 z-30 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-wide">Brand Name</span>
          </div>
          <button type="button" onClick={onClose} className="lg:hidden w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            const activeClasses = "bg-white/15 text-white"
            const inactiveClasses = "text-white/80 hover:bg-white/10"
            return (
              <Link key={item.label} to={item.to} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} onClick={onClose}>
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
        <div className="px-4 pb-6">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
