const API_BASE = '/api/v1';

function getToken() { return localStorage.getItem('token'); }
function getUser()  { return JSON.parse(localStorage.getItem('user') || 'null'); }
function setAuth(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    id: data.userId, email: data.email, username: data.username,
    firstName: data.firstName, lastName: data.lastName, role: data.role
  }));
}
function clearAuth() { localStorage.removeItem('token'); localStorage.removeItem('user'); }
function isLoggedIn() { return !!getToken(); }

async function apiRequest(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  if (res.status === 401) { clearAuth(); window.location.href = '/login.html'; return; }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(err.error || 'Ошибка');
  }
  if (res.status === 204) return null;
  return res.json();
}

const api = {
  auth: {
    login:    (d) => apiRequest('POST', '/auth/login', d),
    register: (d) => apiRequest('POST', '/auth/register', d),
  },
  cities:   { getAll: () => apiRequest('GET', '/cities') },
  subjects: {
    getAll:     ()       => apiRequest('GET', '/subjects'),
    getByCity:  (cityId) => apiRequest('GET', `/subjects/by-city/${cityId}`),
  },
  tutors: {
    getAll:       (params) => apiRequest('GET', `/tutors?${new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v]) => v != null)))}`),
    getById:      (id)     => apiRequest('GET', `/tutors/${id}`),
    getSlots:     (id)     => apiRequest('GET', `/tutors/${id}/slots`),
    getMyProfile: ()       => apiRequest('GET', '/tutors/me/profile'),
    updateProfile:(d)      => apiRequest('PUT', '/tutors/me/profile', d),
    addSlot:      (d)      => apiRequest('POST', '/tutors/me/slots', d),
    deleteSlot:   (id)     => apiRequest('DELETE', `/tutors/me/slots/${id}`),
    getMySlots:   ()       => apiRequest('GET', '/tutors/me/slots'),
    getMyBookings:()       => apiRequest('GET', '/tutors/me/bookings'),
    completeBooking:(id)   => apiRequest('PUT', `/tutors/me/bookings/${id}/complete`),
  },
  bookings: {
    create: (d)  => apiRequest('POST', '/bookings', d),
    getMy:  ()   => apiRequest('GET', '/bookings'),
    cancel: (id) => apiRequest('PUT', `/bookings/${id}/cancel`),
  },
  reviews: {
    add:         (d)  => apiRequest('POST', '/reviews', d),
    getByTutor:  (id) => apiRequest('GET', `/reviews/tutor/${id}`),
  },
  materials: {
    create:     (d) => apiRequest('POST', '/materials', d),
    getMy:      ()  => apiRequest('GET', '/materials/my'),
    getTutor:   ()  => apiRequest('GET', '/materials/tutor'),
  },
  messages: {
    send:          (d)  => apiRequest('POST', '/messages', d),
    getConversation:(id) => apiRequest('GET', `/messages/conversation/${id}`),
    getUnread:     ()   => apiRequest('GET', '/messages/unread-count'),
    getContacts:   ()   => apiRequest('GET', '/messages/contacts'),
  },
  student: {
    getProgress:    ()         => apiRequest('GET', '/student/progress'),
    updateProgress: (id, d)    => apiRequest('PUT', `/student/progress/${id}`, d),
  }
};

function starsHtml(rating, max = 5) {
  let html = '';
  for (let i = 1; i <= max; i++) {
    html += `<span class="star${i <= Math.round(rating) ? '' : ' empty'}">★</span>`;
  }
  return html;
}

function formatDate(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function renderNavAuth() {
  const nav = document.getElementById('nav-auth');
  if (!nav) return;
  const user = getUser();
  if (user) {
    nav.innerHTML = `
      <span class="text-sm text-gray-600 hidden md:inline">Привет, <b>${user.firstName}</b></span>
      <a href="${user.role === 'TUTOR' ? 'tutor-cabinet.html' : 'student-cabinet.html'}" class="px-4 py-2 rounded-xl gradient-btn text-white text-sm font-semibold">Кабинет</a>
      <button onclick="logout()" class="px-3 py-2 text-sm text-gray-400 hover:text-red-500">Выйти</button>
    `;
  }
}

function logout() {
  clearAuth();
  window.location.href = 'index.html';
}

function requireAuth(role = null) {
  if (!isLoggedIn()) { window.location.href = 'login.html'; return false; }
  if (role) {
    const user = getUser();
    if (user.role !== role) { window.location.href = user.role === 'TUTOR' ? 'tutor-cabinet.html' : 'student-cabinet.html'; return false; }
  }
  return true;
}
