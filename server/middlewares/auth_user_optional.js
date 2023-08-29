import jwt from 'jsonwebtoken'

// Errors
import AuthError from '../errors/auth_error.js'

import { SECRET } from '../config.js'

async function authUserOptional (req, res, next) {
  try {
    const { authorization } = req.headers

    // Si hay token creamos la propiedad user en el objeto request. Cabe la posibilidad
    // de que recibamos un valor "null" como String por lo que evitaremos entrar en este
    // if si se da el caso.
    if (authorization && authorization !== 'null') {
      // Variable que almacenará la info del token una vez desencriptada.
      let tokenInfo

      try {
        tokenInfo = jwt.verify(authorization, SECRET)
      } catch {
        throw new AuthError({ message: 'Token inválido', status: 401 })
      }

      req.user = tokenInfo
    } else {
      req.user = null
    }

    // Pasamos el control a la siguiente función controladora.
    next()
  } catch (err) {
    next(err)
  }
}

export default authUserOptional
