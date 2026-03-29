import NavBar from './components/NavBar'
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <main>
      <NavBar />
      <Routes>
        {/* TEMPORARY Routes, once pages are implemented replace these with the correct component */}
        <Route path="/home" element={<h1>Home</h1>} />
        <Route path="/jobs" element={<h1>Jobs</h1>} />
        <Route path="/profile" element={<h1>Profile</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/listings" element={<h1>Listings</h1>} />
        <Route path="/signout" element={<h1>Sign Out</h1>} />
      </Routes>
    </main>
  )
}

export default App
