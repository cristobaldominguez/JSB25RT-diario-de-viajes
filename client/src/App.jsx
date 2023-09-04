import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import NewEntry from './pages/NewEntry'

// Rutas Privadas
import PrivateRoutes from './components/PrivateRoutes'

// Components
import NavBar from './components/NavBar'
import Notifications from './components/Notifications'
import EditEntry from './pages/EditEntry'

function App() {
  return <>
    <Notifications />
    <NavBar />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />

      {/* Rutas privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path='/entries'>
          <Route path='/entries/new' element={<NewEntry />} />
          <Route path='/entries/:id/edit' element={<EditEntry />} />
        </Route>
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  </>
}

export default App
