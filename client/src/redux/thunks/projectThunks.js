import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../config/api'

const getAuthToken = () => {
  const token = localStorage.getItem('devtrack_token')
  console.log('🔑 projectThunks: Getting token from localStorage:', token ? 'Token exists' : 'No token found')
  return token
}

// Create a new project
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('📝 ProjectThunks: Creating project:', projectData)
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create project')
      }

      const newProject = await response.json()
      console.log('✅ ProjectThunks: Project created successfully:', newProject)
      return newProject

    } catch (error) {
      console.error('📝 ProjectThunks: Error creating project:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('📂 ProjectThunks: Fetching projects...')
      
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch projects')
      }

      const projects = await response.json()
      console.log('✅ ProjectThunks: Projects fetched successfully:', projects.length, 'projects')
      return projects

    } catch (error) {
      console.error('📂 ProjectThunks: Error fetching projects:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch a single project with tasks
export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (projectId, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('📂 ProjectThunks: Fetching project:', projectId)
      
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch project')
      }

      const project = await response.json()
      console.log('✅ ProjectThunks: Project fetched successfully:', project.name, 'with', project.tasks.length, 'tasks')
      return project

    } catch (error) {
      console.error('📂 ProjectThunks: Error fetching project:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Update a project
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('📝 ProjectThunks: Updating project:', projectId, projectData)
      
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update project')
      }

      const updatedProject = await response.json()
      console.log('✅ ProjectThunks: Project updated successfully:', updatedProject)
      return updatedProject

    } catch (error) {
      console.error('📝 ProjectThunks: Error updating project:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (projectId, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('🗑️ ProjectThunks: Deleting project:', projectId)
      
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete project')
      }

      console.log('✅ ProjectThunks: Project deleted successfully')
      return projectId

    } catch (error) {
      console.error('🗑️ ProjectThunks: Error deleting project:', error)
      return rejectWithValue(error.message)
    }
  }
)
