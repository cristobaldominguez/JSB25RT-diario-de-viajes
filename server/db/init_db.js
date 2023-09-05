import getPool from './pool.js'
import encryptPassword from '../helpers/encrypt_password.js'

const init = async () => {
  let connection

  try {
    connection = await getPool()

    console.log('---- Iniciando modificación de db ----')
    console.log('Borrando tablas')
    await connection.query('DROP TABLE IF EXISTS photos')
    await connection.query('DROP TABLE IF EXISTS entries')
    await connection.query('DROP TABLE IF EXISTS users')
    console.log('Tablas borradas\n')

    console.log('Creando nuevas tablas\n')

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

    console.log('Creando registros\n')
    console.log('- Agregando usuarios')
    const users = [
      { username: 'cristobaldominguez', email: 'cristobal@example.com', password: '123123', active: 1, role: 'admin', avatar: 'cristobaldominguez.jpg' },
      { username: 'juanperez', email: 'juan@example.com', password: '123123', active: 1, role: 'admin', avatar: 'juanperez.jpg' },
      { username: 'martinaperez', email: 'martina@example.com', password: '123123', active: 1, role: 'DEFAULT', avatar: 'martinaperez.jpg' },
      { username: 'pedroperez', email: 'pedro@example.com', password: '123123', active: 1, role: 'DEFAULT', avatar: 'pedroperez.jpg' },
      { username: 'luciaperez', email: 'lucia@example.com', password: '123123', active: 1, role: 'DEFAULT', avatar: 'luciaperez.jpg' },
      { username: 'diegoperez', email: 'diego@example.com', password: '123123', active: 1, role: 'DEFAULT', avatar: 'diegoperez.jpg' }
    ]

    const usersQueryList = []
    for (const { password, username, email, avatar, role, active } of users) {
      const pwd = await encryptPassword({ password })
      const roleField = role === 'admin' ? '\'admin\'' : role

      usersQueryList.push(`('${username}', '${email}', '${pwd}', '${avatar}', ${roleField}, ${active})`)
    }

    await connection.query(`
    INSERT INTO users(username, email, password, avatar, role, active)
      VALUES${usersQueryList.join(',')};
    `)

    console.log('- Usuarios creados\n')

    // Entries
    console.log('- Agregando entries')
    await connection.query(`
      INSERT INTO entries(title, place, description, userId)
      VALUES('El amour!', 'Paris', 'Un gran lugar para visitar', 3),
            ('Vacaciones por siempre', 'Bora Bora', 'Tienes que venir!', 1),
            ('Wow, miren la vista!', 'Parque nacional de los Glaciares', 'Es un gran lugar, pero frío', 2),
            ('Todos los caminos llegan a Roma!', 'Roma', 'La cuna de una gran civilización', 4),
            ('Santa Marta es puro sabor', 'Santa Marta', 'Una ciudad de diversidades; en su paisaje, en su gente y en cada aspecto cultural.', 6),
            ('Muchas maneras de disfrutar', 'Islandia', 'Acogedoras comarcas, montañas espectaculares e islas frente a las costas hacen de Islandia un mundo único.', 5);
    `)
    console.log('- Entries creadas\n')

    // Photos
    console.log('- Agregando photos')
    await connection.query(`
    INSERT INTO photos(name, entryId)
    VALUES('paris.jpg', 1),
          ('bora_bora.jpg', 2),
          ('glacier_national_park.jpg', 3),
          ('rome01.jpg', 4),
          ('rome02.jpg', 4),
          ('santa_marta01.jpg', 5),
          ('santa_marta02.jpg', 5),
          ('santa_marta03.jpg', 5),
          ('iceland01.jpg', 6),
          ('iceland02.jpg', 6),
          ('iceland03.jpg', 6);
    `)
    console.log('- Photos creadas\n')

    console.log('Registros creados')

    console.log('-------------- db Lista --------------')
  } catch (error) {
    console.error(error)
  } finally {
    if (connection) connection.release()
    process.exit()
  }
}

init()
