import NavBar from './components/NavBar'
import './App.css'
import SearchBar from './components/SearchBar'


function App() {
  return (
    <>
     <h1>Job Board</h1>
     <SearchBar />
    </>
    <main>
      <NavBar />
    </main>
  )
}

export default App
