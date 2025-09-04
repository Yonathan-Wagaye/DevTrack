import express from 'express'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All dashboard routes require authentication
router.use(authenticateToken)

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats)

export default router
