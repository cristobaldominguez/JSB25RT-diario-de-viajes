import getPool from '../pool.js'

async function getEntryBy (obj) {
  const userId = obj.userId || 0
  delete obj.userId

  const queryStr = Object.entries(obj).map(arr => `${arr[0]} = '${arr[1]}'`).join(' AND ')
  let connection

  try {
    connection = await getPool()
    const [entries] = await connection.query(
      `SELECT *, userId = ${userId} AS owner FROM entries WHERE ${queryStr}`
    )

    for (const entry of entries) {
      const [photos] = await connection.query(
        'SELECT id, name FROM photos WHERE entryId = ?',
        [entry.id]
      )

      entry.photos = photos
    }
    return entries[0]
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function newEntry ({ title, place, description, userId }) {
  let connection

  try {
    connection = await getPool()

    const [savedData] = await connection.query(
      'INSERT INTO entries(title, place, description, userId, createdAt) VALUES(?, ?, ?, ?, ?)',
      [title, place, description, userId, new Date()]
    )
    const entry = await getEntryBy({ id: savedData.insertId })
    if (entry instanceof Error) throw entry

    return entry
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function updateEntry ({ id, userId, title, place, description }) {
  let connection

  try {
    connection = await getPool()

    const savedData = await connection.query(
      'UPDATE entries SET title = ?, place = ?, description = ?, modifiedAt = ? WHERE id = ?',
      [title, place, description, new Date(), id]
    )
    const entry = await savedData && await getEntryBy({ id, userId })
    if (entry instanceof Error) throw entry

    return entry
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function insertPhoto ({ photoName, entryId }) {
  let connection

  try {
    connection = await getPool()

    const [photo] = await connection.query(
      'INSERT INTO photos(name, entryId) VALUES(?, ?)',
      [photoName, entryId]
    )

    return {
      id: photo.insertId,
      name: photoName
    }
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function getAllEntries ({ keyword = '', userId = 0 }) {
  let connection

  try {
    connection = await getPool()

    const [entries] = await connection.query(
      `SELECT
            e.id,
            e.title,
            e.place,
            e.description,
            u.username,
            u.avatar,
            e.userId,
            e.userId = ? AS owner,
            e.createdAt
        FROM entries AS e
        INNER JOIN users AS u ON u.id = e.userId
        WHERE e.title LIKE ? OR e.place LIKE ? OR e.description LIKE ?
        GROUP BY e.id
        ORDER BY e.createdAt DESC
      `,
      [userId, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    )

    // Si el array de entradas tiene alguna entrada obtenemos sus fotos y convertimos
    // a tipo Number la media de votos.
    for (const entry of entries) {
      const [photos] = await connection.query(
        'SELECT id, name FROM photos WHERE entryId = ?',
        [entry.id]
      )

      // Agregamos las fotos a la entrada.
      entry.photos = photos
    }

    return entries
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

async function destroyPhoto ({ id }) {
  let connection

  try {
    connection = await getPool()

    await connection.query(
      'DELETE FROM photos WHERE id = ?',
      [id]
    )
  } catch (error) {
    return error
  } finally {
    if (connection) connection.release()
  }
}

export {
  getEntryBy,
  newEntry,
  updateEntry,
  insertPhoto,
  getAllEntries,
  destroyPhoto
}
