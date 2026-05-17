import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.auth.login(form)
      login(data)
      if (data.role === 'ADMIN') nav('/admin')
      else nav(data.role === 'TUTOR' ? '/cabinet/tutor' : '/cabinet/student')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Добро пожаловать!</h1>
          <p className="text-gray-400 text-sm mb-6">Войдите в свой аккаунт</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" required className="input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Пароль</label>
              <input type="password" required className="input" placeholder="••••••"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
            </div>
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Входим...' : 'Войти'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Нет аккаунта? <Link to="/register" className="text-orange-500 font-semibold hover:underline">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
