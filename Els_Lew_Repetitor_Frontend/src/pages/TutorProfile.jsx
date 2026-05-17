import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { fmtDate } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import StarRating from '../components/StarRating'

export default function TutorProfile() {
  const { id } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [tutor, setTutor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [slots, setSlots] = useState([])
  const [subjects, setSubjects] = useState([])
  const [bookingSlot, setBookingSlot] = useState(null)
  const [bookSubject, setBookSubject] = useState('')
  const [showReview, setShowReview] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')

  useEffect(() => {
    Promise.all([
      api.tutors.getById(id),
      api.reviews.getByTutor(id),
      api.tutors.getSlots(id),
      api.subjects.getAll()
    ]).then(([t, r, s, sub]) => { setTutor(t); setReviews(r); setSlots(s); setSubjects(sub) })
      .catch(() => nav('/tutors'))
  }, [id])

  const book = async () => {
    if (!user) { nav('/login'); return }
    try {
      await api.bookings.create({ slotId: bookingSlot.id, subjectId: bookSubject ? +bookSubject : null })
      toast('Вы записаны на урок!')
      setBookingSlot(null)
      const s = await api.tutors.getSlots(id)
      setSlots(s)
    } catch (err) { toast(err.message, 'error') }
  }

  const submitReview = async () => {
    if (!reviewRating) { toast('Выберите оценку', 'error'); return }
    try {
      await api.reviews.add({ tutorProfileId: +id, rating: reviewRating, comment: reviewComment })
      toast('Отзыв отправлен!')
      setShowReview(false)
      setReviewRating(0)
      setReviewComment('')
      const r = await api.reviews.getByTutor(id)
      setReviews(r)
    } catch (err) { toast(err.message, 'error') }
  }

  if (!tutor) return <div className="min-h-screen bg-[#FFF9F0] pt-24 flex items-center justify-center text-gray-400">Загрузка...</div>

  const freeSlots = slots.filter(s => s.status === 'FREE')

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => nav(-1)} className="text-orange-500 text-sm font-medium hover:underline mb-6 inline-block">← Назад</button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="card text-center">
              <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 overflow-hidden">
                {tutor.photoUrl ? <img src={tutor.photoUrl} alt="" className="w-full h-full object-cover"/> : tutor.firstName?.[0]}
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900">{tutor.firstName} {tutor.lastName}</h1>
              <p className="text-gray-400 text-sm mb-2">@{tutor.username}</p>
              <div className="flex justify-center items-center gap-1 mb-3">
                <StarRating rating={tutor.rating} size="lg"/>
                <span className="font-semibold text-gray-700 ml-1">{tutor.rating?.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({tutor.totalReviews})</span>
              </div>
              {tutor.pricePerHour
                ? <div className="text-2xl font-extrabold gradient-text">{tutor.pricePerHour} ₽/час</div>
                : <div className="text-gray-400">По договорённости</div>}
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-800 mb-3">Статистика</h3>
              <div className="space-y-2 text-sm">
                {[['Уроков', tutor.totalLessons], ['Отзывов', tutor.totalReviews], ['Город', tutor.cityName || '—']].map(([l, v]) => (
                  <div key={l} className="flex justify-between"><span className="text-gray-400">{l}</span><b>{v}</b></div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-800 mb-3">Предметы</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects?.map(s => <span key={s} className="badge bg-blue-50 text-blue-600">{s}</span>)}
              </div>
            </div>

            {(tutor.telegramContact || tutor.phoneContact || tutor.vkContact) && (
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-3">Контакты</h3>
                <div className="space-y-2 text-sm">
                  {tutor.telegramContact && <a href={`https://t.me/${tutor.telegramContact.replace('@','')}`} target="_blank" rel="noreferrer" className="flex gap-2 text-blue-500 hover:underline">📱 {tutor.telegramContact}</a>}
                  {tutor.phoneContact && <span className="flex gap-2 text-gray-700">📞 {tutor.phoneContact}</span>}
                  {tutor.vkContact && <a href={tutor.vkContact} target="_blank" rel="noreferrer" className="flex gap-2 text-blue-700 hover:underline">💬 ВКонтакте</a>}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 space-y-5">
            {tutor.bio && (
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-2">О репетиторе</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tutor.bio}</p>
              </div>
            )}

            {/* SLOTS */}
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4">Доступные слоты</h3>
              {!freeSlots.length
                ? <p className="text-gray-400 text-sm">Свободных слотов нет</p>
                : <div className="grid sm:grid-cols-2 gap-3">
                    {freeSlots.map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                        <div className="text-sm">
                          <div className="font-semibold text-green-800">{fmtDate(s.startTime)}</div>
                          <div className="text-xs text-green-600">до {fmtDate(s.endTime)}</div>
                          {s.price && <div className="text-xs font-bold mt-0.5">{s.price} ₽</div>}
                        </div>
                        {user?.role === 'STUDENT' && (
                          <button onClick={() => setBookingSlot(s)} className="btn-primary text-xs px-3 py-1.5 ml-2">Записаться</button>
                        )}
                        {!user && (
                          <button onClick={() => nav('/login')} className="text-xs text-orange-500 underline ml-2">Войти</button>
                        )}
                      </div>
                    ))}
                  </div>}
            </div>

            {/* REVIEWS */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Отзывы</h3>
                {user?.role === 'STUDENT' && (
                  <button onClick={() => setShowReview(!showReview)} className="btn-outline text-sm py-1.5 px-4">Оставить отзыв</button>
                )}
              </div>
              {showReview && (
                <div className="bg-orange-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ваша оценка:</p>
                  <div className="flex gap-2 mb-3">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} onClick={() => setReviewRating(i)}
                        className={`text-3xl transition ${i <= reviewRating ? 'text-yellow-400' : 'text-gray-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea className="input mb-3" rows={3} placeholder="Ваш отзыв..."
                    value={reviewComment} onChange={e => setReviewComment(e.target.value)}/>
                  <button onClick={submitReview} className="btn-primary">Отправить</button>
                </div>
              )}
              {!reviews.length
                ? <p className="text-gray-400 text-sm">Отзывов пока нет</p>
                : reviews.map(r => (
                  <div key={r.id} className="border-b border-orange-50 pb-4 mb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-gray-800">{r.studentFirstName} {r.studentLastName}</span>
                      <StarRating rating={r.rating}/>
                      <span className="text-orange-500 font-bold text-sm">{r.rating?.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs ml-auto">{new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                    {r.comment && <p className="text-gray-600 text-sm">{r.comment}</p>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {bookingSlot && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Записаться на урок</h2>
            <div className="bg-orange-50 rounded-xl p-3 text-sm text-gray-700 mb-4">
              {fmtDate(bookingSlot.startTime)} — {fmtDate(bookingSlot.endTime)}
            </div>
            <select className="input mb-4" value={bookSubject} onChange={e => setBookSubject(e.target.value)}>
              <option value="">Без предмета</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={book} className="btn-primary flex-1">Записаться</button>
              <button onClick={() => setBookingSlot(null)} className="btn-outline flex-1">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
