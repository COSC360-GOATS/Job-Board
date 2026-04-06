import NavBar from './components/NavBar'
import RegisterForm from './components/RegisterForm'
import Login from './components/Login'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import JobDashboard from './components/employers/JobDashboard'
import JobOverview from './components/employers/JobDetails'
import ApplicationList from './components/employers/ApplicationList'
import AdminDashboard from './components/admin/AdminDashboard'
import JobListings from './components/applicants/JobListings'
import ApplyPage from './components/applicants/ApplyPage'
import { useEffect } from 'react'

function SignOut() {
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem('user')
    navigate('/')
  }, [])
  return null
}

function App() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/register' || location.pathname === '/login'

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-slate-900">
      {!hideNavbar && <NavBar />}
      <Routes>
        {/* TEMPORARY Routes, once pages are implemented replace these with the correct component */}
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />

        
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/listings" element={<JobListings />} />
        <Route path="/listings/:jobId" element={<ApplyPage />} />
        <Route path="/jobs" element={<JobDashboard />} />
        <Route path="/jobs/:jobId" element={<JobOverview />} />
        <Route path="/jobs/:jobId/applications" element={<ApplicationList />} />
      </Routes>
    </main>
  )
}

export default App
