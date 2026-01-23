import { Menu, Search, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

type DashboardTopbarProps = {
  onMenuClick: () => void
}

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const { user } = useAuthStore()

  return (
    <header className="fixed top-0 left-0 lg:left-64 xl:left-72 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
      <div className="flex items-center gap-3 flex-1">
        <button type="button" onClick={onMenuClick} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#4B0082] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Search here"
            className="h-10 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B0082]/30"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
          <span className="text-sm font-semibold">{user?.displayName?.[0] || "U"}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700">
          {user?.displayName || "User"}
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  )
}
