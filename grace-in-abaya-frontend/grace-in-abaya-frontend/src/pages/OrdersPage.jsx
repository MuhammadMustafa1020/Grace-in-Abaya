import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

const STATUS_COLORS = {
  pending:    'bg-amber-50   text-amber-700',
  processing: 'bg-blue-50    text-blue-700',
  shipped:    'bg-purple-50  text-purple-700',
  delivered:  'bg-green-50   text-green-700',
  cancelled:  'bg-red-50     text-red-700',
}

export default function OrdersPage() {
  const { user }              = useAuth()
  const navigate              = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (!user) navigate('/') }, [user])

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-32 font-serif text-mink-light text-xl animate-pulse">Loading orders...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <p className="text-xs tracking-widest text-gold uppercase mb-1">Account</p>
      <h1 className="font-serif text-3xl text-rose-dark font-semibold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-xl text-mink-light mb-4">No orders yet</p>
          <button onClick={() => navigate('/products')} className="btn-primary">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
                <div>
                  <p className="text-xs text-mink-light mb-1">Order ID</p>
                  <p className="font-mono text-sm text-mink">{order._id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-sm font-semibold capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <p className="text-sm text-mink-light">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img src={item.image || 'https://placehold.co/60x75/F0EBE3/8B3252?text=GIA'}
                      alt={item.name} className="w-14 h-16 object-cover rounded-sm bg-cream-dark flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm text-rose-dark font-semibold leading-tight line-clamp-1">{item.name}</p>
                      <p className="text-xs text-mink-light mt-0.5">
                        Qty: {item.quantity} {item.size && `· Size: ${item.size}`} {item.color && `· ${item.color}`}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-mink flex-shrink-0">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                <p className="text-sm text-mink-light">
                  {order.isPaid ? '✓ Paid' : '⏳ Payment pending'}
                </p>
                <p className="font-sans font-bold text-mink">
                  Total: PKR {order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
