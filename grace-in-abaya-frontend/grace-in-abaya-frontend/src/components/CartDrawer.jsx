import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-serif text-xl text-rose-dark">Your Bag ({items.length})</h2>
          <button onClick={() => setIsOpen(false)} className="text-mink hover:text-rose transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-lg text-mink-light mb-2">Your bag is empty</p>
              <p className="text-sm text-mink-light mb-6">Add some beautiful pieces</p>
              <button onClick={() => setIsOpen(false)} className="btn-outline text-xs">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-4 pb-4 border-b border-gray-50">
                <img
                  src={item.product.images?.[0] || 'https://placehold.co/80x100/F0EBE3/8B3252?text=GIA'}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover rounded-sm bg-cream-dark flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm text-rose-dark font-semibold leading-tight line-clamp-2 mb-1">
                    {item.product.name}
                  </p>
                  {item.size  && <p className="text-xs text-mink-light">Size: {item.size}</p>}
                  {item.color && <p className="text-xs text-mink-light">Color: {item.color}</p>}
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty controls */}
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button onClick={() => updateQty(item.key, item.quantity - 1)}
                        className="w-7 h-7 text-mink hover:text-rose flex items-center justify-center text-sm">−</button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQty(item.key, item.quantity + 1)}
                        className="w-7 h-7 text-mink hover:text-rose flex items-center justify-center text-sm">+</button>
                    </div>
                    <p className="font-sans text-sm font-semibold text-mink">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => removeItem(item.key)}
                  className="text-mink-light hover:text-rose transition-colors flex-shrink-0 self-start mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between font-sans text-sm text-mink">
              <span>Subtotal</span>
              <span className="font-semibold">PKR {total.toLocaleString()}</span>
            </div>
            <p className="text-xs text-mink-light">
              {total > 5000 ? '✓ Free shipping applied' : `Add PKR ${(5000 - total).toLocaleString()} more for free shipping`}
            </p>
            <Link to="/checkout" onClick={() => setIsOpen(false)} className="btn-primary block text-center w-full">
              Proceed to Checkout
            </Link>
            <button onClick={() => setIsOpen(false)} className="w-full text-sm text-center text-mink hover:text-rose transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
