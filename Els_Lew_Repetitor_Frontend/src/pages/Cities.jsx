import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { declension } from '../api'

export default function Cities() {
  const [cities, setCities] = useState([])
  const nav = useNavigate()

  useEffect(() => { api.cities.getAll().then(setCities).catch(() => {}) }, [])

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Выберите город</h1>
        <p className="text-gray-400 mb-10">Найдите репетиторов в вашем городе</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {cities.map(city => (
            <div key={city.id} onClick={() => nav(`/subjects?cityId=${city.id}&cityName=${encodeURIComponent(city.name)}`)}
              className="bg-white rounded-2xl p-6 text-center border border-orange-100 cursor-pointer hover:-translate-y-1 hover:border-orange-400 hover:shadow-lg transition-all duration-200">
              <div className="text-3xl mb-2">🏙️</div>
              <div className="font-bold text-gray-800">{city.name}</div>
              <div className="text-sm text-orange-500 mt-1">{city.tutorCount} репетитор{declension(city.tutorCount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
