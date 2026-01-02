import express from 'express'
import multer from 'multer'
import { authenticate, isAdmin } from '../middleware/auth.middleware.js'
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js'
import { validateProject, validateProjectCreate } from '../middleware/validation.middleware.js'
import { uploadCoverImage } from '../middleware/upload.middleware.js'

const router = express.Router()

// Rutas públicas
router.get('/', getProjects)
router.get('/:id', getProjectById)

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB',
      })
    }
    return res.status(400).json({
      success: false,
      message: `Error al subir archivo: ${err.message}`,
    })
  }
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
  next()
}

// Rutas protegidas (solo admin)
router.post('/', authenticate, isAdmin, uploadCoverImage, handleMulterError, validateProjectCreate, createProject)
router.put('/:id', authenticate, isAdmin, uploadCoverImage, handleMulterError, validateProject, updateProject)
router.delete('/:id', authenticate, isAdmin, deleteProject)

export default router

