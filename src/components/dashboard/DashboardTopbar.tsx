import { Menu, Bell,  Check, Trash2, ShoppingBag, Info, AlertTriangle } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNotificationStore } from "@/stores/useNotificationStore"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

type DashboardTopbarProps = {
  onMenuClick: () => void
  isSidebarOpen: boolean
}

export function DashboardTopbar({ onMenuClick, isSidebarOpen }: DashboardTopbarProps) {
  const { user } = useAuthStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(timestamp))
  }

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-50 transition-all duration-300 ${isSidebarOpen ? "lg:left-64 xl:left-72 " : "lg:left-0 z-10"}`}>
      <div className="flex items-center gap-4 ">
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
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={dropdownRef}>
            <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isOpen ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700'}`}
            >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop للموبايل فقط */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Dropdown */}
                    <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-auto sm:mt-3 w-auto sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-w-md sm:max-w-none mx-auto sm:mx-0">
                        <div className="p-3 sm:p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="bg-violet-100 text-violet-700 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1">
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={() => markAllAsRead()}
                                        className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-violet-600 transition-colors"
                                        title="Mark all as read"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={() => clearNotifications()}
                                        className="p-1.5 hover:bg-white rounded-lg text-gray-500 hover:text-rose-600 transition-colors"
                                        title="Clear all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[calc(100vh-12rem)] sm:max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-6 sm:p-8 text-center text-gray-500">
                                    <Bell className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                                    <p className="text-sm sm:text-base">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-50">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id} 
                                            className={`p-3 sm:p-4 hover:bg-gray-50 transition-colors relative group ${!notification.read ? 'bg-violet-50/30' : ''}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-2 sm:gap-3">
                                                <div className={`mt-0.5 sm:mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                    notification.type === 'order' ? 'bg-green-100 text-green-600' :
                                                    notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {notification.type === 'order' ? <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> :
                                                     notification.type === 'warning' ? <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> :
                                                     <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-xs sm:text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-[9px] sm:text-[10px] text-gray-400 whitespace-nowrap">
                                                            {formatDate(notification.date)}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    {notification.link && (
                                                        <Link 
                                                            to={notification.link}
                                                            className="inline-flex items-center text-[11px] sm:text-xs font-medium text-violet-600 hover:text-violet-700 mt-1.5 sm:mt-2"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            View Details →
                                                        </Link>
                                                    )}
                                                </div>
                                                {!notification.read && (
                                                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-2 h-2 bg-violet-500 rounded-full" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>

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