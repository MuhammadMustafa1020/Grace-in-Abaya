import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-rose-dark text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h2 className="font-serif text-xl font-bold mb-3">Grace <span className="text-gold italic font-normal">in</span> Abaya</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Elegant modest fashion for the modern Muslim woman. Crafted with love, worn with pride.
          </p>
        </div>
        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/products?category=abaya-casual" className="hover:text-white transition-colors">Casual Abayas</Link></li>
            <li><Link to="/products?category=abaya-designer" className="hover:text-white transition-colors">Designer Abayas</Link></li>
            <li><Link to="/products?category=hijab" className="hover:text-white transition-colors">Hijabs</Link></li>
            <li><Link to="/products?category=accessory" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-4">Account</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link to="/wardrobe" className="hover:text-white transition-colors">My Wardrobe</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs tracking-widest uppercase text-gold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>UET Peshawar, KPK</li>
            <li>grace.in.abaya@uetpeshawar.edu.pk</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 text-center py-5 text-xs text-white/40">
        © 2025 Grace in Abaya · Final Year Project · BS Computer Science, UET Peshawar
      </div>
    </footer>
  )
}
