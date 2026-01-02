import express from 'express'
import { login, register } from '../controllers/auth.controller.js'
import { validateLogin, validateRegister } from '../middleware/validation.middleware.js'

const router = express.Router()

router.post('/login', validateLogin, login)
router.post('/register', validateRegister, register)

export default router

