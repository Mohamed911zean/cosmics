import { Outlet, useLocation, Link, useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { Apple, LayoutDashboard, Users, MessageSquare, HelpCircle, Settings, Lock, LogOut, Menu, Search, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { toast } from "sonner"

export function DashboardLayout() {
  const location = useLocation()
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const menuItems = useMemo(() => ([
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/dashHome" },
    { label: "Customers", icon: Users },
    { label: "Messages", icon: MessageSquare },
    { label: "Help", icon: HelpCircle },
    { label: "Settings", icon: Settings },
    { label: "Password", icon: Lock },
  ]), [])

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
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <aside className="fixed left-0 top-0 bottom-0 w-64 xl:w-72 bg-[#4B0082] text-white flex flex-col">
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
            <Apple className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-wide">Brand Name</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = item.href ? location.pathname === item.href : false
            const baseClasses = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
            const activeClasses = "bg-white/15 text-white"
            const inactiveClasses = "text-white/80 hover:bg-white/10"
            if (item.href) {
              return (
                <Link key={item.label} to={item.href} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            }
            return (
              <button key={item.label} type="button" className={`${baseClasses} ${inactiveClasses}`}>
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
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

      <header className="fixed top-0 left-64 xl:left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10">
        <div className="flex items-center gap-4">
          <button type="button" className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#4B0082] transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              placeholder="Search here"
              className="h-10 w-72 rounded-lg border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <span className="text-sm font-semibold">{user?.displayName?.[0] || "U"}</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            {user?.displayName || "User"}
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="ml-64 xl:ml-72 pt-24 px-8 pb-10 bg-white min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
