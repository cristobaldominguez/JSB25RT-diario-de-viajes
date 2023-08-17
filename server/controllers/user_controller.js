import crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {
  getUserBy,
  newUser,
  updateUserRegCode,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass
} from '../db/queries/users_queries.js'

// Helpers
import encryptPassword from '../helpers/encrypt_password.js'
import randomDigits from '../helpers/random_digits.js'

// SendMail
import sendMail from '../services/send_mail.js'

// Config
import { PORT, SECRET } from '../config.js'

// Services
import { deletePhoto, savePhoto } from '../services/photos.js'

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

    const emailSubject = 'Activa tu usuario en Diario de Viajes'
    const emailBody = `¡Bienvenid@ ${username}!
    Por favor verifica el usuario a través de la dirección: http://localhost:${PORT}/users/validate/${user.registrationCode}`

    const sentMail = await sendMail(user.email, emailSubject, emailBody)
    if (sentMail instanceof Error) throw sentMail

    res.json({
      status: 'ok',
      message: 'Usuario creado, revisa el email de verificación'
    })
  } catch (err) {
    next(err)
  }
}

async function validateUser (req, res, next) {
  const { regCode } = req.params

  try {
    const validation = await updateUserRegCode({ registrationCode: regCode })
    if (validation instanceof Error) throw validation

    res.json({
      status: 'ok',
      message: 'Usuario creado'
    })
  } catch (error) {
    next(error)
  }
}

async function loginUser (req, res, next) {
  const { email, password } = req.body

  try {
    if (!email) throw new Error('El campo email es obligatorio')
    if (!password) throw new Error('El campo password es obligatorio')

    const user = await getUserBy({ email })

    // Revisamos si el usuario esta activado.
    if (!user.active) throw new Error('Primero debes activar tu usuario')

    // Comprobamos si las contraseñas coinciden.
    const validPass = await bcrypt.compare(password, user.password)
    if (!validPass) throw new Error('Usuario o contraseña incorrectos')

    // Objeto con info que queremos agregar al token.
    const tokenInfo = {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
      avatar: user.avatar
    }

    const token = jwt.sign(tokenInfo, SECRET, { expiresIn: '7d' })
    res.json({
      status: 'ok',
      data: {
        token
      }
    })
  } catch (error) {
    next(error)
  }
}

async function getUser (req, res, next) {
  try {
    const { userId } = req.params

    // Obtenemos el usuario desde la base de datos
    const user = await getUserBy({ id: userId })

    // Si no existe ese usuario, retornamos un error
    if (!user) throw new Error('Usuario no encontrado')

    // Filtraremos los elementos de usuario que necesitamos
    const { id, username, avatar } = user

    // Generamos el usuario de retorno
    const returnUser = { id, username, avatar }

    // En el caso de que el usuario consulte por su
    // propia info, le entregaremos el email
    if (user.id === req.user.id) {
      returnUser.email = user.email
      returnUser.createdAt = user.createdAt
    }

    res.json({ user: returnUser })
  } catch (err) {
    next(err)
  }
}

async function editUserAvatar (req, res, next) {
  try {
    // Lanzamos un error si falta el avatar. La propiedad files puede no existir en caso
    // de que no recibamos ningún archivo. Usamos la interrogación para indicarle a JavaScript
    // que dicha propiedad puede ser undefined para evitar que se detenga el server con un error.
    if (!req.files?.avatar) throw new Error('Faltan campos')

    // Obtenemos los datos del usuario para comprobar si ya tiene un avatar previo.
    // const user = await getUserBy({ id: req.user.id })
    const { user } = req

    // Si el usuario tiene un avatar previo lo eliminamos.
    if (user.avatar) {
      await deletePhoto({ name: user.avatar })
    }

    // Guardamos el avatar en una carpeta del servidor y obtenemos el nombre con el que lo hemos
    // guardado.
    const avatar = await savePhoto({ img: req.files.avatar, width: 100 })

    const savedAvatar = await updateUserAvatar({ avatar, userId: req.user.id })
    if (savedAvatar instanceof Error) throw savedAvatar

    res.send({
      status: 'ok',
      message: 'Avatar actualizado'
    })
  } catch (err) {
    next(err)
  }
}

async function sendRecoverPass (req, res, next) {
  try {
    const { email } = req.body
    if (!email) throw new Error('Faltan campos')

    const user = await getUserBy({ email })
    if (!user) throw user

    const recoverPassCode = randomDigits({ number: 9 })

    const insertedCode = await updateUserRecoverPass({ id: user.id, recoverPassCode })
    if (insertedCode instanceof Error) throw insertedCode

    const emailSubject = 'Recuperación de contraseña en Diario de Viajes'

    const emailBody = `
    Se ha solicitado la recuperación de contraseña para este email en Diaro de Viajes.
    Utiliza el siguiente código para crear una nueva contraseña: ${recoverPassCode}
    
    Si no has sido tú ignora este email.
    `

    const sentMail = await sendMail(email, emailSubject, emailBody)
    if (sentMail instanceof Error) throw sentMail

    res.send({
      status: 'ok',
      message: 'Correo de recuperación enviado'
    })
  } catch (err) {
    console.log(err)
    next(err)
  }
}

async function editUserPass (req, res, next) {
  try {
    const { recoveryPassCode, newPass } = req.body

    if (!newPass) throw new Error('El campo newPass es obligatorio')
    if (!recoveryPassCode) throw new Error('El campo recoveryPassCode es obligatorio')

    // Encriptamos la contraseña
    const hashedPass = await encryptPassword({ password: newPass })

    // Actualizamos el usuario con la información entregada
    const updatedUser = await updateUserPass({ recoveryPassCode, newPass: hashedPass })
    if (updatedUser instanceof Error) throw updatedUser

    res.send({
      status: 'ok',
      message: 'Contraseña actualizada'
    })
  } catch (err) {
    next(err)
  }
}

export default {
  createUser,
  validateUser,
  loginUser,
  getUser,
  editUserAvatar,
  sendRecoverPass,
  editUserPass
}
