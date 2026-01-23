import { useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { Toaster } from "sonner"

import { StoreSynchronizer } from "@/components/shop/StoreSynchronizer"

// Layouts
import { EcommerceLayout } from "@/layouts/EcommerceLayout"
import { DashboardLayout } from "@/layouts/DashboardLayout"

// Route Guards
import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { AdminRoute } from "@/components/guards/AdminRoute"
import { SuperAdminRoute } from "@/components/guards/SuperAdminRoute"

// Ecommerce Pages
import Home from "@/pages/general/Home"
import { Login } from "@/pages/auth/Login"
import { Signup } from "@/pages/auth/Signup"
import { Shop } from "@/pages/shop/Shop"
import { Cart } from "@/pages/shop/Cart"
import { Checkout } from "@/pages/shop/Checkout"
import { Wishlist } from "@/pages/shop/Wishlist"
import { Orders } from "@/pages/account/Orders"
import { Account } from "@/pages/account/Account"
import { ProductPage } from "@/pages/shop/ProductPage"
import { OrderSuccess } from "@/pages/shop/OrderSuccess"
import { Contact } from "@/pages/general/Contact"
import About from "@/pages/general/About"

// Legal
import { Privacy } from "@/pages/legal/Privacy"
import { Terms } from "@/pages/legal/Terms"
import { Shipping } from "@/pages/legal/Shipping"
import { FAQ } from "@/pages/legal/FAQ"

// Dashboard
import DashHome from "@/pages/dashboard/DashboardHome"

// Utils
import { useAuthStore } from "@/stores/useAuthStore"

export default function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    const unsubscribe = initializeAuth()
    return () => unsubscribe()
  }, [initializeAuth])

  return (
    <>
      <StoreSynchronizer />
      <Toaster position="top-center" expand={false} richColors />

      <Routes>
        {/* ================= ECOMMERCE ================= */}
        <Route element={<EcommerceLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/faq" element={<FAQ />} />

          <Route element={<PrivateRoute />}>
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Route>
        </Route>

        {/* ================= DASHBOARD ================= */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard">
              <Route index element={<Navigate to="dashHome" replace />} />
              <Route path="dashHome" element={<DashHome />} />

              <Route element={<SuperAdminRoute />}>
                {/* superadmin routes */}
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
