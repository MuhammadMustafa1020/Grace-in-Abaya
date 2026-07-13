import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal({ mode, setMode, onClose }) {
  const { login, register }   = useAuth()
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-sm w-full max-w-md p-8 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-gold tracking-widest uppercase mb-2">Welcome</p>
          <h2 className="font-serif text-2xl text-rose-dark">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-sans text-mink tracking-widest uppercase mb-1.5">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handle}
                className="input-field" placeholder="Fatima Malik" required />
            </div>
          )}
          <div>
            <label className="block text-xs font-sans text-mink tracking-widest uppercase mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handle}
              className="input-field" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="block text-xs font-sans text-mink tracking-widest uppercase mb-1.5">Password</label>
            <input name="password" type="password" value={form.password} onChange={handle}
              className="input-field" placeholder="••••••••" required />
          </div>

          {error && <p className="text-rose text-sm text-center">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-50">
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="text-center text-sm text-mink-light mt-6">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-rose font-semibold hover:underline">
            {mode === 'login' ? 'Join now' : 'Sign in'}
          </button>
        </p>

        <button onClick={onClose} className="absolute top-4 right-4 text-mink hover:text-rose transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
