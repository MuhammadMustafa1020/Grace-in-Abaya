import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { id }                      = useParams()
  const { user }                    = useAuth()
  const { addItem }                 = useCart()
  const [product, setProduct]       = useState(null)
  const [loading, setLoading]       = useState(true)
  const [selectedSize, setSize]     = useState('')
  const [selectedColor, setColor]   = useState('')
  const [qty, setQty]               = useState(1)
  const [activeImage, setImage]     = useState(0)
  const [review, setReview]         = useState({ rating: 5, comment: '' })
  const [reviewMsg, setReviewMsg]   = useState('')

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => { setProduct(res.data.product); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const submitReview = async () => {
    try {
      await api.post(`/products/${id}/reviews`, review)
      setReviewMsg('Review submitted! Thank you.')
      const res = await api.get(`/products/${id}`)
      setProduct(res.data.product)
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Could not submit review.')
    }
  }

  if (loading) return <div className="text-center py-32 font-serif text-mink-light text-xl animate-pulse">Loading...</div>
  if (!product) return <div className="text-center py-32"><p className="font-serif text-xl">Product not found.</p><Link to="/products" className="text-rose underline text-sm mt-3 block">Back to shop</Link></div>

  const { name, description, price, images, category, sizes, colors, stock, rating, numReviews, reviews } = product

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/products" className="text-sm text-mink-light hover:text-rose transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-4">
        {/* Images */}
        <div>
          <div className="aspect-[3/4] bg-cream-dark rounded-sm overflow-hidden mb-3">
            <img src={images?.[activeImage] || 'https://placehold.co/500x667/F0EBE3/8B3252?text=Grace+in+Abaya'}
              alt={name} className="w-full h-full object-cover" />
          </div>
          {images?.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setImage(i)}
                  className={`w-16 h-20 rounded-sm overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-rose' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="text-xs tracking-widest text-gold uppercase mb-2">{category}</p>
            <h1 className="font-serif text-3xl text-rose-dark font-semibold mb-3">{name}</h1>
            <div className="flex items-center gap-3 mb-4">
              {numReviews > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-gold">{'★'.repeat(Math.round(rating))}</span>
                  <span className="text-mink-light">({numReviews} reviews)</span>
                </div>
              )}
              <span className={`text-xs font-semibold ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
              </span>
            </div>
            <p className="font-sans text-2xl font-bold text-mink">PKR {price.toLocaleString()}</p>
          </div>

          <p className="text-sm text-mink leading-relaxed">{description}</p>

          {/* Size selection */}
          {sizes?.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-mink mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-4 py-1.5 text-sm border rounded-sm transition-colors
                      ${selectedSize === s ? 'bg-rose text-white border-rose' : 'border-gray-200 text-mink hover:border-rose'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selection */}
          {colors?.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase text-mink mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-4 py-1.5 text-sm border rounded-sm transition-colors
                      ${selectedColor === c ? 'bg-rose text-white border-rose' : 'border-gray-200 text-mink hover:border-rose'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="text-xs tracking-widest uppercase text-mink mb-2">Quantity</p>
            <div className="inline-flex items-center border border-gray-200 rounded-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-mink hover:text-rose">−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(Math.min(stock, qty + 1))} className="w-10 h-10 text-mink hover:text-rose">+</button>
            </div>
          </div>

          <button disabled={stock === 0}
            onClick={() => addItem(product, selectedSize, selectedColor, qty)}
            className="btn-primary w-full py-3.5 text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed">
            {stock === 0 ? 'OUT OF STOCK' : 'ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="font-serif text-2xl text-rose-dark mb-8">Customer Reviews</h2>

        {user && (
          <div className="bg-cream-dark p-6 rounded-sm mb-8">
            <h3 className="font-sans text-sm font-semibold text-mink mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(r => (
                <button key={r} onClick={() => setReview(rv => ({ ...rv, rating: r }))}
                  className={`text-xl ${r <= review.rating ? 'text-gold' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <textarea value={review.comment} onChange={e => setReview(rv => ({ ...rv, comment: e.target.value }))}
              className="input-field" rows={3} placeholder="Share your experience..." />
            {reviewMsg && <p className="text-sm text-rose mt-2">{reviewMsg}</p>}
            <button onClick={submitReview} className="btn-primary mt-3 text-xs py-2">Submit Review</button>
          </div>
        )}

        {reviews?.length === 0 ? (
          <p className="text-mink-light text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-5">
            {reviews?.map(r => (
              <div key={r._id} className="border-b border-gray-100 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-sans font-semibold text-sm text-mink">{r.name}</p>
                  <p className="text-xs text-mink-light">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-sm text-gold mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                <p className="text-sm text-mink leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
