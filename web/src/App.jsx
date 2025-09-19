import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Boards from './pages/Boards'
import Protected from './components/Protected'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Route protégée */}
        <Route
          path="/"
          element={
            <Protected>
              <Boards />
            </Protected>
          }
        />
        {/* Ajoute d'autres routes ici si besoin */}
      </Routes>
    </BrowserRouter>
  )
}

export default App