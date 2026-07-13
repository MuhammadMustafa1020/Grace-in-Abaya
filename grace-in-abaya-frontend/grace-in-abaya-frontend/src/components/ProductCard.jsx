import { Link } from 'react-router-dom'

const CATEGORY_LABELS = {
  'abaya-casual':   'Casual Abaya',
  'abaya-designer': 'Designer Abaya',
  'abaya-handmade': 'Handmade Abaya',
  'abaya-fashion':  'Fashion Abaya',
  'hijab':          'Hijab',
  'accessory':      'Accessory',
}

export default function ProductCard({ product }) {
  const { _id, name, price, images, category, rating, numReviews, isFeatured } = product

  return (
    <Link to={`/products/${_id}`} className="group block">
      <div className="card overflow-hidden">
        {/* Image */}
        <div className="relative overflow-hidden bg-cream-dark aspect-[3/4]">
          <img
            src={images?.[0] || 'https://placehold.co/400x530/F0EBE3/8B3252?text=Grace+in+Abaya'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isFeatured && (
            <span className="absolute top-3 left-3 bg-rose text-white text-xs px-2.5 py-1 tracking-widest">
              FEATURED
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gold tracking-widest uppercase mb-1">{CATEGORY_LABELS[category] || category}</p>
          <h3 className="font-serif text-base text-rose-dark font-semibold leading-tight mb-2 line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-sans font-semibold text-mink">
              PKR {price.toLocaleString()}
            </p>
            {numReviews > 0 && (
              <div className="flex items-center gap-1 text-xs text-mink-light">
                <span className="text-gold">★</span>
                <span>{rating.toFixed(1)}</span>
                <span>({numReviews})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
