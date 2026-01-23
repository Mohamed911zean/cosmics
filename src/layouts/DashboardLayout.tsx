import { Outlet } from "react-router-dom"

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
