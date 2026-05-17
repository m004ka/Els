import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api'
import TutorCard from '../components/TutorCard'

export default function Tutors() {
  const [params] = useSearchParams()
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState([])
  const [subjects, setSubjects] = useState([])

  const [filters, setFilters] = useState({
    cityId: params.get('cityId') || '',
    subjectId: params.get('subjectId') || '',
    minPrice: '', maxPrice: '',
    minRating: 1, maxRating: 5
  })

  useEffect(() => {
    api.cities.getAll().then(setCities)
    api.subjects.getAll().then(setSubjects)
    load()
  }, [])

  const load = async (f = filters) => {
    setLoading(true)
    try {
      const p = {}
      if (f.cityId) p.cityId = f.cityId
      if (f.subjectId) p.subjectId = f.subjectId
      if (f.minPrice) p.minPrice = f.minPrice
      if (f.maxPrice) p.maxPrice = f.maxPrice
      if (+f.minRating > 1) p.minRating = f.minRating
      if (+f.maxRating < 5) p.maxRating = f.maxRating
      setTutors(await api.tutors.getAll(p))
    } finally { setLoading(false) }
  }

  const sf = k => e => setFilters(f => ({...f, [k]: e.target.value}))

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* FILTERS */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="card sticky top-24 space-y-4">
            <h2 className="font-bold text-gray-800 text-lg">Фильтры</h2>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Город</label>
              <select className="input" value={filters.cityId} onChange={sf('cityId')}>
                <option value="">Все города</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Предмет</label>
              <select className="input" value={filters.subjectId} onChange={sf('subjectId')}>
                <option value="">Все предметы</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Цена от (₽/час)</label>
              <input type="number" className="input" placeholder="0" value={filters.minPrice} onChange={sf('minPrice')}/>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Цена до (₽/час)</label>
              <input type="number" className="input" placeholder="5000" value={filters.maxPrice} onChange={sf('maxPrice')}/>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">
                Рейтинг: <span className="text-orange-500">{(+filters.minRating).toFixed(1)} – {(+filters.maxRating).toFixed(1)}</span>
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>от</span>
                  <input type="range" min="1" max="5" step="0.1" value={filters.minRating}
                    onChange={sf('minRating')} className="flex-1 accent-orange-500"/>
                  <span>{(+filters.minRating).toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>до</span>
                  <input type="range" min="1" max="5" step="0.1" value={filters.maxRating}
                    onChange={sf('maxRating')} className="flex-1 accent-orange-500"/>
                  <span>{(+filters.maxRating).toFixed(1)}</span>
                </div>
              </div>
            </div>
            <button onClick={() => load(filters)} className="btn-primary w-full">Применить</button>
            <button onClick={() => { const f={cityId:'',subjectId:'',minPrice:'',maxPrice:'',minRating:1,maxRating:5}; setFilters(f); load(f) }}
              className="btn-outline w-full">Сбросить</button>
          </div>
        </aside>

        {/* LIST */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Репетиторы</h1>
            <span className="text-gray-400 text-sm">{loading ? '...' : `Найдено: ${tutors.length}`}</span>
          </div>
          {loading
            ? <div className="text-center text-gray-400 py-16">Загрузка...</div>
            : !tutors.length
              ? <div className="text-center text-gray-400 py-16 card">Репетиторов не найдено. Попробуйте изменить фильтры.</div>
              : <div className="grid md:grid-cols-2 gap-5">{tutors.map(t => <TutorCard key={t.id} tutor={t}/>)}</div>
          }
        </main>
      </div>
    </div>
  )
}
