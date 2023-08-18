import jwt from 'jsonwebtoken'

import { SECRET } from '../config.js'

async function authUser (req, res, next) {
  try {
    const { authorization } = req.headers

    // Si falta el token lanzamos un error.
    if (!authorization) throw new Error('Falta la cabecera de autenticación')

    // Variable que almacenará la info del token una vez desencriptada.
    let tokenInfo

    try {
      tokenInfo = jwt.verify(authorization, SECRET)
    } catch {
      throw new Error('Token inválido')
    }

    // Creamos una propiedad inventada por nosotros en el objeto request para añadir
    // los datos del usuario.
    req.user = tokenInfo

    // Pasamos el control a la siguiente función controladora.
    next()
  } catch (err) {
    next(err)
  }
}

export default authUser