import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import admin from '../../api/admin'
import { useToast } from '../../context/ToastContext'

export default function AdminTutors() {
  const [tutors, setTutors] = useState([])
  const [search, setSearch] = useState('')
  const toast = useToast()
  const nav = useNavigate()

  useEffect(() => { admin.tutors().then(setTutors).catch(() => {}) }, [])

  const deleteTutor = async id => {
    if (!confirm('Удалить профиль репетитора?')) return
    try { await admin.deleteTutor(id); setTutors(t => t.filter(x => x.id !== id)); toast('Удалён') }
    catch (e) { toast(e.message, 'error') }
  }

  const filtered = tutors.filter(t => {
    const q = search.toLowerCase()
    return !q || `${t.firstName} ${t.lastName} ${t.cityName || ''} ${t.subjects?.join(' ') || ''}`.toLowerCase().includes(q)
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Репетиторы <span className="text-gray-600 font-normal text-lg">({tutors.length})</span></h1>
      </div>

      <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500 mb-5"/>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-left">
              <th className="px-5 py-3">Репетитор</th>
              <th className="px-5 py-3">Город</th>
              <th className="px-5 py-3">Предметы</th>
              <th className="px-5 py-3">Рейтинг</th>
              <th className="px-5 py-3">Уроков</th>
              <th className="px-5 py-3">Цена</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-200 cursor-pointer hover:text-orange-400 transition" onClick={() => nav(`/tutors/${t.id}`)}>
                    {t.firstName} {t.lastName}
                  </div>
                  <div className="text-xs text-gray-600">@{t.username}</div>
                </td>
                <td className="px-5 py-3 text-gray-400">{t.cityName || '—'}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.subjects?.slice(0, 2).map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-blue-500/15 text-blue-400 text-xs rounded-md">{s}</span>
                    ))}
                    {(t.subjects?.length || 0) > 2 && <span className="text-xs text-gray-600">+{t.subjects.length - 2}</span>}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-300 ml-1">{t.rating?.toFixed(1)}</span>
                  <span className="text-gray-600 ml-1">({t.totalReviews})</span>
                </td>
                <td className="px-5 py-3 text-gray-400">{t.totalLessons}</td>
                <td className="px-5 py-3 text-gray-300">{t.pricePerHour ? `${t.pricePerHour} ₽` : '—'}</td>
                <td className="px-5 py-3">
                  <button onClick={() => deleteTutor(t.id)} className="text-xs text-red-400 hover:text-red-300 transition">Удалить</button>
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={7} className="text-center text-gray-600 py-10">Ничего не найдено</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
