import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export function Footer() {

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="text-3xl font-serif font-bold tracking-wide">Lumière</h2>
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm">
              Elevate your beauty routine with our curated collection of premium cosmetics and skincare essentials.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                { label: "Collections", to: "/collections" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-rose-500 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest">Categories</h3>
            <ul className="space-y-3">
              {[
                { label: "Skincare", to: "/skincare" },
                { label: "Makeup", to: "/makeup" },
                { label: "Fragrance", to: "/fragrance" },
                { label: "Hair Care", to: "/haircare" },
                { label: "Accessories", to: "/accessories" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(link.label)}`}
                    className="text-gray-400 hover:text-rose-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-rose-500 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">123 Beauty Boulevard, Fashion District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-gray-400 text-sm">+1 (800) LUMIERE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="text-gray-400 text-sm">hello@lumiere.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Lumière. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-rose-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-rose-400 text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
