import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  // Normalizar campos que pueden venir como arrays desde FormData
  if (req.body.image && Array.isArray(req.body.image)) {
    req.body.image = req.body.image[0]
  }
  
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('Validation errors:', JSON.stringify(errors.array(), null, 2))
    console.log('Request body:', JSON.stringify(req.body, null, 2))
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array(),
    })
  }
  next()
}

export const validateLogin = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
]

export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Phone must be valid'),
  handleValidationErrors,
]

export const validateProject = [
  body('name').optional().trim().notEmpty().withMessage('Project name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('technologies')
    .optional()
    .custom((value) => {
      // Si no hay valor, está bien (es opcional)
      if (value === undefined || value === null || value === '') return true
      // Aceptar array o string JSON
      if (Array.isArray(value)) return true
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed)
        } catch {
          // Si no es JSON, puede ser una lista separada por comas
          return true
        }
      }
      return false
    })
    .withMessage('Technologies must be an array or valid JSON string'),
  body('image').optional().custom((value) => {
    if (!value) return true
    // Si es un array (FormData puede duplicar campos), validar el primer valor
    if (Array.isArray(value)) {
      const firstValue = value[0]
      if (!firstValue) return true
      // Validar que sea un string no vacío
      return typeof firstValue === 'string' && firstValue.trim().length > 0
    }
    // Aceptar URL o ruta de archivo
    return typeof value === 'string' && value.trim().length > 0
  }).withMessage('Image must be a valid URL or file path'),
  body('previewUrl').optional().custom((value) => {
    if (!value) return true
    // Aceptar URL o string vacío
    return typeof value === 'string'
  }).withMessage('Preview URL must be valid'),
  body('detailsUrl').optional().custom((value) => {
    if (!value) return true
    // Aceptar cualquier string
    return typeof value === 'string'
  }).withMessage('Details URL must be valid'),
  handleValidationErrors,
]

// Validación para creación (todos los campos requeridos)
export const validateProjectCreate = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('technologies')
    .custom((value) => {
      // Aceptar array o string JSON
      if (Array.isArray(value)) return true
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed)
        } catch {
          // Si no es JSON, puede ser una lista separada por comas
          return true
        }
      }
      return false
    })
    .withMessage('Technologies must be an array or valid JSON string'),
  body('image').optional().custom((value) => {
    if (!value) return true
    // Si es un array (FormData puede duplicar campos), validar el primer valor
    if (Array.isArray(value)) {
      const firstValue = value[0]
      if (!firstValue) return true
      // Validar que sea un string no vacío
      return typeof firstValue === 'string' && firstValue.trim().length > 0
    }
    // Aceptar URL o ruta de archivo
    return typeof value === 'string' && value.trim().length > 0
  }).withMessage('Image must be a valid URL or file path'),
  body('previewUrl').optional().isURL().withMessage('Preview URL must be valid'),
  handleValidationErrors,
]

export const validateService = [
  body('title').trim().notEmpty().withMessage('Service title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').custom((value) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= 0
  }).withMessage('Price must be a positive number'),
  body('period').isIn(['mes', 'hora', 'sesión']).withMessage('Invalid period'),
  body('features')
    .custom((value) => {
      // Aceptar array o string JSON
      if (Array.isArray(value)) return true
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed)
        } catch {
          // Si no es JSON, puede ser una lista separada por líneas
          return true
        }
      }
      return false
    })
    .withMessage('Features must be an array or valid JSON string'),
  handleValidationErrors,
]

export const validateSubscription = [
  body('serviceId').isInt().withMessage('Service ID must be a valid integer'),
  handleValidationErrors,
]

