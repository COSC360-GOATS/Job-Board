import NavBar from './components/NavBar'
import './App.css'
import JobDashboard from './components/employers/JobDashboard'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import JobOverview from './components/employers/JobDetails'
import ApplicantList from './components/employers/ApplicationList'

function App() {
  return (
    <Router>
      <main>
        <NavBar />
        <Routes>
          <Route path="/jobs" element={<JobDashboard />} />
          <Route path="/jobs/:id" element={<JobOverview />} />
          <Route path="/jobs/:id/applications" element={<ApplicantList />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
