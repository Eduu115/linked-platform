import express from 'express'
import { authenticate, isClient, isAdmin } from '../middleware/auth.middleware.js'
import {
  getSubscriptions,
  getSubscriptionById,
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
} from '../controllers/subscription.controller.js'
import { validateSubscription } from '../middleware/validation.middleware.js'

const router = express.Router()

// Rutas protegidas - Cliente
router.get('/my-subscriptions', authenticate, isClient, getUserSubscriptions)
router.post('/', authenticate, isClient, validateSubscription, createSubscription)
router.put('/:id/cancel', authenticate, isClient, cancelSubscription)

// Rutas protegidas - Admin
router.get('/', authenticate, isAdmin, getSubscriptions)
router.get('/:id', authenticate, isAdmin, getSubscriptionById)

export default router

