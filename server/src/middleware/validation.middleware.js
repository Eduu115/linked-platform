import { body, validationResult } from 'express-validator'

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
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
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('technologies')
    .isArray()
    .withMessage('Technologies must be an array'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('previewUrl').optional().isURL().withMessage('Preview URL must be valid'),
  handleValidationErrors,
]

export const validateService = [
  body('title').trim().notEmpty().withMessage('Service title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('period').isIn(['mes', 'hora', 'sesión']).withMessage('Invalid period'),
  body('features').isArray().withMessage('Features must be an array'),
  handleValidationErrors,
]

export const validateSubscription = [
  body('serviceId').isInt().withMessage('Service ID must be a valid integer'),
  handleValidationErrors,
]

