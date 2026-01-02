import express from 'express'
import { authenticate, isAdmin } from '../middleware/auth.middleware.js'
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
} from '../controllers/user.controller.js'

const router = express.Router()

// Rutas protegidas
router.get('/profile', authenticate, getProfile)
router.put('/profile', authenticate, updateProfile)

// Rutas de admin
router.get('/', authenticate, isAdmin, getAllUsers)
router.get('/:id', authenticate, isAdmin, getUserById)

export default router

