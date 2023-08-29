import Notifications from './components/Notifications'
import useAuth from './hooks/useAuth'
import useServer from './hooks/useServer'

function App() {
  const { isAuthenticated, user } = useAuth()
  const { post } = useServer()

  const submitHandler = async (e) => {
    e.preventDefault()
    const credentials = Object.fromEntries(new FormData(e.target))
    await post({ url: '/users/login', body: credentials })
  }

  return <>
    <Notifications />
    <form onSubmit={submitHandler}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>

      <button type="submit">Iniciar Sesión</button>
    </form>

    { isAuthenticated && <p>Hola {user.username}!</p> }
  </>
}

export default App
