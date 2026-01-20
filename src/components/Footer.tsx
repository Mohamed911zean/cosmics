import { Instagram, Mail, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">

          {/* Brand & Social */}
          <div className="md:col-span-1">
            <Link to="/">
              <h3 className="text-2xl font-serif mb-6 tracking-[0.2em] font-medium text-foreground">LUX CO.</h3>
            </Link>
            <p className="text-taupe text-sm leading-relaxed mb-8 max-w-[240px]">
              Crafting moments of luxury for your daily beauty rituals. Pure, natural, and timeless essentials.
            </p>
            <div className="flex gap-4">
              {[Instagram, Mail].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-taupe hover:text-foreground hover:border-taupe transition-all"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
              <motion.a
                href="#"
                whileHover={{ y: -2 }}
                className="px-4 h-10 rounded-full border border-border flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-taupe hover:text-foreground hover:border-taupe transition-all"
              >
                Pinterest
              </motion.a>
            </div>
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

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-foreground">The Journal</h4>
            <p className="text-xs text-taupe mb-6 leading-relaxed">Join our inner circle for exclusive updates and beauty insights.</p>
            <div className="relative">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full pb-3 bg-transparent border-b border-border focus:outline-none focus:border-taupe transition-colors text-[10px] font-bold tracking-widest placeholder:text-taupe/50"
              />
              <button className="absolute right-0 bottom-3 text-taupe hover:text-foreground transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-taupe/60 mt-4 leading-relaxed uppercase tracking-wider">
              By joining, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-[10px] text-taupe font-bold uppercase tracking-[0.2em] gap-6">
          <p>© 2026 Lux Cosmetics. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
