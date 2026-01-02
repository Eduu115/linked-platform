import express from 'express'
import { authenticate, isAdmin } from '../middleware/auth.middleware.js'
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller.js'
import { validateService } from '../middleware/validation.middleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getServices)
router.get('/:id', getServiceById)

// Rutas protegidas (solo admin)
router.post('/', authenticate, isAdmin, validateService, createService)
router.put('/:id', authenticate, isAdmin, validateService, updateService)
router.delete('/:id', authenticate, isAdmin, deleteService)

export default router

