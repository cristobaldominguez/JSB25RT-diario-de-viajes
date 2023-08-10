import express from 'express'

// Controllers
import userController from '../controllers/user_controller.js'

const router = express.Router()

// POST /users/
router.post('/', userController.createUser)

export default router
