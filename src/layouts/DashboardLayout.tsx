import { Outlet } from "react-router-dom"
import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <DashboardTopbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
      <main className="lg:ml-64 xl:ml-72 pt-24 px-4 sm:px-6 lg:px-8 pb-10 bg-white min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
