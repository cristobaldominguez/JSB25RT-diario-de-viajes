import { getEntryBy, newEntry, updateEntry, insertPhoto, getAllEntries, destroyPhoto } from '../db/queries/entries_queries.js'

// Services
import { savePhoto, deletePhoto } from '../services/photos.js'

// Config
import { maxImageSize } from '../config.js'

// Errors
import ValidationError from '../errors/validation_error.js'
import ContentError from '../errors/content_error.js'
import AuthError from '../errors/auth_error.js'

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
        if (newPhoto instanceof Error) throw newPhoto

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
    if (entries instanceof Error) throw entries

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
    if (entry instanceof Error) throw entry

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

async function editEntry (req, res, next) {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Revisa si la entrada existe
    const originalEntry = await getEntryBy({ id, userId })
    if (originalEntry instanceof Error) throw originalEntry

    // Revisa si la entrada le pertenece al usuario logueado
    if (!originalEntry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

    const editedEntry = {
      ...originalEntry,
      ...req.body
    }

    const photos = []

    if (req.files) {
      const currentPhotosLength = originalEntry.photos.length
      const availablePhotoSpaces = 3 - currentPhotosLength
      if (availablePhotoSpaces === 0) throw new ContentError({ message: 'Tienes el número máximo de fotos, para agregar una debes eliminar una', status: 400 })

      const currentPhotos = Object.values(req.files).slice(0, availablePhotoSpaces)

      for (const photo of currentPhotos) {
        // Guardamos la foto en el disco.
        const photoName = await savePhoto({ img: photo, width: maxImageSize })

        // Insertamos la foto y obtenemos los datos de la misma.
        const newPhoto = await insertPhoto({ photoName, entryId: editedEntry.id })
        if (newPhoto instanceof Error) throw newPhoto

        // Pusheamos la foto al array de fotos.
        photos.push(newPhoto)
      }
    }

    const updatedEntry = await updateEntry(editedEntry)
    if (updatedEntry instanceof Error) throw updatedEntry

    res.send({
      status: 'ok',
      message: 'Entrada actualizada',
      data: {
        entry: updatedEntry
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
    if (!req.files?.photo) throw new ContentError({ message: 'Faltan campos', status: 400 })

    const entry = await getEntryBy({ id, userId })
    if (entry instanceof Error) throw entry

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

    // Si la entrada ya tiene tres fotos lanzamos un error.
    if (entry.photos.length > 2) throw new ContentError({ message: 'Límite de tres fotos alcanzado', status: 418 })

    // Guardamos la foto en la carpeta uploads y obtenemos el nombre que le hemos dado.
    const photoName = await savePhoto({ img: req.files.photo, width: maxImageSize })

    // Guardamos la foto en la base de datos.
    const photo = await insertPhoto({ photoName, entryId: id })
    if (photo instanceof Error) throw photo

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
    if (entry instanceof Error) throw entry

    // Si no somos los dueños de la entrada lanzamos un error.
    if (!entry.owner) throw new AuthError({ message: 'No tienes suficientes permisos', status: 401 })

    // Localizamos la foto en el array de fotos de la entrada.
    const photo = entry.photos.find((photo) => photo.id === Number(photoId))

    // Si no hay foto lanzamos un error.
    if (!photo) throw new ContentError({ message: 'Foto no encontrada', status: 404 })

    // Borramos la foto de la carpeta uploads.
    const deletedPhoto = await deletePhoto({ name: photo.name })
    if (deletedPhoto instanceof Error) throw deletedPhoto

    // Borramos la foto en la base de datos.
    const destroyedPhoto = await destroyPhoto({ id: photoId })
    if (destroyedPhoto instanceof Error) throw destroyedPhoto

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
  editEntry,
  addPhoto,
  deleteEntryPhoto
}
