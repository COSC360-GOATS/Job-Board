import NavBar from './components/NavBar'
import RegisterForm from './components/RegisterForm'
import Login from './components/Login'
import { Routes, Route, useLocation } from 'react-router-dom'
import JobDashboard from './components/employers/JobDashboard'
import JobOverview from './components/employers/JobDetails'
import ApplicationList from './components/employers/ApplicationList'
import AdminDashboard from './components/admin/AdminDashboard'

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/register' || location.pathname === '/login'

  return (
    <main className="min-h-screen px-4 py-8">
      {!hideNavbar && <NavBar />}
      <Routes>
        {/* TEMPORARY Routes, once pages are implemented replace these with the correct component */}
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/listings" element={<h1>Listings</h1>} />
        <Route path="/signout" element={<h1>Sign Out</h1>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  )
}

export default App
