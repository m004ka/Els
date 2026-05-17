import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

const ICONS = { 'Математика':'📐','Русский язык':'📝','Физика':'⚡','Химия':'🧪','Биология':'🧬','История':'📜','Обществознание':'🏛️','География':'🌍','Информатика и ИКТ':'💻','Английский язык':'🇬🇧','Немецкий язык':'🇩🇪','Французский язык':'🇫🇷','Испанский язык':'🇪🇸','Китайский язык':'🇨🇳','Литература':'📖','Астрономия':'🔭' }

export default function Home() {
  const [subjects, setSubjects] = useState([])
  const nav = useNavigate()

  useEffect(() => { api.subjects.getAll().then(setSubjects).catch(() => {}) }, [])

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* HERO */}
      <section className="pt-36 pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold uppercase tracking-wide mb-6">Подготовка к ОГЭ и ЕГЭ</span>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
            Найди своего<br/><span className="gradient-text">идеального репетитора</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            Онлайн-расписание, отзывы, материалы и прогресс — всё в одном месте.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cities" className="btn-primary px-8 py-4 text-lg rounded-2xl">Найти репетитора →</Link>
            <Link to="/register?role=TUTOR" className="btn-outline px-8 py-4 text-lg rounded-2xl">Стать репетитором</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['32+','Репетиторов'],['15','Городов'],['16','Предметов ОГЭ/ЕГЭ'],['100+','Уроков']].map(([n,l]) => (
            <div key={l}><div className="text-4xl font-extrabold gradient-text">{n}</div><div className="text-gray-400 text-sm mt-1">{l}</div></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">Как это работает</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[['🏙️','Выбери город и предмет','Найди репетиторов по нужному предмету ОГЭ/ЕГЭ в своём городе.'],['📅','Запишись на урок','Выбери удобное время из расписания и запишись в один клик.'],['📈','Следи за прогрессом','Получай материалы, отслеживай прогресс и оставляй отзывы.']].map(([i,t,d]) => (
              <div key={t} className="card text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-3">{i}</div>
                <div className="font-bold text-gray-800 mb-2">{t}</div>
                <div className="text-sm text-gray-400">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="py-16 bg-gradient-to-br from-[#FFF3E0] to-[#FFE0E0] px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Предметы</h2>
          <p className="text-center text-gray-400 mb-8">Все предметы ОГЭ и ЕГЭ</p>
          <div className="flex flex-wrap justify-center gap-3">
            {subjects.slice(0, 12).map(s => (
              <button key={s.id} onClick={() => nav(`/tutors?subjectId=${s.id}`)}
                className="px-4 py-2 rounded-full bg-white text-gray-700 text-sm font-medium shadow-sm border border-orange-100 hover:border-orange-400 transition">
                {ICONS[s.name] || '📚'} {s.name}
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/cities" className="btn-primary px-6 py-3 rounded-xl">Найти репетиторов →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
