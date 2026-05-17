import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const handleLogout = () => { logout(); nav('/') }

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold gradient-text">RepEdu</Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/cities" className="hover:text-orange-500 transition">Найти репетитора</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden md:inline text-sm text-gray-600">Привет, <b>{user.firstName}</b></span>
              <Link to={user.role === 'TUTOR' ? '/cabinet/tutor' : '/cabinet/student'}
                className="btn-primary px-4 py-2 text-sm">Кабинет</Link>
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition">Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline px-4 py-2 text-sm">Войти</Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
