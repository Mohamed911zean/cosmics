import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

import ScrollToTop from "@/components/ScrollToTop"

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
import { OrderDetail } from "@/pages/account/OrderDetail"
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
import DashboardOrders from "@/pages/dashboard/Orders"
import OrderDetails from "@/pages/dashboard/OrderDetails"
import DashboardCustomers from "@/pages/dashboard/Customers"
import AllProducts from "@/pages/dashboard/Products"
import DashboardAccount from "@/pages/dashboard/Account"
import Categories from "@/pages/dashboard/Categories"
import Brands from "@/pages/dashboard/Brands"
import Analytics from "@/pages/dashboard/Analytics"

// Utils
import { useAuthStore } from "@/stores/useAuthStore"
import AddProduct from "./pages/dashboard/AddProduct"
import BestSellers from "./pages/dashboard/BestSellers"

export default function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    const unsubscribe = initializeAuth()
    return () => unsubscribe()
  }, [initializeAuth])

  return (
    <>
      <ScrollToTop />
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

          {/* Guest-browsable: anyone can look around and add to cart
              without an account. Login is only required at checkout. */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />

          <Route element={<PrivateRoute />}>
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Route>
        </Route>

        {/* ================= DASHBOARD ================= */}
        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard">
              <Route index element={<Navigate to="dashHome" replace />} />
              <Route path="dashHome" element={<DashHome />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="customers" element={<DashboardCustomers />} />
              <Route path="categories" element={<Categories />} />
              <Route path="brands" element={<Brands />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="products" element={<AllProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/best-sellers" element={<BestSellers />} />
              <Route path="account" element={<DashboardAccount />} />

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