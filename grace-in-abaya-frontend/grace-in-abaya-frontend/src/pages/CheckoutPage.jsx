import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CheckoutPage() {
  const { user }                    = useAuth()
  const { items, total, clearCart } = useCart()
  const navigate                    = useNavigate()
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [address, setAddress]       = useState({
    fullName: user?.name || '', address: '', city: 'Peshawar', country: 'Pakistan', phone: ''
  })

  const placeOrder = async () => {
    if (!address.fullName || !address.address || !address.phone) {
      setError('Please fill in all required fields.'); return
    }
    setError(''); setLoading(true)
    try {
      const orderItems = items.map(i => ({
        product: i.product._id, quantity: i.quantity, size: i.size, color: i.color,
      }))
      const res = await api.post('/orders', { items: orderItems, shippingAddress: address })
      // In production: use Stripe.js with res.data.clientSecret to confirm payment
      // For now, simulate payment confirmation
      await api.post(`/orders/${res.data.order._id}/confirm-payment`)
      clearCart()
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => setAddress(a => ({ ...a, [key]: val }))

  if (!user) { navigate('/'); return null }
  if (items.length === 0) { navigate('/products'); return null }

  const shipping = total > 5000 ? 0 : 200

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-xs tracking-widest text-gold uppercase mb-1">Checkout</p>
      <h1 className="font-serif text-3xl text-rose-dark font-semibold mb-8">Complete Your Order</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Shipping form */}
        <div>
          <h2 className="font-sans text-xs tracking-widest uppercase text-mink mb-4">Shipping Information</h2>
          <div className="space-y-4">
            {[
              { key: 'fullName', label: 'Full Name *', placeholder: 'Fatima Malik' },
              { key: 'address',  label: 'Street Address *', placeholder: '123 Hayatabad, Phase 4' },
              { key: 'city',     label: 'City *', placeholder: 'Peshawar' },
              { key: 'country',  label: 'Country', placeholder: 'Pakistan' },
              { key: 'phone',    label: 'Phone Number *', placeholder: '03001234567' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs tracking-widest uppercase text-mink block mb-1.5">{f.label}</label>
                <input value={address[f.key]} onChange={e => set(f.key, e.target.value)}
                  className="input-field" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-sm">
            <p className="text-xs text-blue-700 font-semibold mb-1">Payment</p>
            <p className="text-xs text-blue-600">Powered by Stripe. Your card details are entered securely on the next step.</p>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <h2 className="font-sans text-xs tracking-widest uppercase text-mink mb-4">Order Summary</h2>
          <div className="card p-5 space-y-4">
            {items.map(item => (
              <div key={item.key} className="flex gap-3">
                <img src={item.product.images?.[0] || 'https://placehold.co/60x75/F0EBE3/8B3252?text=GIA'}
                  alt={item.product.name} className="w-14 h-16 object-cover rounded-sm bg-cream-dark flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-serif text-sm text-rose-dark font-semibold line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-mink-light mt-0.5">x{item.quantity} {item.size && `· ${item.size}`}</p>
                </div>
                <p className="text-sm font-semibold text-mink flex-shrink-0">
                  PKR {(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-mink-light">
                <span>Subtotal</span><span>PKR {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-mink-light">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-mink pt-2 border-t border-gray-100">
                <span>Total</span><span>PKR {(total + shipping).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {error && <p className="text-rose text-sm mt-3">{error}</p>}

          <button onClick={placeOrder} disabled={loading}
            className="btn-primary w-full py-4 mt-5 text-sm tracking-widest disabled:opacity-50">
            {loading ? 'Placing Order...' : 'PLACE ORDER'}
          </button>
          <p className="text-xs text-center text-mink-light mt-3">
            🔒 Secured by Stripe. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  )
}
