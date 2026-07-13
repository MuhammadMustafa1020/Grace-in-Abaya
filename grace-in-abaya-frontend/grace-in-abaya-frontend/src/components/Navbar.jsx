import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, logout }         = useAuth()
  const { itemCount, setIsOpen } = useCart()
  const [showAuth, setShowAuth]  = useState(false)
  const [authMode, setAuthMode]  = useState('login')
  const [menuOpen, setMenuOpen]  = useState(false)

  const openAuth = (mode) => { setAuthMode(mode); setShowAuth(true) }

  const categories = [
    { label: 'Abayas',      path: '/products?category=abaya-casual' },
    { label: 'Designer',    path: '/products?category=abaya-designer' },
    { label: 'Hijabs',      path: '/products?category=hijab' },
    { label: 'Accessories', path: '/products?category=accessory' },
    { label: 'Trends ✦',    path: '/trends' },
  ]

  return (
    <>
      <div className="bg-rose text-white text-xs text-center py-2 tracking-widest font-light">
        FREE SHIPPING ON ORDERS ABOVE PKR 5,000
      </div>

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-2xl font-bold text-rose-dark tracking-wide">
            Grace <span className="text-gold font-normal italic">in</span> Abaya
          </Link>

          <nav className="hidden md:flex gap-8">
            {categories.map(c => (
              <Link key={c.label} to={c.path}
                className="text-sm font-sans text-mink hover:text-rose transition-colors tracking-wide">
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="relative text-mink hover:text-rose transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="text-sm font-sans text-mink hover:text-rose transition-colors">
                  {user.name.split(' ')[0]} ▾
                </button>
                <div className="absolute right-0 top-7 w-52 bg-white border border-gray-100 shadow-lg rounded-sm
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/outfit-planner" className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream transition-colors">
                    <span>✦</span> Outfit Planner
                  </Link>
                  <Link to="/wardrobe"       className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream transition-colors">
                    <span>👗</span> My Wardrobe
                  </Link>
                  <Link to="/orders"         className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream transition-colors">
                    <span>📦</span> My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin"        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream transition-colors border-t border-gray-100">
                      <span>⚙️</span> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-rose hover:bg-cream transition-colors border-t border-gray-100">
                    <span>→</span> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex gap-3">
                <button onClick={() => openAuth('login')} className="text-sm font-sans text-mink hover:text-rose transition-colors">Sign In</button>
                <button onClick={() => openAuth('register')} className="btn-primary text-xs py-2 px-4">Join</button>
              </div>
            )}

            <button className="md:hidden text-mink" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {categories.map(c => (
              <Link key={c.label} to={c.path} onClick={() => setMenuOpen(false)}
                className="text-sm text-mink hover:text-rose transition-colors py-1">
                {c.label}
              </Link>
            ))}
            {user && (
              <>
                <Link to="/outfit-planner" onClick={() => setMenuOpen(false)} className="text-sm text-mink hover:text-rose py-1">✦ Outfit Planner</Link>
                <Link to="/wardrobe"       onClick={() => setMenuOpen(false)} className="text-sm text-mink hover:text-rose py-1">My Wardrobe</Link>
                <Link to="/orders"         onClick={() => setMenuOpen(false)} className="text-sm text-mink hover:text-rose py-1">My Orders</Link>
              </>
            )}
            {!user && (
              <div className="flex gap-3 mt-2 border-t border-gray-100 pt-3">
                <button onClick={() => { openAuth('login'); setMenuOpen(false) }} className="btn-outline text-xs py-2">Sign In</button>
                <button onClick={() => { openAuth('register'); setMenuOpen(false) }} className="btn-primary text-xs py-2">Join</button>
              </div>
            )}
          </div>
        )}
      </header>

      {showAuth && <AuthModal mode={authMode} setMode={setAuthMode} onClose={() => setShowAuth(false)} />}
    </>
  )
}
