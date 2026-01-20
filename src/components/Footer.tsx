import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">

          {/* Brand & Social */}
          <div className="md:col-span-1">
            <Link to="/home">
              <h3 className="text-2xl font-serif mb-6 tracking-[0.2em] font-medium text-foreground">Majestics.</h3>
            </Link>
            <p className="text-taupe text-sm leading-relaxed mb-8 max-w-[240px]">
              Crafting moments of luxury for your daily beauty rituals. Pure, natural, and timeless essentials.
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

         {/* Contact Info */}
<div>
  <h4 className="font-bold mb-8 uppercase text-[10px] tracking-[0.3em] text-foreground">
    Contact
  </h4>

  <ul className="space-y-4 text-sm text-taupe font-medium">
    <li>
      <a
        href="mailto:hello@majestics.com"
        className="hover:text-foreground transition-colors"
      >
        elkonmohamed911@gmail.com    [Owner Email] 
      </a>
    </li>

    <li>
      <a
        href="mailto:support@majestics.com"
        className="hover:text-foreground transition-colors"
      >
        el3shmawy911gt3rs@gmail.com    [Support Email]
      </a>
    </li>

    <li className="text-taupe/80">
      Dakahlia , Mansoura , Egypt
    </li>
  </ul>
</div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50 text-[10px] text-taupe font-bold uppercase tracking-[0.2em] gap-6">
          <p>© 2026 majestics. All Rights Reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
