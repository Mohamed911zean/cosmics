import { Link } from "react-router-dom"
import { useProductStore } from "@/stores"
import {ArrowUpRight} from "lucide-react"

export function Footer() {
  const { brand } = useProductStore()
  if (!brand) return null

  return (
    <footer className="bg-surface mb-10 mx-4 pt-24 pb-12 border-t border-border rounded-4xl">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">

          {/* Brand & Social */}
          <div className="md:col-span-1">
            <Link to="/home">
              <h3 className="text-2xl font-serif mb-6 tracking-[0.2em] font-medium text-foreground">{brand.name}.</h3>
            </Link>
            <p className="text-taupe text-sm leading-relaxed mb-8 max-w-[240px]">
              {brand.description}
            </p>

          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-foreground">Support</h4>
            <ul className="space-y-4 text-sm text-taupe font-medium">
              <li><Link to="/faq" className="hover:text-foreground transition-colors">Faq</Link></li>
              <li><Link to="/shipping" className="hover:text-foreground transition-colors">Shipping</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-taupe font-medium">
              <li><Link to="/about" className="hover:text-foreground transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Disclaimer & Contact */}
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-foreground">
              Marketplace Disclaimer
            </h4>
            <p className="text-taupe text-[10px] leading-relaxed mb-6 font-medium italic">
              Majestics is a reseller marketplace. All product names, trademarks, and brands are the property of their respective owners. We do not own or manufacture the products sold on this platform.
            </p>

            <ul className="space-y-4 text-sm text-taupe font-medium">
              <li>
                <a
                  href={`mailto:${brand.links.email}`}
                  className="hover:text-foreground transition-colors"
                >
                  {brand.links.email}
                </a>
              </li>
              <li className="text-taupe/80 text-xs">
                {brand.links.address}
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-[10px] text-taupe font-bold uppercase tracking-[0.2em] gap-6">
          <p>© 2026 {brand.name}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
         <a
  href="https://www.facebook.com/profile.php?id=61581516043531"
  target="_blank"
  rel="noopener noreferrer"
  className="group flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-primary transition-all duration-300"
>
  <span>Designed by</span>

  <span className="font-bold text-primary group-hover:tracking-[0.3em] transition-all duration-300">
    REACTECH
  </span>

  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -translate-x-1 transition-all duration-300" />
</a>
        </div>
      </div>
    </footer>
  )
}
