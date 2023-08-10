import crypto from 'node:crypto'
import encryptPassword from '../helpers/encrypt_password.js'

import { newUser } from '../db/queries/users_queries.js'

async function createUser (req, res, next) {
  try {
    const { email, username, password } = req.body

    if (!email) throw new Error('El campo email es obligatorio')
    if (!password) throw new Error('El campo password es obligatorio')
    if (!username) throw new Error('El campo username es obligatorio')

    // Generamos el código de registro.
    const registrationCode = crypto.randomUUID()

    // Encriptamos la contraseña.
    const hashedPass = await encryptPassword({ password })

    // Insertamos al usuario en la base de datos.
    const user = await newUser({ email, username, password: hashedPass, registrationCode })
    if (user instanceof Error) throw user

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

export default {
  createUser
}
