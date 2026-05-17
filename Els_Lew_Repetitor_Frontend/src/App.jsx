import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cities from './pages/Cities'
import Subjects from './pages/Subjects'
import Tutors from './pages/Tutors'
import TutorProfile from './pages/TutorProfile'
import StudentCabinet from './pages/StudentCabinet'
import TutorCabinet from './pages/TutorCabinet'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTutors from './pages/admin/AdminTutors'
import AdminBookings from './pages/admin/AdminBookings'
import AdminReviews from './pages/admin/AdminReviews'
import AdminCatalog from './pages/admin/AdminCatalog'

function PublicLayout({ children }) {
  return <><Navbar/>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<PublicLayout><Home/></PublicLayout>}/>
            <Route path="/login" element={<PublicLayout><Login/></PublicLayout>}/>
            <Route path="/register" element={<PublicLayout><Register/></PublicLayout>}/>
            <Route path="/cities" element={<PublicLayout><Cities/></PublicLayout>}/>
            <Route path="/subjects" element={<PublicLayout><Subjects/></PublicLayout>}/>
            <Route path="/tutors" element={<PublicLayout><Tutors/></PublicLayout>}/>
            <Route path="/tutors/:id" element={<PublicLayout><TutorProfile/></PublicLayout>}/>

            {/* PROTECTED */}
            <Route path="/cabinet/student" element={
              <PublicLayout><ProtectedRoute role="STUDENT"><StudentCabinet/></ProtectedRoute></PublicLayout>
            }/>
            <Route path="/cabinet/tutor" element={
              <PublicLayout><ProtectedRoute role="TUTOR"><TutorCabinet/></ProtectedRoute></PublicLayout>
            }/>

            {/* ADMIN — без Navbar, полноэкранный layout */}
            <Route path="/admin" element={
              <ProtectedRoute role="ADMIN"><AdminLayout/></ProtectedRoute>
            }>
              <Route index element={<AdminDashboard/>}/>
              <Route path="users" element={<AdminUsers/>}/>
              <Route path="tutors" element={<AdminTutors/>}/>
              <Route path="bookings" element={<AdminBookings/>}/>
              <Route path="reviews" element={<AdminReviews/>}/>
              <Route path="catalog" element={<AdminCatalog/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
