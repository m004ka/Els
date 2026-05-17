import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ firstName:'', lastName:'', username:'', email:'', password:'', role:'STUDENT', cityId:'' })
  const [cities, setCities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    if (params.get('role') === 'TUTOR') setForm(f => ({...f, role: 'TUTOR'}))
    api.cities.getAll().then(setCities).catch(() => {})
  }, [])

  const f = k => e => setForm({...form, [k]: e.target.value})

  const submit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.auth.register({...form, cityId: form.cityId ? +form.cityId : null})
      login(data)
      nav(data.role === 'TUTOR' ? '/cabinet/tutor' : '/cabinet/student')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-lg">
        <div className="card shadow-xl">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Создать аккаунт</h1>
          <p className="text-gray-400 text-sm mb-5">Присоединяйтесь к RepEdu</p>

          <div className="flex gap-3 mb-5">
            {['STUDENT','TUTOR'].map(r => (
              <button key={r} type="button" onClick={() => setForm({...form, role: r})}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition ${form.role === r ? 'border-orange-400 gradient-bg text-white' : 'border-orange-200 text-gray-500 hover:border-orange-300'}`}>
                {r === 'STUDENT' ? '🎓 Я ученик' : '👨‍🏫 Я репетитор'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Имя</label>
                <input required className="input" placeholder="Иван" value={form.firstName} onChange={f('firstName')}/></div>
              <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Фамилия</label>
                <input required className="input" placeholder="Иванов" value={form.lastName} onChange={f('lastName')}/></div>
            </div>
            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Имя пользователя</label>
              <input required className="input" placeholder="ivan_ivanov" value={form.username} onChange={f('username')}/></div>
            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
              <input type="email" required className="input" placeholder="you@example.com" value={form.email} onChange={f('email')}/></div>
            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Пароль</label>
              <input type="password" required minLength={6} className="input" placeholder="Минимум 6 символов" value={form.password} onChange={f('password')}/></div>
            <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Город</label>
              <select className="input" value={form.cityId} onChange={f('cityId')}>
                <option value="">Выберите город</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Уже есть аккаунт? <Link to="/login" className="text-orange-500 font-semibold hover:underline">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
