import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

const OCCASIONS = [
  'Eid-ul-Fitr celebration', 'Eid-ul-Adha gathering', 'Wedding guest',
  'Nikkah ceremony', 'Office / work', 'Casual day out', 'Family dinner',
  'University / college', 'Travel', 'Graduation ceremony',
]
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter']
const COLOR_OPTIONS = ['Black', 'White', 'Navy', 'Beige', 'Cream', 'Dusty Rose', 'Sage Green', 'Burgundy', 'Gold', 'Grey']

// ── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({ plan, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const { occasion, budget, season, plan: p, createdAt } = plan

  return (
    <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 cursor-pointer hover:bg-cream/30 transition-colors"
           onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs bg-rose text-white px-2.5 py-0.5 rounded-sm capitalize">{occasion}</span>
            {season && <span className="text-xs bg-cream-dark text-mink px-2.5 py-0.5 rounded-sm">{season}</span>}
          </div>
          <p className="font-sans font-semibold text-sm text-mink mt-1">
            Budget: PKR {budget.toLocaleString()} · Est: PKR {p?.totalEstimate?.toLocaleString() || '—'}
          </p>
          <p className="text-xs text-mink-light mt-0.5">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <button onClick={e => { e.stopPropagation(); onDelete(plan._id) }}
            className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
          <span className="text-mink-light text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-6">
          {/* Summary */}
          <div className="bg-cream-dark rounded-sm p-4">
            <p className="text-xs tracking-widest uppercase text-mink mb-2">Agent Strategy</p>
            <p className="text-sm text-mink leading-relaxed">{p?.summary}</p>
          </div>

          {/* Outfit options */}
          {p?.outfits?.map((outfit, oi) => (
            <div key={oi}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-rose text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                  {oi + 1}
                </div>
                <h3 className="font-serif text-base font-semibold text-rose-dark">{outfit.label}</h3>
              </div>
              <p className="text-sm text-mink-light mb-3 ml-9 leading-relaxed">{outfit.description}</p>

              <div className="ml-9 space-y-3">
                {outfit.items?.map((item, ii) => (
                  <div key={ii} className="flex items-start gap-3 border border-gray-100 rounded-sm p-3">
                    <div className="w-8 h-8 bg-cream-dark rounded-sm flex items-center justify-center text-xs font-bold text-rose flex-shrink-0">
                      {item.role?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-gold font-semibold tracking-wide uppercase">{item.role}</p>
                          <p className="font-sans text-sm font-semibold text-mink leading-tight">{item.productName}</p>
                        </div>
                        <span className="font-semibold text-sm text-mink flex-shrink-0">
                          PKR {item.price?.toLocaleString() || '—'}
                        </span>
                      </div>
                      <p className="text-xs text-mink-light mt-1 leading-relaxed italic">"{item.stylingNote}"</p>
                      {item.productId && (
                        <Link to={`/products/${item.productId}`}
                          className="text-xs text-rose hover:underline mt-1 inline-block font-semibold">
                          View Product →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Styling tips */}
          {p?.stylingTips?.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-mink mb-3">Styling Tips</p>
              <ul className="space-y-2">
                {p.stylingTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-mink">
                    <span className="text-gold mt-0.5 flex-shrink-0">✦</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Budget advice */}
          {p?.budgetAdvice && (
            <div className="bg-gold/10 border border-gold/20 rounded-sm p-4">
              <p className="text-xs tracking-widest uppercase text-gold mb-1">Budget Advice</p>
              <p className="text-sm text-mink">{p.budgetAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FashionAgentPage() {
  const { user }                    = useAuth()
  const navigate                    = useNavigate()
  const [plans, setPlans]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [planning, setPlanning]     = useState(false)
  const [error, setError]           = useState('')
  const [form, setForm]             = useState({
    occasion: '', customOccasion: '', budget: '',
    season: '', colors: [],
  })

  useEffect(() => { if (!user) navigate('/') }, [user])

  const loadPlans = () => {
    api.get('/fashion-agent/plans')
      .then(res => setPlans(res.data.plans))
      .finally(() => setLoading(false))
  }
  useEffect(loadPlans, [])

  const toggleColor = (c) =>
    setForm(f => ({
      ...f,
      colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c]
    }))

  const submit = async (e) => {
    e.preventDefault()
    const occ = form.occasion === 'custom' ? form.customOccasion : form.occasion
    if (!occ || !form.budget) { setError('Please fill in occasion and budget.'); return }
    if (Number(form.budget) < 500) { setError('Minimum budget is PKR 500.'); return }

    setError(''); setPlanning(true)
    try {
      await api.post('/fashion-agent/plan', {
        occasion:    occ,
        budget:      Number(form.budget),
        season:      form.season,
        preferences: { colors: form.colors },
      })
      setForm({ occasion: '', customOccasion: '', budget: '', season: '', colors: [] })
      loadPlans()
    } catch (err) {
      setError(err.response?.data?.message || 'Agent failed. Please try again.')
    } finally {
      setPlanning(false)
    }
  }

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return
    await api.delete(`/fashion-agent/plans/${id}`)
    setPlans(prev => prev.filter(p => p._id !== id))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero header */}
      <div className="bg-rose text-white rounded-sm p-8 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative">
          <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">Goal-Oriented AI</p>
          <h1 className="font-serif text-3xl font-bold mb-2">Fashion Planner Agent</h1>
          <p className="text-white/70 text-sm max-w-lg leading-relaxed">
            Tell me your occasion and budget. I'll scan our entire catalog and build you a complete, personalized outfit plan — with multiple options, styling notes, and budget advice.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-gray-100 rounded-sm p-7 mb-10">
        <h2 className="font-serif text-xl text-rose-dark font-semibold mb-5">Plan a New Outfit</h2>
        <form onSubmit={submit} className="space-y-5">
          {/* Occasion */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-mink mb-2">Occasion *</label>
            <select value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}
              className="input-field mb-2">
              <option value="">Select an occasion...</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              <option value="custom">Other (type below)</option>
            </select>
            {form.occasion === 'custom' && (
              <input value={form.customOccasion}
                onChange={e => setForm(f => ({ ...f, customOccasion: e.target.value }))}
                className="input-field" placeholder="Describe your occasion..." />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Budget */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-mink mb-2">Total Budget (PKR) *</label>
              <input type="number" min="500" value={form.budget}
                onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                className="input-field" placeholder="e.g. 8000" />
            </div>
            {/* Season */}
            <div>
              <label className="block text-xs tracking-widest uppercase text-mink mb-2">Season</label>
              <select value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))}
                className="input-field">
                <option value="">Any / current</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Color preferences */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-mink mb-2">
              Preferred Colors <span className="text-mink-light normal-case">(optional, select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button type="button" key={c} onClick={() => toggleColor(c)}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition-colors
                    ${form.colors.includes(c) ? 'bg-rose text-white border-rose' : 'border-gray-200 text-mink hover:border-rose'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-rose text-sm">{error}</p>}

          <button type="submit" disabled={planning}
            className="btn-primary w-full py-3.5 text-sm tracking-widest disabled:opacity-50 flex items-center justify-center gap-2">
            {planning ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Agent is planning your outfit...
              </>
            ) : '✦ Generate Outfit Plan'}
          </button>
          {planning && (
            <p className="text-xs text-center text-mink-light -mt-2">
              Scanning catalog and crafting your personalized plan — this takes about 10 seconds
            </p>
          )}
        </form>
      </div>

      {/* Saved plans */}
      <div>
        <h2 className="font-serif text-xl text-rose-dark font-semibold mb-5">
          Your Saved Plans {plans.length > 0 && <span className="text-mink-light font-normal text-base">({plans.length})</span>}
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array(2).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-sm animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-14 bg-cream-dark rounded-sm">
            <p className="text-3xl mb-3">👗</p>
            <p className="font-serif text-lg text-mink-light">No plans yet</p>
            <p className="text-sm text-mink-light mt-1">Fill in the form above to create your first AI outfit plan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => <PlanCard key={plan._id} plan={plan} onDelete={deletePlan} />)}
          </div>
        )}
      </div>
    </div>
  )
}
