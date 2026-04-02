import NavBar from './components/NavBar'
import EmployerForm from './components/EmployerForm'
import { Routes, Route } from 'react-router-dom'
import JobDashboard from './components/employers/JobDashboard'
import JobOverview from './components/employers/JobDetails'
import ApplicationList from './components/employers/ApplicationList'

function App() {
  return (
    <main className="min-h-screen px-4 py-8">
      <NavBar />
      <Routes>
        {/* TEMPORARY Routes, once pages are implemented replace these with the correct component */}
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/listings" element={<h1>Listings</h1>} />
        <Route path="/signout" element={<h1>Sign Out</h1>} />
    
        <Route path="/jobs" element={<JobDashboard />} />
        <Route path="/jobs/:id" element={<JobOverview />} />
        <Route path="/jobs/:id/applications" element={<ApplicationList />} />
        <Route path="/EmployerSignup" element={<EmployerForm />} />
      </Routes>
    </main>
  )
}

export default App
