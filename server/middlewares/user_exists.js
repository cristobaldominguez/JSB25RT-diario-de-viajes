import { getUserBy } from '../db/queries/users_queries.js'

async function userExists (req, res, next) {
  if (!req.user) return next()

  try {
    const { id } = req.user
    const user = await getUserBy({ id })
    if (!user) throw new Error('Usuario no encontrado')
    if (!user.active) throw new Error('Usuario no activo')

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export default userExists
