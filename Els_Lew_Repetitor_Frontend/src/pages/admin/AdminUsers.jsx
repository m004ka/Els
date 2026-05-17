import { useEffect, useState } from 'react'
import admin from '../../api/admin'
import { useToast } from '../../context/ToastContext'

const ROLE_COLOR = { STUDENT: 'bg-blue-500/20 text-blue-400', TUTOR: 'bg-purple-500/20 text-purple-400', ADMIN: 'bg-orange-500/20 text-orange-400' }
const ROLE_RU = { STUDENT: 'Студент', TUTOR: 'Репетитор', ADMIN: 'Админ' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const toast = useToast()

  useEffect(() => { admin.users().then(setUsers).catch(() => {}) }, [])

  const deleteUser = async id => {
    if (!confirm('Удалить пользователя?')) return
    try { await admin.deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); toast('Удалён') }
    catch (e) { toast(e.message, 'error') }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchQ = !q || `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase().includes(q)
    const matchR = !roleFilter || u.role === roleFilter
    return matchQ && matchR
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-white">Пользователи <span className="text-gray-600 font-normal text-lg">({users.length})</span></h1>
      </div>

      <div className="flex gap-3 mb-5">
        <input placeholder="Поиск по имени, email..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500"/>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500">
          <option value="">Все роли</option>
          <option value="STUDENT">Студенты</option>
          <option value="TUTOR">Репетиторы</option>
          <option value="ADMIN">Администраторы</option>
        </select>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-left">
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Имя</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Роль</th>
              <th className="px-5 py-3">Город</th>
              <th className="px-5 py-3">Дата</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                <td className="px-5 py-3 text-gray-600">#{u.id}</td>
                <td className="px-5 py-3 text-gray-200 font-medium">{u.firstName} {u.lastName}</td>
                <td className="px-5 py-3 text-gray-400">{u.email}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLOR[u.role] || 'bg-gray-700 text-gray-400'}`}>{ROLE_RU[u.role] || u.role}</span></td>
                <td className="px-5 py-3 text-gray-400">{u.cityName || '—'}</td>
                <td className="px-5 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                <td className="px-5 py-3">
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => deleteUser(u.id)} className="text-xs text-red-400 hover:text-red-300 transition">Удалить</button>
                  )}
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
