import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '', label: '📊 Дашборд', end: true },
  { to: 'users', label: '👤 Пользователи' },
  { to: 'tutors', label: '👨‍🏫 Репетиторы' },
  { to: 'bookings', label: '📅 Записи' },
  { to: 'reviews', label: '⭐ Отзывы' },
  { to: 'catalog', label: '🗂 Справочник' },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      {/* SIDEBAR */}
      <aside className="w-60 flex-shrink-0 bg-gray-900 flex flex-col border-r border-gray-800">
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="text-xl font-extrabold text-white">Rep<span className="text-orange-400">Edu</span></div>
          <div className="text-xs text-gray-500 mt-0.5">Панель администратора</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-orange-500/20 text-orange-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`
              }>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => nav('/')}
            className="w-full text-left px-4 py-2 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition">
            ← На сайт
          </button>
          <button onClick={() => { logout(); nav('/') }}
            className="w-full text-left px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition">
            Выйти
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-auto bg-gray-950">
        <Outlet/>
      </main>
    </div>
  )
}
