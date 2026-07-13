import { useState, useEffect, useCallback } from 'react'
import api from '../api/api'

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'abaya-casual', 'abaya-designer', 'abaya-handmade', 'abaya-fashion', 'hijab', 'accessory',
]
const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const STATUS_COLORS  = {
  pending:    'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50  text-blue-700  border-blue-200',
  shipped:    'bg-purple-50 text-purple-700 border-purple-200',
  delivered:  'bg-green-50 text-green-700  border-green-200',
  cancelled:  'bg-red-50   text-red-700   border-red-200',
}

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', category: 'abaya-casual',
  images: '', colors: '', sizes: '', tags: '', stock: '', isFeatured: false,
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon }) {
  return (
    <div className="bg-white border border-gray-100 rounded-sm p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-sm bg-cream-dark flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs tracking-widest uppercase text-mink-light mb-1">{label}</p>
        <p className="font-serif text-2xl font-semibold text-rose-dark">{value}</p>
        {sub && <p className="text-xs text-mink-light mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const isEdit        = !!product?._id
  const [form, setForm] = useState(
    isEdit
      ? { ...product, images: product.images?.join(', '), colors: product.colors?.join(', '),
          sizes: product.sizes?.join(', '), tags: product.tags?.join(', ') }
      : EMPTY_PRODUCT
  )
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const handle = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = {
        ...form,
        price:  Number(form.price),
        stock:  Number(form.stock),
        images: form.images.split(',').map(s => s.trim()).filter(Boolean),
        colors: form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes:  form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        tags:   form.tags.split(',').map(s => s.trim()).filter(Boolean),
      }
      if (isEdit) {
        await api.put(`/products/${product._id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      onSave()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const fields = [
    { name: 'name',        label: 'Product Name *',         type: 'text',   placeholder: 'Classic Black Abaya', span: 2 },
    { name: 'price',       label: 'Price (PKR) *',          type: 'number', placeholder: '3500' },
    { name: 'stock',       label: 'Stock Quantity *',        type: 'number', placeholder: '20' },
    { name: 'images',      label: 'Image URLs (comma-sep)', type: 'text',   placeholder: 'https://...', span: 2 },
    { name: 'colors',      label: 'Colors (comma-sep)',      type: 'text',   placeholder: 'Black, Navy' },
    { name: 'sizes',       label: 'Sizes (comma-sep)',       type: 'text',   placeholder: 'S, M, L, XL' },
    { name: 'tags',        label: 'Tags (comma-sep)',        type: 'text',   placeholder: 'eid, casual, summer', span: 2 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-sm w-full max-w-2xl p-8 shadow-2xl my-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-1">Admin</p>
            <h2 className="font-serif text-2xl text-rose-dark font-semibold">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button onClick={onClose} className="text-mink hover:text-rose transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.name} className={f.span === 2 ? 'col-span-2' : ''}>
                <label className="block text-xs tracking-widest uppercase text-mink mb-1.5">{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} onChange={handle}
                  required={f.label.includes('*')} placeholder={f.placeholder}
                  className="input-field" />
              </div>
            ))}

            {/* Category */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-mink mb-1.5">Category *</label>
              <select name="category" value={form.category} onChange={handle} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center gap-3 mt-5">
              <input id="featured" name="isFeatured" type="checkbox"
                checked={form.isFeatured} onChange={handle}
                className="w-4 h-4 accent-rose" />
              <label htmlFor="featured" className="text-sm text-mink cursor-pointer">Mark as Featured</label>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-xs tracking-widest uppercase text-mink mb-1.5">Description *</label>
              <textarea name="description" value={form.description} onChange={handle} required
                rows={3} className="input-field resize-none"
                placeholder="Describe the product — fabric, style, occasion..." />
            </div>
          </div>

          {error && <p className="text-rose text-sm mt-4">{error}</p>}

          <div className="flex gap-3 mt-6">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
            </button>
            <button type="button" onClick={onClose} className="btn-outline px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ products, orders }) {
  const totalRevenue  = orders.filter(o => o.isPaid).reduce((s, o) => s + o.totalPrice, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const lowStock      = products.filter(p => p.stock <= 5).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={products.length}    icon="🛍️" sub={`${lowStock} low stock`} />
        <StatCard label="Total Orders"   value={orders.length}      icon="📦" sub={`${pendingOrders} pending`} />
        <StatCard label="Revenue (PKR)"  value={totalRevenue.toLocaleString()} icon="💰" sub="From paid orders" />
        <StatCard label="Featured Items" value={products.filter(p => p.isFeatured).length} icon="✦" sub="On homepage" />
      </div>

      {/* Low stock warning */}
      {lowStock > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4">
          <p className="text-amber-800 font-semibold text-sm mb-2">⚠️ Low Stock Alert</p>
          <div className="space-y-1">
            {products.filter(p => p.stock <= 5).map(p => (
              <p key={p._id} className="text-amber-700 text-sm">
                <span className="font-medium">{p.name}</span> — only {p.stock} left
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div>
        <h3 className="font-serif text-lg text-rose-dark font-semibold mb-4">Recent Orders</h3>
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark">
              <tr>
                {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-mink font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 8).map(o => (
                <tr key={o._id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-mink-light">{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">{o.user?.name || '—'}</td>
                  <td className="px-4 py-3 font-semibold">PKR {o.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-sm border font-semibold capitalize ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-mink-light text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-10 text-mink-light text-sm">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Products ────────────────────────────────────────────────────────────
function ProductsTab({ products, onRefresh }) {
  const [modal, setModal]   = useState(null)   // null | 'add' | product object
  const [search, setSearch] = useState('')
  const [deleting, setDel]  = useState(null)

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return
    setDel(id)
    try {
      await api.delete(`/products/${id}`)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.')
    } finally {
      setDel(null)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..." className="input-field max-w-xs" />
        <button onClick={() => setModal('add')} className="btn-primary text-xs py-2.5">
          + Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-dark">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs tracking-widest uppercase text-mink font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p._id} className="hover:bg-cream/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://placehold.co/40x50/F0EBE3/8B3252?text=GIA'}
                        alt={p.name} className="w-10 h-12 object-cover rounded-sm bg-cream-dark flex-shrink-0" />
                      <p className="font-serif text-sm font-semibold text-rose-dark line-clamp-1 max-w-[180px]">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-cream-dark text-mink px-2.5 py-1 rounded-sm">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">PKR {p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.stock <= 5 ? 'text-red-600' : p.stock <= 15 ? 'text-amber-600' : 'text-green-600'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{p.isFeatured ? '✦' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(p)}
                        className="text-xs text-rose hover:underline font-semibold">Edit</button>
                      <span className="text-gray-200">|</span>
                      <button onClick={() => deleteProduct(p._id)}
                        disabled={deleting === p._id}
                        className="text-xs text-red-400 hover:text-red-600 hover:underline font-semibold disabled:opacity-50">
                        {deleting === p._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-mink-light text-sm">No products found</p>
          )}
        </div>
      </div>

      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); onRefresh() }}
        />
      )}
    </div>
  )
}

// ─── Tab: Orders ──────────────────────────────────────────────────────────────
function OrdersTab({ orders, onRefresh }) {
  const [updating, setUpdating] = useState(null)
  const [filter, setFilter]     = useState('')

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      onRefresh()
    } catch (err) {
      alert('Status update failed.')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter ? orders.filter(o => o.status === filter) : orders

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="text-xs tracking-widest uppercase text-mink">Filter:</span>
        {['', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-colors capitalize
              ${filter === s ? 'bg-rose text-white border-rose' : 'border-gray-200 text-mink hover:border-rose'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-center py-16 text-mink-light text-sm">No orders found</p>
        )}
        {filtered.map(order => (
          <div key={order._id} className="bg-white border border-gray-100 rounded-sm p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs text-mink-light mb-1">Order · <span className="font-mono">{order._id.slice(-10).toUpperCase()}</span></p>
                <p className="font-sans font-semibold text-sm text-mink">{order.user?.name || 'Unknown'}</p>
                <p className="text-xs text-mink-light">{order.user?.email}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="text-right">
                  <p className="font-bold text-mink text-sm">PKR {order.totalPrice.toLocaleString()}</p>
                  <p className={`text-xs font-semibold ${order.isPaid ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.isPaid ? '✓ Paid' : '⏳ Unpaid'}
                  </p>
                </div>
                {/* Status dropdown */}
                <select value={order.status}
                  onChange={e => updateStatus(order._id, e.target.value)}
                  disabled={updating === order._id}
                  className={`text-xs border rounded-sm px-2.5 py-1.5 font-semibold capitalize
                              focus:outline-none focus:ring-1 focus:ring-rose cursor-pointer
                              ${STATUS_COLORS[order.status]} disabled:opacity-50`}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s} className="bg-white text-mink capitalize">{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items */}
            <div className="flex gap-3 flex-wrap">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-cream-dark rounded-sm px-3 py-2">
                  <img src={item.image || 'https://placehold.co/32x40/F0EBE3/8B3252?text=G'}
                    alt={item.name} className="w-8 h-10 object-cover rounded-sm flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-mink line-clamp-1 max-w-[120px]">{item.name}</p>
                    <p className="text-xs text-mink-light">x{item.quantity} · PKR {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping */}
            <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-mink-light flex gap-4 flex-wrap">
              <span>📍 {order.shippingAddress?.city}, {order.shippingAddress?.country}</span>
              <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
              {order.shippingAddress?.phone && <span>📞 {order.shippingAddress.phone}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [tab, setTab]         = useState('overview')
  const [products, setProducts] = useState([])
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, oRes] = await Promise.all([
        api.get('/products?limit=200'),
        api.get('/orders'),
      ])
      setProducts(pRes.data.products)
      setOrders(oRes.data.orders)
    } catch (err) {
      console.error('Admin load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const TABS = [
    { id: 'overview',  label: 'Overview',  icon: '◈' },
    { id: 'products',  label: 'Products',  icon: '🛍️' },
    { id: 'orders',    label: 'Orders',    icon: '📦' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest text-gold uppercase mb-1">Admin Panel</p>
          <h1 className="font-serif text-3xl text-rose-dark font-semibold">Dashboard</h1>
        </div>
        <button onClick={loadData}
          className="text-sm text-mink hover:text-rose transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-8">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-3 text-sm font-sans font-semibold transition-colors relative
              ${tab === t.id
                ? 'text-rose border-b-2 border-rose -mb-px'
                : 'text-mink hover:text-rose'}`}>
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {tab === 'overview' && <OverviewTab products={products} orders={orders} />}
          {tab === 'products' && <ProductsTab products={products} onRefresh={loadData} />}
          {tab === 'orders'   && <OrdersTab   orders={orders}    onRefresh={loadData} />}
        </>
      )}
    </div>
  )
}
