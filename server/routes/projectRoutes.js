import express from 'express'
import { 
  createProject, 
  getProjects, 
  getProject, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All project routes require authentication
router.use(authenticateToken)

// GET /api/projects - Get all projects for user
router.get('/', getProjects)

// POST /api/projects - Create a new project
router.post('/', createProject)

// GET /api/projects/:id - Get single project with tasks
router.get('/:id', getProject)

// PUT /api/projects/:id - Update project
router.put('/:id', updateProject)

// DELETE /api/projects/:id - Delete project
router.delete('/:id', deleteProject)

export default router
