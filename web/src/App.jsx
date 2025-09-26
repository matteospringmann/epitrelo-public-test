import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Boards from './pages/Boards'
import Protected from './components/Protected'
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/boards" element={<Protected><Boards /></Protected>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App