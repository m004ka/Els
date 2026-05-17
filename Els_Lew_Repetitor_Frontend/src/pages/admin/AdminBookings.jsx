import { useEffect, useState } from 'react'
import admin from '../../api/admin'
import { fmtDate } from '../../api'

const STATUS_COLOR = { CONFIRMED: 'text-green-400', COMPLETED: 'text-blue-400', PENDING: 'text-yellow-400', CANCELLED: 'text-red-400' }
const STATUS_RU = { CONFIRMED: 'Подтверждено', COMPLETED: 'Завершено', PENDING: 'Ожидает', CANCELLED: 'Отменено' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => { admin.bookings().then(setBookings).catch(() => {}) }, [])

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase()
    const matchQ = !q || `${b.studentFirstName} ${b.studentLastName} ${b.tutorFirstName} ${b.tutorLastName} ${b.subjectName || ''}`.toLowerCase().includes(q)
    const matchS = !statusFilter || b.status === statusFilter
    return matchQ && matchS
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Записи <span className="text-gray-600 font-normal text-lg">({bookings.length})</span></h1>
      </div>

      <div className="flex gap-3 mb-5">
        <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500"/>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500">
          <option value="">Все статусы</option>
          {Object.entries(STATUS_RU).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-left">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Студент</th>
              <th className="px-5 py-3">Репетитор</th>
              <th className="px-5 py-3">Предмет</th>
              <th className="px-5 py-3">Дата урока</th>
              <th className="px-5 py-3">Статус</th>
              <th className="px-5 py-3">Создан</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="px-5 py-3 text-gray-600">#{b.id}</td>
                <td className="px-5 py-3 text-gray-200">{b.studentFirstName} {b.studentLastName}</td>
                <td className="px-5 py-3 text-gray-400">{b.tutorFirstName} {b.tutorLastName}</td>
                <td className="px-5 py-3 text-gray-500">{b.subjectName || '—'}</td>
                <td className="px-5 py-3 text-gray-400">{fmtDate(b.slotStart)}</td>
                <td className="px-5 py-3"><span className={`text-xs font-semibold ${STATUS_COLOR[b.status]}`}>{STATUS_RU[b.status]}</span></td>
                <td className="px-5 py-3 text-gray-600">{b.createdAt ? new Date(b.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={7} className="text-center text-gray-600 py-10">Ничего не найдено</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
