import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import NoteList from './pages/NoteList'

function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={token ? '/notes': '/login'} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/notes' element={<NoteList />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
