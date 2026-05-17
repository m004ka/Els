export default function StarRating({ rating, max = 5, size = 'sm' }) {
  const stars = Math.round(rating)
  return (
    <span className={`text-${size === 'lg' ? 'xl' : 'sm'}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-200'}>★</span>
      ))}
    </span>
  )
}
