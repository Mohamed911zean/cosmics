import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/authContext"
import { Navbar } from "@/components/Navbar"
import { Home } from "@/pages/Home"
import { Login } from "@/pages/Login"
import { Signup } from "@/pages/Signup"
import { Cart } from "@/pages/Cart"
import { Checkout } from "@/pages/Checkout"
import { ProductPage } from "@/pages/ProductPage"
import { Footer } from "@/components/Footer"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" expand={false} richColors />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}