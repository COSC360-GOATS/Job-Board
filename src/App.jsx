import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SearchBar from './components/SearchBar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <h1>Job Board</h1>
     <SearchBar />
    </>
  )
}

export default App
