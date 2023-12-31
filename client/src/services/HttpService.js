import { APIUrl } from '../config.js'

async function Http({ method = 'GET', url = '/entries', token = null, body = null }) {
  if (!url.startsWith('/')) throw new Error('URL debe comenzar con un /')

  const isFormData = body instanceof FormData
  const fullURL = new URL(APIUrl + url)
  const config = {
    method,
    headers: {
      'Accept': 'application/json'
    }
  }

  if (token) {
    config.headers.Authorization = token
  }

  if (!isFormData) {
    config.headers['Content-Type'] = 'application/json'
  }

  if (body && !isFormData) {
    config.body = JSON.stringify(body)
  }

  if (body && isFormData) {
    config.body = body
  }

  try {
    const response = await fetch(fullURL, config)
    const data = await response.json()

    return { data, loading: false, error: false }

  } catch (error) {
    return { data: null, loading: false, error }
  }
}

export default Http
