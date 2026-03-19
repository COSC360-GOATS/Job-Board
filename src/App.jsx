import NavBar from './components/NavBar'
import EmployerForm from './components/EmployerForm'

function App() {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-blue-50 to-white px-4 py-8 text-slate-900">
      <NavBar />
      <EmployerForm />
    </main>
  )
}

export default App
