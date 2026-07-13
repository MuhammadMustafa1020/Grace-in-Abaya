import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/api'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { value: '',                label: 'All Products' },
  { value: 'abaya-casual',    label: 'Casual Abayas' },
  { value: 'abaya-designer',  label: 'Designer Abayas' },
  { value: 'abaya-handmade',  label: 'Handmade Abayas' },
  { value: 'abaya-fashion',   label: 'Fashion Abayas' },
  { value: 'hijab',           label: 'Hijabs' },
  { value: 'accessory',       label: 'Accessories' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]         = useState([])
  const [total, setTotal]               = useState(0)
  const [loading, setLoading]           = useState(true)
  const [page, setPage]                 = useState(1)

  const category = searchParams.get('category') || ''
  const search   = searchParams.get('search')   || ''
  const sort     = searchParams.get('sort')     || 'newest'

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 12, sort })
    if (category) params.set('category', category)
    if (search)   params.set('search', search)

    api.get(`/products?${params}`)
      .then(res => { setProducts(res.data.products); setTotal(res.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, search, sort, page])

  const set = (key, val) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    setSearchParams(p)
    setPage(1)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-rose-dark font-semibold">
            {CATEGORIES.find(c => c.value === category)?.label || 'All Products'}
          </h1>
          <p className="text-sm text-mink-light mt-1">{total} pieces found</p>
        </div>
        <select value={sort} onChange={e => set('sort', e.target.value)}
          className="border border-gray-200 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-rose">
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="font-sans text-xs tracking-widest uppercase text-mink mb-4">Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => set('category', c.value)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-sm transition-colors
                    ${category === c.value ? 'bg-rose text-white' : 'text-mink hover:bg-cream-dark'}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-3" />
                  <div className="h-3 bg-gray-200 rounded mb-2 w-2/3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-mink-light">No products found</p>
              <p className="text-sm text-mink-light mt-2">Try a different category or search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array(Math.ceil(total / 12)).fill(0).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 text-sm rounded-sm transition-colors
                    ${page === i + 1 ? 'bg-rose text-white' : 'border border-gray-200 text-mink hover:border-rose'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
