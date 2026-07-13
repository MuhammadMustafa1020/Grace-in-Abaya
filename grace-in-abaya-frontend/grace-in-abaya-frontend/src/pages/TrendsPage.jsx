import { useState, useEffect } from 'react'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const CATEGORY_LABELS = {
  'abaya-casual':   'Casual Abaya',
  'abaya-designer': 'Designer Abaya',
  'abaya-handmade': 'Handmade Abaya',
  'abaya-fashion':  'Fashion Abaya',
  'hijab':          'Hijab',
  'accessory':      'Accessory',
}

export default function TrendsPage() {
  const { user }                    = useAuth()
  const [report, setReport]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [mining, setMining]         = useState(false)
  const [mineMsg, setMineMsg]       = useState('')

  useEffect(() => {
    api.get('/trends')
      .then(res => setReport(res.data.report))
      .finally(() => setLoading(false))
  }, [])

  const triggerMine = async () => {
    setMining(true); setMineMsg('')
    try {
      const res = await api.post('/trends/mine')
      setReport(res.data.report)
      setMineMsg(`✓ Refreshed! ${res.data.report.trends.length} trends mined for ${res.data.report.season} ${res.data.report.year}`)
    } catch (err) {
      setMineMsg('Mining failed. Check your Gemini API key.')
    } finally {
      setMining(false)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-sm" />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-widest text-gold uppercase mb-1">AI-Powered</p>
          <h1 className="font-serif text-3xl text-rose-dark font-semibold">Fashion Trends</h1>
          {report && (
            <p className="text-sm text-mink-light mt-1">
              {report.season} {report.year} · Last updated {new Date(report.generatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {user?.role === 'admin' && (
          <div className="flex flex-col items-end gap-2">
            <button onClick={triggerMine} disabled={mining} className="btn-primary text-xs py-2 disabled:opacity-50">
              {mining ? '⏳ Mining trends...' : '⚡ Mine Fresh Trends'}
            </button>
            {mineMsg && <p className="text-xs text-rose">{mineMsg}</p>}
          </div>
        )}
      </div>

      {/* No report yet */}
      {!report ? (
        <div className="text-center py-24 bg-cream-dark rounded-sm">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-serif text-xl text-mink-light mb-2">No trends mined yet</p>
          <p className="text-sm text-mink-light mb-6">
            {user?.role === 'admin'
              ? 'Click "Mine Fresh Trends" to generate the first report using AI.'
              : 'Check back soon — our AI is analysing the latest modest fashion trends.'}
          </p>
          {user?.role === 'admin' && (
            <button onClick={triggerMine} disabled={mining} className="btn-primary disabled:opacity-50">
              {mining ? 'Mining...' : 'Mine Trends Now'}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Trend grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {report.trends.map((trend, i) => (
              <div key={i}
                className="bg-white border border-gray-100 rounded-sm p-6 hover:border-rose hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  {/* Rank + emoji */}
                  <div className="flex-shrink-0 text-center">
                    <div className="text-3xl mb-1">{trend.emoji}</div>
                    <div className="text-xs font-bold text-gold">#{i + 1}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Popularity bar */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose rounded-full transition-all duration-500"
                             style={{ width: `${(trend.popularity / 10) * 100}%` }} />
                      </div>
                      <span className="text-xs text-mink-light flex-shrink-0">{trend.popularity}/10</span>
                    </div>

                    <h3 className="font-serif text-lg text-rose-dark font-semibold mb-2 leading-tight">
                      {trend.title}
                    </h3>
                    <p className="text-sm text-mink leading-relaxed mb-3">{trend.description}</p>

                    {/* Category badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {trend.categories?.map(cat => (
                        <Link key={cat} to={`/products?category=${cat}`}
                          className="text-xs bg-cream-dark text-mink px-2.5 py-1 rounded-sm hover:bg-rose hover:text-white transition-colors">
                          {CATEGORY_LABELS[cat] || cat}
                        </Link>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {trend.tags?.map(tag => (
                        <span key={tag} className="text-xs text-gold border border-gold/30 px-2 py-0.5 rounded-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 bg-rose-dark text-white rounded-sm p-8 text-center">
            <p className="font-serif text-2xl font-semibold mb-2">Shop the Trends</p>
            <p className="text-white/70 text-sm mb-5">
              Explore our collection aligned with these {report.season} {report.year} trends
            </p>
            <Link to="/products" className="btn-gold px-8">Browse Collection</Link>
          </div>
        </>
      )}
    </div>
  )
}
