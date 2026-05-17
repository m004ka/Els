import { useEffect, useState } from 'react'
import api, { fmtDate } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const STATUS_COLOR = { PENDING:'bg-yellow-100 text-yellow-800', CONFIRMED:'bg-green-100 text-green-800', CANCELLED:'bg-red-100 text-red-800', COMPLETED:'bg-blue-100 text-blue-800' }
const STATUS_RU = { PENDING:'Ожидает', CONFIRMED:'Подтверждено', CANCELLED:'Отменено', COMPLETED:'Завершено' }

export default function StudentCabinet() {
  const { user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [progress, setProgress] = useState([])
  const [materials, setMaterials] = useState([])
  const [subjects, setSubjects] = useState([])
  const [showProgress, setShowProgress] = useState(false)
  const [progSubject, setProgSubject] = useState('')
  const [progPercent, setProgPercent] = useState(50)
  const [progNotes, setProgNotes] = useState('')
  const [contacts, setContacts] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('')

  useEffect(() => { loadBookings() }, [])

  const loadBookings = () => api.bookings.getMy().then(setBookings).catch(() => {})

  const selectTab = t => {
    setTab(t)
    if (t === 'bookings') loadBookings()
    if (t === 'progress') { api.student.getProgress().then(setProgress); api.subjects.getAll().then(setSubjects) }
    if (t === 'materials') api.materials.getMy().then(setMaterials)
    if (t === 'messages') api.messages.getContacts().then(setContacts)
  }

  const cancelBooking = async id => {
    if (!confirm('Отменить запись?')) return
    try { await api.bookings.cancel(id); toast('Запись отменена'); loadBookings() }
    catch (e) { toast(e.message, 'error') }
  }

  const saveProgress = async () => {
    if (!progSubject) { toast('Выберите предмет', 'error'); return }
    try {
      await api.student.updateProgress(progSubject, { progressPercent: progPercent, notes: progNotes })
      toast('Прогресс сохранён!')
      setShowProgress(false)
      api.student.getProgress().then(setProgress)
    } catch (e) { toast(e.message, 'error') }
  }

  const openChat = async (id, contact) => {
    setActiveChat(id)
    if (contact && !contacts.find(c => c.id === id)) {
      setContacts(prev => [...prev, contact])
    }
    const msgs = await api.messages.getConversation(id)
    setMessages(msgs)
  }

  const sendMsg = async () => {
    if (!msgInput.trim() || !activeChat) return
    try {
      await api.messages.send({ receiverId: activeChat, content: msgInput.trim() })
      setMsgInput('')
      const msgs = await api.messages.getConversation(activeChat)
      setMessages(msgs)
    } catch (e) { toast(e.message, 'error') }
  }

  const TABS = [['bookings','📅 Записи'],['progress','📈 Прогресс'],['materials','📚 Материалы'],['messages','💬 Сообщения']]

  return (
    <div className="min-h-screen bg-[#FFF9F0] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Привет, {user?.firstName}!</h1>
            <p className="text-gray-400">Личный кабинет студента</p>
          </div>
          <a href="/cities" onClick={e=>{e.preventDefault();window.location.href='/cities'}} className="btn-primary">Найти репетитора</a>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl p-2 border border-orange-100 w-fit">
          {TABS.map(([k,l]) => (
            <button key={k} onClick={() => selectTab(k)} className={`tab-btn ${tab===k?'active':''}`}>{l}</button>
          ))}
        </div>

        {/* BOOKINGS */}
        {tab === 'bookings' && (
          <div className="space-y-4">
            {!bookings.length
              ? <div className="card text-center text-gray-400 py-12">Нет записей. <a href="/cities" className="text-orange-500 underline">Найти репетитора</a></div>
              : bookings.map(b => (
                <div key={b.id} className="card flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-gray-900">{b.tutorFirstName} {b.tutorLastName}</div>
                    <div className="text-sm text-gray-500">{b.subjectName || 'Без предмета'} · {fmtDate(b.slotStart)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${STATUS_COLOR[b.status]}`}>{STATUS_RU[b.status]}</span>
                    <button onClick={() => { selectTab('messages'); setTimeout(() => openChat(b.tutorId, { id: b.tutorId, firstName: b.tutorFirstName, lastName: b.tutorLastName }), 100) }}
                      className="text-xs text-orange-500 hover:underline">💬 Написать</button>
                    {b.status === 'CONFIRMED' && (
                      <button onClick={() => cancelBooking(b.id)} className="text-xs text-red-400 hover:underline">Отменить</button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* PROGRESS */}
        {tab === 'progress' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Мой прогресс</h2>
              <button onClick={() => setShowProgress(!showProgress)} className="btn-primary text-sm px-4 py-2">+ Добавить</button>
            </div>
            {showProgress && (
              <div className="card mb-5 max-w-lg space-y-3">
                <select className="input" value={progSubject} onChange={e => setProgSubject(e.target.value)}>
                  <option value="">Выберите предмет</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <label className="text-sm font-semibold text-gray-700 block">Прогресс: <span className="text-orange-500">{progPercent}%</span></label>
                <input type="range" min="0" max="100" value={progPercent} onChange={e => setProgPercent(+e.target.value)} className="w-full accent-orange-500"/>
                <textarea className="input" rows={2} placeholder="Заметки..." value={progNotes} onChange={e => setProgNotes(e.target.value)}/>
                <button onClick={saveProgress} className="btn-primary">Сохранить</button>
              </div>
            )}
            <div className="space-y-4">
              {!progress.length
                ? <div className="card text-center text-gray-400 py-12">Нет данных о прогрессе</div>
                : progress.map(p => (
                  <div key={p.id} className="card">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-800">{p.subjectName}</span>
                      <span className="text-orange-500 font-bold">{p.progressPercent}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-orange-100 overflow-hidden">
                      <div className="h-full rounded-full gradient-bg transition-all" style={{width:`${p.progressPercent}%`}}/>
                    </div>
                    {p.notes && <p className="text-xs text-gray-400 mt-2">{p.notes}</p>}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* MATERIALS */}
        {tab === 'materials' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Учебные материалы</h2>
            {!materials.length
              ? <div className="card text-center text-gray-400 py-12">Нет материалов</div>
              : <div className="grid md:grid-cols-2 gap-4">
                  {materials.map(m => (
                    <div key={m.id} className="card">
                      <div className="font-bold text-gray-900 mb-1">{m.title}</div>
                      <span className="badge bg-blue-50 text-blue-600 mb-2">{m.subjectName || 'Без предмета'}</span>
                      {m.description && <p className="text-sm text-gray-500 mt-2">{m.description}</p>}
                      {m.fileUrl && <a href={m.fileUrl} target="_blank" rel="noreferrer" className="text-orange-500 text-sm underline mt-2 block">📎 Открыть</a>}
                      <div className="text-xs text-gray-400 mt-2">от {m.tutorFirstName} {m.tutorLastName}</div>
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
              {!contacts.length
                ? <p className="text-gray-400 text-sm">Нет переписок. Напишите репетитору из вкладки «Записи».</p>
                : contacts.map(c => (
                  <button key={c.id} onClick={() => openChat(c.id)}
                    className={`w-full text-left card py-3 text-sm font-medium hover:border-orange-400 transition ${activeChat===c.id?'border-orange-400':''}`}>
                    {c.firstName} {c.lastName}
                  </button>
                ))}
            </div>
            <div className="md:col-span-2">
              {!activeChat
                ? <div className="card h-80 flex items-center justify-center text-gray-400">Выберите переписку</div>
                : <div className="card flex flex-col h-80">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                      {messages.map(m => (
                        <div key={m.id} className={`flex ${m.senderId===user?.id?'justify-end':'justify-start'}`}>
                          <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${m.senderId===user?.id?'gradient-bg text-white':'bg-gray-100 text-gray-800'}`}>
                            {m.content}
                            <div className="text-xs opacity-60 mt-0.5">{fmtDate(m.createdAt)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className="input flex-1" placeholder="Сообщение..." value={msgInput}
                        onChange={e => setMsgInput(e.target.value)}
                        onKeyDown={e => e.key==='Enter' && sendMsg()}/>
                      <button onClick={sendMsg} className="btn-primary px-4">→</button>
                    </div>
                  </div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
