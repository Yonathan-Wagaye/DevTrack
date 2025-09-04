import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  getProjectCommits,
  getProjectCommitStats,
  syncProjectCommits,
  validateGitHubRepo,
  getUserCommits
} from '../controllers/commitController.js'

const router = express.Router()

// Apply authentication middleware to all commit routes
router.use(authenticateToken)

// Commit routes
router.get('/user', getUserCommits)                              // GET /api/commits/user
router.get('/project/:projectId', getProjectCommits)             // GET /api/commits/project/:projectId
router.get('/project/:projectId/stats', getProjectCommitStats)   // GET /api/commits/project/:projectId/stats
router.post('/project/:projectId/sync', syncProjectCommits)      // POST /api/commits/project/:projectId/sync
router.post('/validate-repo', validateGitHubRepo)                // POST /api/commits/validate-repo

export default router
