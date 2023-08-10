import getPool from './pool.js'

const init = async () => {
  let connection

  try {
    connection = await getPool()

    console.log('---- Iniciando modificación de db ----')

    console.log('Borrando tablas')
    await connection.query('DROP TABLE IF EXISTS photos')
    await connection.query('DROP TABLE IF EXISTS entries')
    await connection.query('DROP TABLE IF EXISTS users')
    console.log('Tablas borradas \n')

    // Users
    console.log('- Creando tabla users')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users(
        id INT UNSIGNED AUTO_INCREMENT,

        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(75) UNIQUE NOT NULL,
        password VARCHAR(125) NOT NULL,
        avatar VARCHAR(100),
        role ENUM('admin', 'normal') DEFAULT 'normal',
        registrationCode VARCHAR(100),
        recoveryPassCode VARCHAR(100),
        active BOOLEAN DEFAULT false,

        createdAt DATETIME DEFAULT NOW(),
        modifiedAt DATETIME,

        PRIMARY KEY (id)
      )
     `)
    console.log('- Tabla users creada\n')

    // Entries
    console.log('- Creando tabla entries')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS entries(
        id INT UNSIGNED AUTO_INCREMENT,

        title VARCHAR(100) NOT NULL,
        place VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        userId INT UNSIGNED NOT NULL,

        createdAt DATETIME DEFAULT NOW(),
        modifiedAt DATETIME,

        PRIMARY KEY (id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `)
    console.log('- Tabla entries creada\n')

    // Photos
    console.log('- Creando tabla photos')
    await connection.query(`
      CREATE TABLE IF NOT EXISTS photos(
        id INT UNSIGNED AUTO_INCREMENT,

        name VARCHAR(100) NOT NULL,
        entryId INT UNSIGNED NOT NULL,

        createdAt DATETIME DEFAULT NOW(),

        PRIMARY KEY (id),
        FOREIGN KEY (entryId) REFERENCES entries(id)
      )
    `)
    console.log('- Tabla photos creada\n')
    console.log('Tablas creadas')
  } catch (error) {
    console.log(error)
  } finally {
    if (connection) connection.release()
    process.exit()
  }
}

init()
