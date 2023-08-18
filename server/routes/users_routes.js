import express from 'express'

// Controllers
import * as userController from '../controllers/user_controller.js'

// Middlewares
import authUser from '../middlewares/auth_user.js'
import userExists from '../middlewares/user_exists.js'

const router = express.Router()

// POST /users/
router.post('/', userController.createUser)

// POST /users/validate/e20b73bc-ab27-4edc-823b-807fba206bec
router.post('/validate/:regCode', userController.validateUser)

// POST /users/login
router.post('/login', userController.loginUser)

// GET /users/1
router.get('/:userId', authUser, userExists, userController.getUser)

// PUT /users/avatar
router.put('/avatar', authUser, userExists, userController.editUserAvatar)

// PUT /users/recover-password
router.put('/recover-password', userController.sendRecoverPass)

// PUT /users/reset-password
router.put('/reset-password', userController.editUserPass)

export default router
