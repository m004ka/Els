import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api, { declension } from '../api'

const ICONS = { 'Математика':'📐','Русский язык':'📝','Физика':'⚡','Химия':'🧪','Биология':'🧬','История':'📜','Обществознание':'🏛️','География':'🌍','Информатика и ИКТ':'💻','Английский язык':'🇬🇧','Немецкий язык':'🇩🇪','Французский язык':'🇫🇷','Испанский язык':'🇪🇸','Китайский язык':'🇨🇳','Литература':'📖','Астрономия':'🔭' }

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [params] = useSearchParams()
  const nav = useNavigate()
  const cityId = params.get('cityId')
  const cityName = params.get('cityName') || 'Предметы'

  useEffect(() => {
    const load = cityId ? api.subjects.getByCity(cityId) : api.subjects.getAll()
    load.then(setSubjects).catch(() => {})
  }, [cityId])

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/cities" className="text-orange-500 text-sm font-medium hover:underline mb-4 inline-block">← Все города</Link>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{cityName}</h1>
        <p className="text-gray-400 mb-10">Выберите предмет</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map(s => (
            <div key={s.id} onClick={() => nav(`/tutors?${cityId ? `cityId=${cityId}&` : ''}subjectId=${s.id}`)}
              className="bg-white rounded-2xl p-5 border border-orange-100 cursor-pointer hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg transition-all duration-200">
              <div className="text-3xl mb-2">{ICONS[s.name] || '📚'}</div>
              <div className="font-bold text-gray-800">{s.name}</div>
              <div className="text-xs text-orange-400 mt-1">{s.category}</div>
              <div className="text-xs text-gray-400 mt-1">{s.tutorCount} репетитор{declension(s.tutorCount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
