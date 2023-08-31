import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

// Rutas Privadas
import PrivateRoutes from './components/PrivateRoutes'

// Components
import NavBar from './components/NavBar'
import Notifications from './components/Notifications'

function App() {
  return <>
    <Notifications />
    <NavBar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  </>
}

export default App
