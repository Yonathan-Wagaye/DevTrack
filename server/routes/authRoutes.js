import express from 'express'
import { register, login, logout, getProfile } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', authenticateToken, logout)
router.get('/profile', authenticateToken, getProfile)

export default router
