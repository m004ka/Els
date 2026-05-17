import { useEffect, useState } from 'react'
import admin from '../../api/admin'
import { useToast } from '../../context/ToastContext'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [search, setSearch] = useState('')
  const toast = useToast()

  useEffect(() => { admin.reviews().then(setReviews).catch(() => {}) }, [])

  const deleteReview = async id => {
    if (!confirm('Удалить отзыв?')) return
    try { await admin.deleteReview(id); setReviews(r => r.filter(x => x.id !== id)); toast('Отзыв удалён') }
    catch (e) { toast(e.message, 'error') }
  }

  const filtered = reviews.filter(r => {
    const q = search.toLowerCase()
    return !q || `${r.studentFirstName} ${r.studentLastName} ${r.comment || ''}`.toLowerCase().includes(q)
  })

  const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Отзывы <span className="text-gray-600 font-normal text-lg">({reviews.length})</span></h1>
      </div>

      <input placeholder="Поиск по студенту или тексту..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500 mb-5"/>

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-gray-200">{r.studentFirstName} {r.studentLastName}</span>
                <span className="text-yellow-400 text-sm">{stars(r.rating)}</span>
                <span className="text-orange-400 font-bold">{r.rating?.toFixed(1)}</span>
                <span className="text-gray-600 text-xs ml-auto">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('ru-RU') : '—'}</span>
              </div>
              {r.comment && <p className="text-gray-400 text-sm leading-relaxed">{r.comment}</p>}
            </div>
            <button onClick={() => deleteReview(r.id)} className="text-xs text-red-400 hover:text-red-300 transition flex-shrink-0">Удалить</button>
          </div>
        ))}
        {!filtered.length && <div className="text-center text-gray-600 py-10">Ничего не найдено</div>}
      </div>
    </div>
  )
}
