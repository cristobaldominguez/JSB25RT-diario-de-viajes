import { getEntryBy, newEntry, insertPhoto, getAllEntries, destroyPhoto } from '../db/queries/entries_queries.js'

// Services
import { savePhoto, deletePhoto } from '../services/photos.js'

// Config
import { maxImageSize } from '../config.js'

// Errors
import ValidationError from '../errors/validation_error.js'

async function createEntry (req, res, next) {
  try {
    const { title, place, description } = req.body
    const { id: userId } = req.user

    // Validar que datos obligatorios sean entregados
    if (!title) throw new ValidationError({ message: 'El campo title es obligatorio', field: 'title' })
    if (!place) throw new ValidationError({ message: 'El campo place es obligatorio', field: 'place' })
    if (!description) throw new ValidationError({ message: 'El campo description es obligatorio', field: 'description' })

    // Insertar entry en db
    const entry = await newEntry({ title, place, description, userId })
    if (entry instanceof Error) throw entry

    const photos = []
    if (req.files) {
      const reqPhotos = Object.values(req.files).slice(0, 3)
      for (const photo of reqPhotos) {
        // Guardamos la foto en el disco.
        const photoName = await savePhoto({ img: photo, width: maxImageSize })

        // Insertamos la foto y obtenemos los datos de la misma.
        const newPhoto = await insertPhoto({ photoName, entryId: entry.id })

        // Pusheamos la foto al array de fotos.
        photos.push(newPhoto)
      }
    }

    res.send({
      status: 'ok',
      data: {
        entry: {
          ...entry,
          photos
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

async function listEntries (req, res, next) {
  try {
    const { keyword } = req.query

    // Dado que la propiedad user puede no existir lo indicamos por medio de la interrogación.
    const entries = await getAllEntries({ keyword, userId: req.user?.id })

    res.send({
      status: 'ok',
      data: {
        entries
      }
    })
  } catch (err) {
    next(err)
  }
}

async function getEntry (req, res, next) {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const entry = await getEntryBy({ id, userId })

    res.send({
      status: 'ok',
      data: {
        entry
      }
    })
  } catch (err) {
    next(err)
  }
}

async function addPhoto (req, res, next) {
  try {
    const { id } = req.params
    const { id: userId } = req.user

    // Si no hay foto lanzamos un error.
    if (!req.files?.photo) {
      throw new Error('Faltan campos')
    }

    const entry = await getEntryBy({ id, userId })

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry.owner) {
      throw new Error('No tienes suficientes permisos')
    }

    // Si la entrada ya tiene tres fotos lanzamos un error.
    if (entry.photos.length > 2) {
      throw new Error('Límite de tres fotos alcanzado')
    }

    // Guardamos la foto en la carpeta uploads y obtenemos el nombre que le hemos dado.
    const photoName = await savePhoto({ img: req.files.photo, width: maxImageSize })

    // Guardamos la foto en la base de datos.
    const photo = await insertPhoto({ photoName, entryId: id })

    res.send({
      status: 'ok',
      data: {
        photo: {
          ...photo,
          entryId: Number(entry.id)
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

async function deleteEntryPhoto (req, res, next) {
  try {
    const { id, photoId } = req.params
    const { id: userId } = req.user

    const entry = await getEntryBy({ id, userId })

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry.owner) {
      throw new Error('No tienes suficientes permisos')
    }

    // Localizamos la foto en el array de fotos de la entrada.
    const photo = entry.photos.find((photo) => photo.id === Number(photoId))

    // Si no hay foto lanzamos un error.
    if (!photo) throw new Error('Foto no encontrada')

    // Borramos la foto de la carpeta uploads.
    await deletePhoto({ name: photo.name })

    // Borramos la foto en la base de datos.
    await destroyPhoto({ id: photoId })

    res.send({
      status: 'ok',
      message: 'Foto eliminada'
    })
  } catch (err) {
    next(err)
  }
}

export {
  createEntry,
  listEntries,
  getEntry,
  addPhoto,
  deleteEntryPhoto
}
