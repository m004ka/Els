import { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ruLocale from '@fullcalendar/core/locales/ru'
import api, { fmtDate } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-800', CONFIRMED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800', COMPLETED:'bg-blue-100 text-blue-800' }
const STATUS_RU = { PENDING:'Ожидает', CONFIRMED:'Подтверждено', CANCELLED:'Отменено', COMPLETED:'Завершено' }

export default function TutorCabinet() {
  const { user } = useAuth()
  const toast = useToast()
  const calRef = useRef()
  const [tab, setTab] = useState('schedule')
  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [materials, setMaterials] = useState([])
  const [subjects, setSubjects] = useState([])
  const [cities, setCities] = useState([])
  const [contacts, setContacts] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('')
  const [reviews, setReviews] = useState([])

  // Slot form
  const [slotForm, setSlotForm] = useState({ startTime:'', endTime:'', price:'' })
  const [showSlot, setShowSlot] = useState(false)

  // Profile form
  const [pForm, setPForm] = useState({ bio:'', photoUrl:'', pricePerHour:'', telegramContact:'', vkContact:'', phoneContact:'', cityId:'', subjectIds:[] })

  // Material form
  const [mForm, setMForm] = useState({ title:'', description:'', fileUrl:'', subjectId:'', studentId:'' })
  const [showMat, setShowMat] = useState(false)

  useEffect(() => { loadSlots(); api.subjects.getAll().then(setSubjects); api.cities.getAll().then(setCities) }, [])

  const loadSlots = () => api.tutors.getMySlots().then(setSlots).catch(() => {})

  const calEvents = slots.map(s => ({
    id: String(s.id),
    title: s.status === 'FREE' ? `Свободно${s.price ? ` · ${s.price}₽` : ''}` : s.status === 'BOOKED' ? 'Занято' : 'Отменено',
    start: s.startTime, end: s.endTime,
    className: `fc-event-${s.status.toLowerCase()}`,
    extendedProps: { status: s.status }
  }))

  const handleEventClick = async info => {
    if (info.event.extendedProps.status === 'FREE' && confirm('Удалить этот слот?')) {
      try { await api.tutors.deleteSlot(+info.event.id); toast('Слот удалён'); loadSlots() }
      catch (e) { toast(e.message, 'error') }
    }
  }

  const addSlot = async () => {
    if (!slotForm.startTime || !slotForm.endTime) { toast('Укажите время', 'error'); return }
    try {
      await api.tutors.addSlot({ startTime: slotForm.startTime+':00', endTime: slotForm.endTime+':00', price: slotForm.price ? +slotForm.price : null })
      toast('Слот добавлен!')
      setShowSlot(false)
      setSlotForm({ startTime:'', endTime:'', price:'' })
      loadSlots()
    } catch (e) { toast(e.message, 'error') }
  }

  const selectTab = t => {
    setTab(t)
    if (t === 'bookings') api.tutors.getMyBookings().then(setBookings)
    if (t === 'profile') api.tutors.getMyProfile().then(p => {
      setProfile(p)
      setPForm({ bio:p.bio||'', photoUrl:p.photoUrl||'', pricePerHour:p.pricePerHour||'', telegramContact:p.telegramContact||'', vkContact:p.vkContact||'', phoneContact:p.phoneContact||'', cityId:'', subjectIds: subjects.filter(s=>p.subjects?.includes(s.name)).map(s=>s.id) })
    })
    if (t === 'materials') { api.materials.getTutor().then(setMaterials) }
    if (t === 'messages') api.messages.getContacts().then(setContacts)
    if (t === 'stats') {
      api.tutors.getMyProfile().then(setProfile)
      api.tutors.getMyProfile().then(p => api.reviews.getByTutor(p.id).then(setReviews))
    }
  }

  const saveProfile = async () => {
    try {
      await api.tutors.updateProfile({ ...pForm, pricePerHour: pForm.pricePerHour ? +pForm.pricePerHour : null, cityId: pForm.cityId ? +pForm.cityId : null })
      toast('Профиль сохранён!')
    } catch (e) { toast(e.message, 'error') }
  }

  const addMaterial = async () => {
    if (!mForm.title) { toast('Введите название', 'error'); return }
    try {
      await api.materials.create({ ...mForm, subjectId: mForm.subjectId ? +mForm.subjectId : null, studentId: mForm.studentId ? +mForm.studentId : null })
      toast('Материал добавлен!')
      setShowMat(false)
      api.materials.getTutor().then(setMaterials)
    } catch (e) { toast(e.message, 'error') }
  }

  const openChat = async id => {
    setActiveChat(id)
    setMessages(await api.messages.getConversation(id))
  }

  const sendMsg = async () => {
    if (!msgInput.trim() || !activeChat) return
    try { await api.messages.send({ receiverId: activeChat, content: msgInput.trim() }); setMsgInput(''); openChat(activeChat) }
    catch (e) { toast(e.message, 'error') }
  }

  const completeBooking = async id => {
    try { await api.tutors.completeBooking(id); toast('Урок завершён!'); api.tutors.getMyBookings().then(setBookings) }
    catch (e) { toast(e.message, 'error') }
  }

  const TABS = [['schedule','📅 Расписание'],['bookings','👥 Записи'],['profile','✏️ Профиль'],['materials','📚 Материалы'],['messages','💬 Сообщения'],['stats','📊 Статистика']]

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Привет, {user?.firstName}!</h1>
            <p className="text-gray-400">Кабинет репетитора</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl p-2 border border-orange-100 w-fit">
          {TABS.map(([k,l]) => (
            <button key={k} onClick={() => selectTab(k)} className={`tab-btn ${tab===k?'active':''}`}>{l}</button>
          ))}
        </div>

        {/* SCHEDULE */}
        {tab === 'schedule' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Расписание</h2>
              <button onClick={() => setShowSlot(!showSlot)} className="btn-primary text-sm px-4 py-2">+ Добавить слот</button>
            </div>
            {showSlot && (
              <div className="card mb-5 max-w-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Начало</label>
                    <input type="datetime-local" className="input" value={slotForm.startTime} onChange={e => setSlotForm({...slotForm, startTime:e.target.value})}/>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Конец</label>
                    <input type="datetime-local" className="input" value={slotForm.endTime} onChange={e => setSlotForm({...slotForm, endTime:e.target.value})}/>
                  </div>
                </div>
                <input type="number" className="input" placeholder="Цена (₽, опционально)" value={slotForm.price} onChange={e => setSlotForm({...slotForm, price:e.target.value})}/>
                <div className="flex gap-2">
                  <button onClick={addSlot} className="btn-primary">Добавить</button>
                  <button onClick={() => setShowSlot(false)} className="btn-outline">Отмена</button>
                </div>
              </div>
            )}
            <div className="card">
              <FullCalendar
                ref={calRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={ruLocale}
                headerToolbar={{ left:'prev,next today', center:'title', right:'dayGridMonth,timeGridWeek,timeGridDay' }}
                height={580}
                events={calEvents}
                eventClick={handleEventClick}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">🟢 Свободно · 🟡 Занято · 🔴 Отменено · Кликните на свободный слот чтобы удалить</p>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Записи учеников</h2>
            {!bookings.length
              ? <div className="card text-center text-gray-400 py-12">Нет записей</div>
              : bookings.map(b => (
                <div key={b.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-gray-900">{b.studentFirstName} {b.studentLastName}</div>
                    <div className="text-sm text-gray-500">{b.subjectName || 'Без предмета'} · {fmtDate(b.slotStart)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${STATUS_COLOR[b.status]}`}>{STATUS_RU[b.status]}</span>
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => completeBooking(b.id)} className="btn-primary text-xs px-3 py-1.5">Завершить</button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* PROFILE */}
        {tab === 'profile' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-5">Мой профиль</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card space-y-4">
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">О себе</label>
                  <textarea className="input" rows={4} value={pForm.bio} onChange={e => setPForm({...pForm, bio:e.target.value})}/></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Фото (URL)</label>
                  <input className="input" type="url" placeholder="https://..." value={pForm.photoUrl} onChange={e => setPForm({...pForm, photoUrl:e.target.value})}/></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Цена ₽/час</label>
                  <input className="input" type="number" value={pForm.pricePerHour} onChange={e => setPForm({...pForm, pricePerHour:e.target.value})}/></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Город</label>
                  <select className="input" value={pForm.cityId} onChange={e => setPForm({...pForm, cityId:e.target.value})}>
                    <option value="">Не выбран</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select></div>
              </div>
              <div className="card space-y-4">
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Telegram</label>
                  <input className="input" placeholder="@username" value={pForm.telegramContact} onChange={e => setPForm({...pForm, telegramContact:e.target.value})}/></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">ВКонтакте</label>
                  <input className="input" type="url" placeholder="https://vk.com/..." value={pForm.vkContact} onChange={e => setPForm({...pForm, vkContact:e.target.value})}/></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Телефон</label>
                  <input className="input" type="tel" placeholder="+7..." value={pForm.phoneContact} onChange={e => setPForm({...pForm, phoneContact:e.target.value})}/></div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Предметы</label>
                  <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                    {subjects.map(s => (
                      <label key={s.id} className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <input type="checkbox" className="accent-orange-500"
                          checked={pForm.subjectIds.includes(s.id)}
                          onChange={e => setPForm({...pForm, subjectIds: e.target.checked ? [...pForm.subjectIds, s.id] : pForm.subjectIds.filter(x=>x!==s.id)})}/>
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={saveProfile} className="btn-primary mt-5 px-8">Сохранить</button>
          </div>
        )}

        {/* MATERIALS */}
        {tab === 'materials' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Материалы</h2>
              <button onClick={() => setShowMat(!showMat)} className="btn-primary text-sm px-4 py-2">+ Добавить</button>
            </div>
            {showMat && (
              <div className="card mb-5 max-w-lg space-y-3">
                <input className="input" placeholder="Название *" value={mForm.title} onChange={e => setMForm({...mForm,title:e.target.value})}/>
                <textarea className="input" rows={2} placeholder="Описание" value={mForm.description} onChange={e => setMForm({...mForm,description:e.target.value})}/>
                <input className="input" type="url" placeholder="Ссылка на файл" value={mForm.fileUrl} onChange={e => setMForm({...mForm,fileUrl:e.target.value})}/>
                <select className="input" value={mForm.subjectId} onChange={e => setMForm({...mForm,subjectId:e.target.value})}>
                  <option value="">Без предмета</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input className="input" type="number" placeholder="ID студента (опционально)" value={mForm.studentId} onChange={e => setMForm({...mForm,studentId:e.target.value})}/>
                <div className="flex gap-2">
                  <button onClick={addMaterial} className="btn-primary">Добавить</button>
                  <button onClick={() => setShowMat(false)} className="btn-outline">Отмена</button>
                </div>
              </div>
            )}
            {!materials.length
              ? <div className="card text-center text-gray-400 py-12">Нет материалов</div>
              : <div className="grid md:grid-cols-2 gap-4">
                  {materials.map(m => (
                    <div key={m.id} className="card">
                      <div className="font-bold text-gray-900 mb-1">{m.title}</div>
                      <span className="badge bg-blue-50 text-blue-600">{m.subjectName || 'Без предмета'}</span>
                      {m.description && <p className="text-sm text-gray-500 mt-2">{m.description}</p>}
                      {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noreferrer" className="text-orange-500 text-sm underline mt-2 block">📎 Файл</a>}
                    </div>
                  ))}
                </div>}
          </div>
        )}

        {/* MESSAGES */}
        {tab === 'messages' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h2 className="font-bold text-gray-800 mb-2">Переписки</h2>
              {!contacts.length ? <p className="text-gray-400 text-sm">Нет переписок</p>
                : contacts.map(c => (
                  <button key={c.id} onClick={() => openChat(c.id)}
                    className={`w-full text-left card py-3 text-sm font-medium hover:border-orange-400 transition ${activeChat===c.id?'border-orange-400':''}`}>
                    {c.firstName} {c.lastName}
                  </button>
                ))}
            </div>
            <div className="md:col-span-2">
              {!activeChat ? <div className="card h-80 flex items-center justify-center text-gray-400">Выберите переписку</div>
                : <div className="card flex flex-col h-80">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                      {messages.map(m => (
                        <div key={m.id} className={`flex ${m.senderId===user?.id?'justify-end':'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${m.senderId===user?.id?'gradient-bg text-white':'bg-gray-100'}`}>
                            {m.content}
                            <div className="text-xs opacity-60 mt-0.5">{fmtDate(m.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className="input flex-1" placeholder="Сообщение..." value={msgInput}
                        onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMsg()}/>
                      <button onClick={sendMsg} className="btn-primary px-4">→</button>
                    </div>
                  </div>}
            </div>
          </div>
        )}

        {/* STATS */}
        {tab === 'stats' && profile && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Статистика</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[[profile.totalLessons,'Уроков'],[profile.totalReviews,'Отзывов'],[profile.rating?.toFixed(1),'Рейтинг'],[profile.pricePerHour ? profile.pricePerHour+'₽' : '—','Цена/час']].map(([v,l]) => (
                <div key={l} className="card text-center">
                  <div className="text-3xl font-extrabold gradient-text">{v}</div>
                  <div className="text-gray-400 text-sm mt-1">{l}</div>
                </div>
              ))}
            </div>
            {reviews.length > 0 && (
              <div className="card max-w-md">
                <h3 className="font-bold text-gray-800 mb-4">Распределение оценок</h3>
                {[5,4,3,2,1].map(star => {
                  const count = reviews.filter(r => Math.round(r.rating) === star).length
                  return (
                    <div key={star} className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-yellow-500 w-5">{star}★</span>
                      <div className="flex-1 h-2 rounded-full bg-orange-100 overflow-hidden">
                        <div className="h-full gradient-bg rounded-full" style={{width:`${reviews.length ? count/reviews.length*100 : 0}%`}}/>
                      </div>
                      <span className="text-sm text-gray-400 w-4">{count}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
