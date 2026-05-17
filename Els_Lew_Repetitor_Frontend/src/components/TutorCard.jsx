import { useNavigate } from 'react-router-dom'
import StarRating from './StarRating'

export default function TutorCard({ tutor }) {
  const nav = useNavigate()
  return (
    <div onClick={() => nav(`/tutors/${tutor.id}`)}
      className="card cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden">
          {tutor.photoUrl
            ? <img src={tutor.photoUrl} alt="" className="w-full h-full object-cover"/>
            : tutor.firstName?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900">{tutor.firstName} {tutor.lastName}</div>
          <div className="text-xs text-gray-400">{tutor.cityName || '—'}</div>
          <div className="flex items-center gap-1 mt-1">
            <StarRating rating={tutor.rating}/>
            <span className="text-xs text-gray-500">{tutor.rating?.toFixed(1)} ({tutor.totalReviews})</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {tutor.pricePerHour
            ? <><div className="font-extrabold gradient-text">{tutor.pricePerHour} ₽</div><div className="text-xs text-gray-400">в час</div></>
            : <div className="text-xs text-gray-400">По договорённости</div>}
        </div>
      </div>

      {tutor.subjects?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tutor.subjects.slice(0, 3).map(s => (
            <span key={s} className="badge bg-blue-50 text-blue-600">{s}</span>
          ))}
          {tutor.subjects.length > 3 && (
            <span className="badge bg-blue-50 text-blue-600">+{tutor.subjects.length - 3}</span>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
        <span>📚 {tutor.totalLessons} уроков</span>
        <span className="text-orange-500 font-semibold">Подробнее →</span>
      </div>
    </div>
  )
}
