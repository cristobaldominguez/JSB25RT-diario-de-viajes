import jwt_decode from 'jwt-decode'

import Http from '../services/HttpService'
import useAuth from './useAuth'

function useServer() {
  const { token, setUser } = useAuth()

  const handleResponse = ({ data, loading, error }) => {
    if (data.status === 'ok' && data.data?.token) {
      const userDecoded = jwt_decode(data.data.token)
      setUser({ user: userDecoded, token: data.data.token })
    }

    return { data, loading, error }
  }

  return {
    get: ({ url }) => Http({ url, token }),
    post: ({ url, body }) => Http({ method: 'POST', url, token, body }).then(handleResponse),
    put: ({ url, body }) => Http({ method: 'PUT', url, token, body }).then(handleResponse),
    patch: ({ url, body }) => Http({ method: 'PATCH', url, token, body }).then(handleResponse),
    delete: ({ url }) => Http({ method: 'DELETE', url, token })
  }
}

export default useServer
