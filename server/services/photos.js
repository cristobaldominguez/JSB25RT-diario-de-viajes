import crypto from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import sharp from 'sharp'

import { root, UPLOADS_DIR } from '../config.js'

async function savePhoto ({ img, width }) {
  try {
    // Ruta absoluta al directorio de subida de archivos.
    const uploadsPath = path.resolve(root, UPLOADS_DIR)

    /*
    try {
      await fs.access(uploadsPath)
    } catch {
      // Si el método access lanza un error significa que la directorio no existe.
      // Lo creamos.
      await fs.mkdir(uploadsPath)
    }
    */

    // Creamos un objeto de tipo Sharp con la imagen dada.
    const sharpImg = sharp(img.data)

    // Redimensionamos la imagen. Width representa un tamaño en píxeles.
    sharpImg.resize(width)

    // Generamos un nombre único para la imagen dado que no podemos guardar dos imágenes
    // con el mismo nombre en la carpeta uploads.
    const randomName = crypto.randomUUID()
    const imgName = `${randomName}.jpg`

    // Ruta absoluta a la imagen.
    const imgPath = path.join(uploadsPath, imgName)

    // Guardamos la imagen.
    sharpImg.toFile(imgPath)

    // Retornamos el nombre de la imagen.
    return imgName
  } catch (err) {
    console.error(err)
    return new Error('Error al guardar la imagen en el servidor')
  }
}

async function deletePhoto ({ name }) {
  try {
    // Ruta absoluta al archivo que queremos elimiar.
    const imgPath = path.resolve(root, UPLOADS_DIR, name)

    try {
      await fs.access(imgPath)
    } catch {
      // Si no existe el archivo finalizamos la función.
      return
    }

    // Eliminamos el archivo de la carpeta de uploads.
    await fs.unlink(imgPath)
  } catch (err) {
    console.error(err)
    return new Error('Error al eliminar la imagen del servidor')
  }
}

export {
  savePhoto,
  deletePhoto
}
