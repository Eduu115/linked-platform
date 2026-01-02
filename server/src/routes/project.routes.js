import express from 'express'
import { authenticate, isAdmin } from '../middleware/auth.middleware.js'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js'
import { validateProject } from '../middleware/validation.middleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getProjects)
router.get('/:id', getProjectById)

// Rutas protegidas (solo admin)
router.post('/', authenticate, isAdmin, validateProject, createProject)
router.put('/:id', authenticate, isAdmin, validateProject, updateProject)
router.delete('/:id', authenticate, isAdmin, deleteProject)

export default router

