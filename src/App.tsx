import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/authContext"
import { Navbar } from "@/components/Navbar"
import  Home  from "@/pages/Home"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { Cart } from "@/pages/Cart"
import { Checkout } from "@/pages/Checkout"
import { ProductPage } from "@/pages/ProductPage"
import { Wishlist } from "@/pages/Wishlist"
import { Orders } from "@/pages/Orders"
import { Account } from "@/pages/Account"
import { Contact } from "@/pages/Contact"
import { Footer } from "@/components/Footer"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import About from "./pages/About"
import { StoreSynchronizer } from "@/components/StoreSynchronizer"

import { Shop } from "@/pages/Shop"
import { OrderSuccess } from "@/pages/OrderSuccess"
import { NotFound } from "@/pages/NotFound"
import { Privacy } from "@/pages/legal/Privacy"
import { Terms } from "@/pages/legal/Terms"
import { Shipping } from "@/pages/legal/Shipping"
import { FAQ } from "@/pages/legal/FAQ"

export default function App() {
  return (
    <AuthProvider>
      <StoreSynchronizer />
      <Toaster position="top-center" expand={false} richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About/>}  />
        <Route path="/shop" element={<Shop />} />
        <Route path="/collections" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />

        {/* Support Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}