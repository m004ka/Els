import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import admin from '../../api/admin'

const PIE_COLORS = { CONFIRMED: '#22C55E', COMPLETED: '#3B82F6', PENDING: '#F59E0B', CANCELLED: '#EF4444' }
const STATUS_RU = { CONFIRMED: 'Подтверждено', COMPLETED: 'Завершено', PENDING: 'Ожидает', CANCELLED: 'Отменено' }

function KPI({ label, value, sub, color = 'text-orange-400' }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => { admin.stats().then(setStats).catch(() => {}) }, [])

  if (!stats) return <div className="p-8 text-gray-500">Загрузка...</div>

  const pieData = (stats.bookingsByStatus || [])
    .filter(d => d.count > 0)
    .map(d => ({ name: STATUS_RU[d.status] || d.status, value: Number(d.count), fill: PIE_COLORS[d.status] || '#888' }))

  const barData = (stats.tutorsByCity || []).map(d => ({ city: d.city, count: Number(d.count) }))

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-white mb-8">Дашборд</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KPI label="Пользователей" value={stats.totalUsers} color="text-orange-400"/>
        <KPI label="Студентов" value={stats.totalStudents} color="text-blue-400"/>
        <KPI label="Репетиторов" value={stats.totalTutors} color="text-purple-400"/>
        <KPI label="Записей" value={stats.totalBookings} color="text-yellow-400"/>
        <KPI label="Уроков" value={stats.completedLessons} color="text-green-400"/>
        <KPI label="Рейтинг" value={stats.avgRating?.toFixed(1) || '—'} sub={`${stats.totalReviews} отзывов`} color="text-pink-400"/>
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Репетиторы по городам</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 40, left: 0 }}>
              <XAxis dataKey="city" tick={{ fill: '#6B7280', fontSize: 11 }} angle={-35} textAnchor="end"/>
              <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false}/>
              <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 12, color: '#fff' }}/>
              <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} name="Репетиторов"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Записи по статусам</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 12, color: '#fff' }}/>
                <Legend iconType="circle" wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="h-52 flex items-center justify-center text-gray-600">Нет данных</div>}
        </div>
      </div>

      {/* RECENT TABLES */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Новые пользователи</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 text-left"><th className="pb-2">Имя</th><th className="pb-2">Роль</th><th className="pb-2">Дата</th></tr></thead>
            <tbody>
              {(stats.recentUsers || []).map(u => (
                <tr key={u.id} className="border-t border-gray-800">
                  <td className="py-2 text-gray-200">{u.firstName} {u.lastName}</td>
                  <td className="py-2"><RoleBadge role={u.role}/></td>
                  <td className="py-2 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('ru-RU') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold mb-4">Последние записи</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-gray-500 text-left"><th className="pb-2">Студент</th><th className="pb-2">Репетитор</th><th className="pb-2">Статус</th></tr></thead>
            <tbody>
              {(stats.recentBookings || []).map(b => (
                <tr key={b.id} className="border-t border-gray-800">
                  <td className="py-2 text-gray-200">{b.studentFirstName}</td>
                  <td className="py-2 text-gray-400">{b.tutorFirstName} {b.tutorLastName}</td>
                  <td className="py-2"><BookingBadge status={b.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  const map = { STUDENT: 'bg-blue-500/20 text-blue-400', TUTOR: 'bg-purple-500/20 text-purple-400', ADMIN: 'bg-orange-500/20 text-orange-400' }
  const ru = { STUDENT: 'Студент', TUTOR: 'Репетитор', ADMIN: 'Админ' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[role] || 'bg-gray-700 text-gray-400'}`}>{ru[role] || role}</span>
}

function BookingBadge({ status }) {
  const map = { CONFIRMED: 'text-green-400', COMPLETED: 'text-blue-400', PENDING: 'text-yellow-400', CANCELLED: 'text-red-400' }
  return <span className={`text-xs font-semibold ${map[status] || 'text-gray-400'}`}>{STATUS_RU[status] || status}</span>
}
