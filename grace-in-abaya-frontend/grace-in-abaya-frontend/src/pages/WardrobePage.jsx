import { useState, useEffect } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const CATEGORIES = ['abaya-casual','abaya-designer','abaya-handmade','abaya-fashion','hijab','accessory']

export default function WardrobePage() {
  const { user }                        = useAuth()
  const navigate                        = useNavigate()
  const [items, setItems]               = useState([])
  const [suggestion, setSuggestion]     = useState('')
  const [loading, setLoading]           = useState(true)
  const [suggesting, setSuggesting]     = useState(false)
  const [occasion, setOccasion]         = useState('')
  const [season, setSeason]             = useState('')
  const [showForm, setShowForm]         = useState(false)
  const [form, setForm]                 = useState({ name:'', category:'hijab', color:'', size:'', tags:'' })

  useEffect(() => { if (!user) navigate('/') }, [user])

  const load = () => {
    api.get('/wardrobe').then(res => setItems(res.data.items)).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const addItem = async (e) => {
    e.preventDefault()
    await api.post('/wardrobe', { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })
    setShowForm(false)
    setForm({ name:'', category:'hijab', color:'', size:'', tags:'' })
    load()
  }

  const removeItem = async (id) => {
    await api.delete(`/wardrobe/${id}`)
    setItems(prev => prev.filter(i => i._id !== id))
  }

  const getSuggestion = async () => {
    setSuggesting(true)
    setSuggestion('')
    try {
      const res = await api.post('/wardrobe/suggest', { occasion, season })
      setSuggestion(res.data.suggestion)
    } catch { setSuggestion('Could not generate suggestion. Please try again.') }
    finally { setSuggesting(false) }
  }

  if (loading) return <div className="text-center py-32 font-serif text-mink-light text-xl animate-pulse">Loading wardrobe...</div>

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest text-gold uppercase mb-1">Personal</p>
          <h1 className="font-serif text-3xl text-rose-dark font-semibold">My Wardrobe</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs">
          + Add Item
        </button>
      </div>

      {/* Add item form */}
      {showForm && (
        <form onSubmit={addItem} className="bg-cream-dark p-6 rounded-sm mb-8 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="text-xs tracking-widest uppercase text-mink block mb-1">Item Name *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              className="input-field" placeholder="Black Embroidered Abaya" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-mink block mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="input-field">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-mink block mb-1">Color</label>
            <input value={form.color} onChange={e => setForm({...form, color: e.target.value})}
              className="input-field" placeholder="Black" />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase text-mink block mb-1">Size</label>
            <input value={form.size} onChange={e => setForm({...form, size: e.target.value})}
              className="input-field" placeholder="M" />
          </div>
          <div className="col-span-2">
            <label className="text-xs tracking-widest uppercase text-mink block mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
              className="input-field" placeholder="eid, formal, summer" />
          </div>
          <div className="col-span-2 md:col-span-3 flex gap-3">
            <button type="submit" className="btn-primary text-xs py-2">Save Item</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-xs py-2">Cancel</button>
          </div>
        </form>
      )}

      {/* AI Outfit Suggestion */}
      <div className="bg-rose text-white rounded-sm p-6 mb-8">
        <h2 className="font-serif text-xl mb-1">AI Outfit Planner</h2>
        <p className="text-white/70 text-sm mb-4">Tell Noor the occasion and she'll suggest an outfit from your wardrobe.</p>
        <div className="flex gap-3 flex-wrap">
          <input value={occasion} onChange={e => setOccasion(e.target.value)}
            className="flex-1 min-w-0 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2 text-sm rounded-sm focus:outline-none focus:border-white"
            placeholder="e.g. Eid dinner, casual outing, wedding" />
          <select value={season} onChange={e => setSeason(e.target.value)}
            className="bg-white/10 border border-white/20 text-white px-4 py-2 text-sm rounded-sm focus:outline-none">
            <option value="">Any season</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="autumn">Autumn</option>
          </select>
          <button onClick={getSuggestion} disabled={suggesting || items.length === 0}
            className="btn-gold text-xs px-6 disabled:opacity-50">
            {suggesting ? 'Asking Noor...' : 'Get Suggestion ✦'}
          </button>
        </div>
        {suggestion && (
          <div className="mt-4 bg-white/10 rounded-sm p-4 text-sm text-white leading-relaxed border border-white/20">
            {suggestion}
          </div>
        )}
      </div>

      {/* Items grid */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-xl text-mink-light mb-2">Your wardrobe is empty</p>
          <p className="text-sm text-mink-light">Add your abayas, hijabs, and accessories to get AI-powered outfit ideas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="card p-4 relative group">
              <button onClick={() => removeItem(item._id)}
                className="absolute top-2 right-2 w-6 h-6 bg-white border border-gray-200 rounded-full text-mink-light
                           hover:text-rose hover:border-rose transition-colors opacity-0 group-hover:opacity-100 text-xs flex items-center justify-center">
                ×
              </button>
              <div className="w-10 h-10 bg-cream-dark rounded-full flex items-center justify-center text-rose font-serif font-bold text-lg mb-3">
                {item.name.charAt(0)}
              </div>
              <p className="font-serif text-sm font-semibold text-rose-dark mb-1 leading-tight">{item.name}</p>
              <p className="text-xs text-mink-light mb-2">{item.category} · {item.color}</p>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-cream-dark text-mink px-2 py-0.5 rounded-sm">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
