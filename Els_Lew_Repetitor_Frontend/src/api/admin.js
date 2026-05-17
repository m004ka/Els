const BASE = '/api/v1/admin'

async function req(method, path, body) {
  const token = localStorage.getItem('token')
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined
  })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Ошибка')
  return data
}

const admin = {
  stats:          ()       => req('GET', '/stats'),
  users:          ()       => req('GET', '/users'),
  deleteUser:     id       => req('DELETE', `/users/${id}`),
  tutors:         ()       => req('GET', '/tutors'),
  deleteTutor:    id       => req('DELETE', `/tutors/${id}`),
  bookings:       ()       => req('GET', '/bookings'),
  reviews:        ()       => req('GET', '/reviews'),
  deleteReview:   id       => req('DELETE', `/reviews/${id}`),
  createCity:     name     => req('POST', '/cities', { name }),
  deleteCity:     id       => req('DELETE', `/cities/${id}`),
  createSubject:  (n, cat) => req('POST', '/subjects', { name: n, category: cat }),
  deleteSubject:  id       => req('DELETE', `/subjects/${id}`),
}

export default admin
