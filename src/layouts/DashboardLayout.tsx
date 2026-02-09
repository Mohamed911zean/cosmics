import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"
import { AdminOrderAlert } from "@/components/dashboard/AdminOrderAlert"

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return false
    return window.innerWidth >= 1024
  })

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-violet-50/30 text-[#1f1f1f]">
      <AdminOrderAlert />
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <DashboardTopbar isSidebarOpen={isSidebarOpen} onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
      <main className={`pt-24 px-4 sm:px-6 lg:px-8 pb-10 min-h-screen transition-all duration-300 ${isSidebarOpen ? "lg:ml-64 xl:ml-72" : "lg:ml-0"}`}>
        <Outlet />
      </main>
    </div>
  )
}
