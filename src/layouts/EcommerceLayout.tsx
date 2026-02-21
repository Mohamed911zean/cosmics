import { Outlet } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useAuthStore } from "@/stores/useAuthStore"
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"

export function EcommerceLayout() {
  const { role, isLoading } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && (role === 'admin' || role === 'superadmin')) {
      navigate('/dashboard/dashHome')
    }
  } , [isLoading , navigate , role])
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
