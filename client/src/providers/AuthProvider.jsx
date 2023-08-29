import { useState } from 'react'
import authContext from '../context/authContext'
import { userLocalStorageKey } from '../config'
import isEmpty from '../helpers/isEmpty'

function AuthProvider({ children }) {
  const savedUser = JSON.parse(localStorage.getItem(userLocalStorageKey)) || {}
  const [userData, setUserData] = useState(savedUser)

  const setUserHandler = (user = {}) => {
    if (isEmpty(user)) return

    localStorage.setItem(userLocalStorageKey, JSON.stringify(user))
    setUserData(user)
  }

  const logoutHandler = () => {
    localStorage.removeItem(userLocalStorageKey)
    setUserData(null)
  }

  const authValues = {
    user: userData?.user ?? null,
    token: userData?.token ?? null,
    isAuthenticated: !!userData?.token,
    setUser: setUserHandler,
    logout: logoutHandler
  }

  return <authContext.Provider value={authValues} >
    { children }
  </authContext.Provider>
}

export default AuthProvider
