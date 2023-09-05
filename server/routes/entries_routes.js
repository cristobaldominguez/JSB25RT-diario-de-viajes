import express from 'express'

// Middlewares
import authUser from '../middlewares/auth_user.js'
import userExists from '../middlewares/user_exists.js'
import authUserOptional from '../middlewares/auth_user_optional.js'

// Controllers
import * as entryController from '../controllers/entry_controller.js'

const router = express.Router()

// Routes

// Crear una entrada
// POST /entries/
router.post('/', authUser, userExists, entryController.createEntry)

// Obtener todas las entradas
// GET /entries/
router.get('/', authUserOptional, userExists, entryController.listEntries)

// Obtener una sola entrada
// GET /entries/1
router.get('/:id', authUserOptional, userExists, entryController.getEntry)

// PUT /entries/1
router.put('/:id', authUser, userExists, entryController.editEntry)
router.patch('/:id', authUser, userExists, entryController.editEntry)

// Agregar imágenes al post
// POST /entries/1/photos
router.post('/:id/photos', authUser, userExists, entryController.addPhoto)

// Borrar una foto
// DELETE /entries/4/photos/9
router.delete('/:id/photos/:photoId', authUser, userExists, entryController.deleteEntryPhoto)

export default router
