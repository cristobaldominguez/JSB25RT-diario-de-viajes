import getPool from '../pool.js'

async function getUserBy (obj) {
  const queryStr = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(', ')
  let connection

  try {
    connection = await getPool()

    const [user] = await connection.query(
      `SELECT * FROM users WHERE ${queryStr}`
    )
    return user[0]
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function newUser ({ email, username, password, registrationCode }) {
  let connection

  try {
    connection = await getPool()

    // Comprobamos si el email está repetido.
    let user = await getUserBy({ email })

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el email está repetido.
    if (user) {
      throw new Error('Ya existe un usuario con ese email')
    }

    // Comprobamos si el nombre de usuario está repetido.
    user = await getUserBy({ username })

    // Si el array de usuarios tiene más de 0 usuarios quiere decir que el nombre de usuario está repetido.
    if (user) {
      throw new Error('Nombre de usuario no disponible')
    }

    // Insertamos el usuario en la base de datos.
    const [result] = await connection.query(
      'INSERT INTO users (email, username, password, registrationCode, createdAt) VALUES(?, ?, ?, ?, ?)',
      [email, username, password, registrationCode, new Date()]
    )
    return await getUserBy({ id: result.insertId })
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function updateUserRegCode ({ registrationCode }) {
  let connection

  try {
    connection = await getPool()

    // Intentamos localizar a un usuario con el código de registro que nos llegue.
    const user = await getUserBy({ registrationCode })

    // Si no hay usuarios con ese código de registro lanzamos un error.
    if (!user) throw new Error('Código no encontrado')

    // Si existe el usuario, lo actualizamos.
    await connection.query(
      'UPDATE users SET active = true, registrationCode = null, modifiedAt = ? WHERE id = ?',
      [new Date(), user.id]
    )
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function updateUserAvatar ({ avatar, userId }) {
  let connection

  try {
    connection = await getPool()

    // Actualizamos el avatar del usaurio con su fecha de modificación.
    await connection.query(
      'UPDATE users SET avatar = ?, modifiedAt = ? WHERE id = ?',
      [avatar, new Date(), userId]
    )
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function updateUserRecoverPass ({ id, recoverPassCode }) {
  let connection

  try {
    connection = await getPool()

    // Insertamos el recoveryPassCode en el usuario
    await connection.query(
      'UPDATE users SET recoveryPassCode = ?, modifiedAt = ? WHERE id = ?',
      [recoverPassCode, new Date(), id]
    )
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function updateUserPass ({ recoveryPassCode, newPass }) {
  let connection

  try {
    connection = await getPool()

    // Comprobamos si existe algún usuario con ese código de recuperación.
    const user = await getUserBy({ recoveryPassCode })

    // Si no hay ningún usuario con ese código de recuperación lanzamos un error.
    if (!user) throw new Error('Código de recuperación incorrecto')

    // Actualizamos el usuario.
    await connection.query(
      'UPDATE users SET password = ?, recoveryPassCode = null, modifiedAt = ? WHERE id = ?',
      [newPass, new Date(), user.id]
    )
  } catch (error) {
    console.log(error)
    return error
  } finally {
    if (connection) connection.release()
  }
}

export {
  getUserBy,
  newUser,
  updateUserRegCode,
  updateUserAvatar,
  updateUserRecoverPass,
  updateUserPass
}
