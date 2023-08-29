import authContext from '../context/authContext'

function AuthProvider({ children }) {

  return <authContext.Provider value={{}} >
    { children }
  </authContext.Provider>
}

export default AuthProvider
