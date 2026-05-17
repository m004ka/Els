const BASE = '/api/v1'

async function req(method, path, body) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (res.status === 401) { localStorage.clear(); window.location.href = '/login'; return }
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера')
  return data
}

const api = {
  auth: {
    login:    b => req('POST', '/auth/login', b),
    register: b => req('POST', '/auth/register', b),
  },
  cities:   { getAll: () => req('GET', '/cities') },
  subjects: {
    getAll:    ()  => req('GET', '/subjects'),
    getByCity: id  => req('GET', `/subjects/by-city/${id}`),
  },
  tutors: {
    getAll:          p  => req('GET', `/tutors?${new URLSearchParams(Object.fromEntries(Object.entries(p).filter(([,v])=>v!=null)))}`),
    getById:         id => req('GET', `/tutors/${id}`),
    getSlots:        id => req('GET', `/tutors/${id}/slots`),
    getMyProfile:    () => req('GET', '/tutors/me/profile'),
    updateProfile:   b  => req('PUT', '/tutors/me/profile', b),
    addSlot:         b  => req('POST', '/tutors/me/slots', b),
    deleteSlot:      id => req('DELETE', `/tutors/me/slots/${id}`),
    getMySlots:      () => req('GET', '/tutors/me/slots'),
    getMyBookings:   () => req('GET', '/tutors/me/bookings'),
    completeBooking: id => req('PUT', `/tutors/me/bookings/${id}/complete`),
  },
  bookings: {
    create: b  => req('POST', '/bookings', b),
    getMy:  () => req('GET', '/bookings'),
    cancel: id => req('PUT', `/bookings/${id}/cancel`),
  },
  reviews: {
    add:       b  => req('POST', '/reviews', b),
    getByTutor:id => req('GET', `/reviews/tutor/${id}`),
  },
  materials: {
    create:  b  => req('POST', '/materials', b),
    getMy:   () => req('GET', '/materials/my'),
    getTutor:() => req('GET', '/materials/tutor'),
  },
  messages: {
    send:            b  => req('POST', '/messages', b),
    getConversation: id => req('GET', `/messages/conversation/${id}`),
    getUnread:       () => req('GET', '/messages/unread-count'),
    getContacts:     () => req('GET', '/messages/contacts'),
  },
  student: {
    getProgress:    ()      => req('GET', '/student/progress'),
    updateProgress: (id, b) => req('PUT', `/student/progress/${id}`, b),
  },
}

export default api

export function fmtDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export function declension(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'ов'
  if (n % 10 === 1) return ''
  if (n % 10 >= 2 && n % 10 <= 4) return 'а'
  return 'ов'
}
