import { useEffect, useState } from 'react'
import admin from '../../api/admin'
import api from '../../api'
import { useToast } from '../../context/ToastContext'

export default function AdminCatalog() {
  const [cities, setCities] = useState([])
  const [subjects, setSubjects] = useState([])
  const [newCity, setNewCity] = useState('')
  const [newSubject, setNewSubject] = useState({ name: '', category: 'ОГЭ/ЕГЭ' })
  const toast = useToast()

  const loadCities = () => api.cities.getAll().then(setCities)
  const loadSubjects = () => api.subjects.getAll().then(setSubjects)

  useEffect(() => { loadCities(); loadSubjects() }, [])

  const addCity = async () => {
    if (!newCity.trim()) return
    try { await admin.createCity(newCity.trim()); setNewCity(''); loadCities(); toast('Город добавлен') }
    catch (e) { toast(e.message, 'error') }
  }

  const deleteCity = async id => {
    if (!confirm('Удалить город?')) return
    try { await admin.deleteCity(id); loadCities(); toast('Удалён') }
    catch (e) { toast(e.message, 'error') }
  }

  const addSubject = async () => {
    if (!newSubject.name.trim()) return
    try { await admin.createSubject(newSubject.name.trim(), newSubject.category); setNewSubject({ name: '', category: 'ОГЭ/ЕГЭ' }); loadSubjects(); toast('Предмет добавлен') }
    catch (e) { toast(e.message, 'error') }
  }

  const deleteSubject = async id => {
    if (!confirm('Удалить предмет?')) return
    try { await admin.deleteSubject(id); loadSubjects(); toast('Удалён') }
    catch (e) { toast(e.message, 'error') }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-white mb-8">Справочник</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CITIES */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Города <span className="text-gray-600 font-normal text-sm">({cities.length})</span></h2>

          <div className="flex gap-2 mb-4">
            <input placeholder="Название города" value={newCity} onChange={e => setNewCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCity()}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500"/>
            <button onClick={addCity} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition">+</button>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {cities.map((c, i) => (
              <div key={c.id} className={`flex items-center justify-between px-5 py-3 ${i < cities.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-800/30 transition`}>
                <div>
                  <span className="text-gray-200 font-medium">{c.name}</span>
                  <span className="text-gray-600 text-xs ml-2">{c.tutorCount} репетиторов</span>
                </div>
                <button onClick={() => deleteCity(c.id)} className="text-xs text-red-400 hover:text-red-300 transition">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* SUBJECTS */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Предметы <span className="text-gray-600 font-normal text-sm">({subjects.length})</span></h2>

          <div className="flex gap-2 mb-4">
            <input placeholder="Название предмета" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && addSubject()}
              className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-orange-500"/>
            <select value={newSubject.category} onChange={e => setNewSubject({ ...newSubject, category: e.target.value })}
              className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-orange-500">
              <option>ОГЭ/ЕГЭ</option>
              <option>ОГЭ</option>
              <option>ЕГЭ</option>
            </select>
            <button onClick={addSubject} className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition">+</button>
          </div>

          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {subjects.map((s, i) => (
              <div key={s.id} className={`flex items-center justify-between px-5 py-3 ${i < subjects.length - 1 ? 'border-b border-gray-800' : ''} hover:bg-gray-800/30 transition`}>
                <div>
                  <span className="text-gray-200 font-medium">{s.name}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-400">{s.category}</span>
                  <span className="text-gray-600 text-xs ml-2">{s.tutorCount} репетиторов</span>
                </div>
                <button onClick={() => deleteSubject(s.id)} className="text-xs text-red-400 hover:text-red-300 transition">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
