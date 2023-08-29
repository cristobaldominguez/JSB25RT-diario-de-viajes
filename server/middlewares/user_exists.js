import { getUserBy } from '../db/queries/users_queries.js'

// Errors
import AuthError from '../errors/auth_error.js'

async function userExists (req, res, next) {
  if (!req.user) return next()

  try {
    const { id } = req.user
    const user = await getUserBy({ id })
    if (!user) throw new AuthError({ message: 'Usuario no encontrado', status: 404 })
    if (!user.active) throw new AuthError({ message: 'Usuario no activo', status: 404 })

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export default userExists
