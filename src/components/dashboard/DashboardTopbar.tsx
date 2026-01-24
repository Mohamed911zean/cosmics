import { Menu, Bell } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

type DashboardTopbarProps = {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export function DashboardTopbar({ onMenuClick, isSidebarOpen }: DashboardTopbarProps) {
  const { user } = useAuthStore()

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 transition-all duration-300 ${isSidebarOpen ? "lg:left-64 xl:left-72" : "lg:left-0"}`}>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-violet-100 flex items-center justify-center text-gray-600 hover:text-violet-700 transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">Welcome back, {user?.displayName?.split(" ")[0] || "Admin"}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-violet-100 flex items-center justify-center text-gray-600 hover:text-violet-700 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <span className="text-sm font-bold">{user?.displayName?.[0] || "A"}</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-gray-900">{user?.displayName || "Admin"}</div>
            <div className="text-xs text-gray-500">Administrator</div>
          </div>
        </div>
      </div>
    </header>
  )
}
