import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../api/api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { id: 'abaya-casual',   label: 'Casual Abayas',   emoji: '🌿', desc: 'Everyday elegance' },
  { id: 'abaya-designer', label: 'Designer Abayas',  emoji: '✦',  desc: 'Statement luxury' },
  { id: 'abaya-handmade', label: 'Handmade Abayas',  emoji: '🪡', desc: 'Artisan crafted' },
  { id: 'hijab',          label: 'Hijabs',            emoji: '🌸', desc: 'Styles for every mood' },
  { id: 'accessory',      label: 'Accessories',       emoji: '💎', desc: 'The finishing touch' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    api.get('/products?isFeatured=true&limit=4')
      .then(res => setFeatured(res.data.products))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-rose-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center text-white">
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">Premium Modest Fashion</p>
          <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
            Dress with<br /><em className="text-gold">Grace & Purpose</em>
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Curated abayas, hijabs and accessories for the modern Muslim woman. Elegant, authentic, and beautifully crafted.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/products" className="btn-gold px-8 py-3 text-sm">Explore Collection</Link>
            <Link to="/products?category=abaya-designer" className="btn-outline border-white text-white hover:bg-white hover:text-rose-dark px-8 py-3 text-sm">
              Designer Picks
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <p className="section-subtitle">Browse by Collection</p>
        <h2 className="section-title">Find Your Style</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.id}`}
              className="card p-5 text-center hover:border-rose transition-all group">
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <p className="font-serif text-sm font-semibold text-rose-dark group-hover:text-rose mb-1">{cat.label}</p>
              <p className="text-xs text-mink-light">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-cream-dark py-16">
          <div className="max-w-6xl mx-auto px-4">
            <p className="section-subtitle">Hand-Picked for You</p>
            <h2 className="section-title">Featured Pieces</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="text-center mt-10">
              <Link to="/products" className="btn-outline">View All Products</Link>
            </div>
          </div>
        </section>
      )}

      {/* AI Feature Banner */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-rose text-white rounded-sm p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
               style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">AI-Powered Styling</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Meet Noor, Your Personal Stylist
            </h2>
            <p className="text-white/75 max-w-lg mx-auto mb-8 leading-relaxed">
              Get personalized outfit recommendations for any occasion — Eid, weddings, casual days, and more. Just describe your event and let Noor do the magic.
            </p>
            <button className="btn-gold px-8 py-3"
              onClick={() => document.querySelector('[aria-label="Open chat"]')?.click()}>
              Chat with Noor ✦
            </button>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', label: 'Free Shipping', sub: 'Orders above PKR 5,000' },
            { icon: '🔒', label: 'Secure Payment', sub: 'Stripe-powered checkout' },
            { icon: '↩️', label: 'Easy Returns', sub: '7-day return policy' },
            { icon: '✦',  label: 'AI Stylist', sub: 'Personalized recommendations' },
          ].map(b => (
            <div key={b.label}>
              <div className="text-2xl mb-2">{b.icon}</div>
              <p className="font-serif text-sm font-semibold text-rose-dark mb-1">{b.label}</p>
              <p className="text-xs text-mink-light">{b.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
